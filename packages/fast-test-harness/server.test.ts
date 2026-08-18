import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test } from "node:test";
import { startServer } from "./server.mjs";

async function createTestRoot(workspace: string, name: string) {
    const root = resolve(workspace, name, "test");
    const source = resolve(root, "src");
    await mkdir(source, { recursive: true });

    await Promise.all([
        writeFile(
            resolve(root, "index.html"),
            `<!doctype html><title>${name}</title><a href="/@vite/client">Vite</a><a href="/${name}/fixture">Fixture</a><script type="module" src="/src/main.js"></script>`,
        ),
        writeFile(
            resolve(root, "ssr.html"),
            `<!doctype html><title><!--fixturetitle--></title><!--stylespreload--><body><!--fixture--><!--templates--><script type="module" src="/src/entry-client.js"></script></body>`,
        ),
        writeFile(
            resolve(root, "asset.svg"),
            `<svg xmlns="http://www.w3.org/2000/svg"><title>${name}</title></svg>`,
        ),
        writeFile(resolve(source, "main.js"), `export const route = "${name}";`),
        writeFile(resolve(source, "entry-client.js"), "export {};"),
        writeFile(
            resolve(source, "entry-server.js"),
            `export function render(body) {
                return {
                    template: "",
                    fixture: \`<p data-route="${name}">\${body.tagName}</p>\`,
                    preloadLinks: "",
                };
            }`,
        ),
    ]);

    return root;
}

test("serves independent CSR and SSR roots under separate routes", async t => {
    const workspace = await mkdtemp(resolve(tmpdir(), "fast-test-harness-"));
    const firstRoot = await createTestRoot(workspace, "first");
    const secondRoot = await createTestRoot(workspace, "second");
    const harness = await startServer(workspace, workspace, undefined, {
        port: 0,
        routes: [
            { base: "/first/", root: firstRoot },
            { base: "/second/", root: secondRoot },
        ],
    });

    t.after(async () => {
        await harness.close();
        await rm(workspace, { recursive: true, force: true });
    });

    const origin = `http://localhost:${harness.port}`;
    const navigation = { headers: { Accept: "text/html" } };
    const firstPage = await fetch(`${origin}/first/`, navigation);
    const secondPage = await fetch(`${origin}/second/`, navigation);

    assert.equal(firstPage.status, 200);
    const firstHtml = await firstPage.text();
    assert.match(firstHtml, /<title>first<\/title>/);
    assert.match(firstHtml, /href="\/@vite\/client"/);
    assert.doesNotMatch(firstHtml, /href="\/first\/@vite\/client"/);
    assert.match(firstHtml, /href="\/first\/fixture"/);
    assert.doesNotMatch(firstHtml, /href="\/first\/first\/fixture"/);
    assert.match(firstHtml, /src="\/first\/src\/main\.js"/);
    assert.equal(secondPage.status, 200);
    assert.match(await secondPage.text(), /<title>second<\/title>/);

    const firstAsset = await fetch(`${origin}/first/asset.svg`);
    assert.equal(firstAsset.status, 200);
    assert.equal(firstAsset.headers.get("content-type"), "image/svg+xml");
    assert.match(await firstAsset.text(), /<title>first<\/title>/);

    for (const route of ["first", "second"]) {
        const generated = await fetch(`${origin}/${route}/generate-fixture`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testId: "shared", tagName: `${route}-element` }),
        });
        const result = await generated.json();
        const fixture = await fetch(`${origin}${result.url}`);

        assert.equal(result.url, `/${route}/ssr-shared.html`);
        assert.match(await fixture.text(), new RegExp(`data-route="${route}"`));
    }
});
