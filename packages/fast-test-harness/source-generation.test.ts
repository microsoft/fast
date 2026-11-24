import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startServer } from "./server.mjs";
import defaultConfig, { createHarnessConfig } from "./vite.config.mjs";

const configModule = new URL("./vite.config.mjs", import.meta.url).href;
const elementRoot = dirname(
    fileURLToPath(import.meta.resolve("@microsoft/fast-element/package.json")),
);
const template = (text: string) =>
    `<f-template name="source-widget"><template><p>${text} {{message}}</p></template></f-template>`;

async function workspace(t: any) {
    const root = await mkdtemp(join(tmpdir(), "fast-harness-sources-"));
    await mkdir(join(root, "src"));
    let server: Awaited<ReturnType<typeof startServer>> | undefined;
    t.after(async () => {
        await server?.close();
        await rm(root, { recursive: true, force: true });
    });
    await Promise.all([
        writeFile(join(root, "package.json"), '{"type":"module"}'),
        writeFile(join(root, ".gitignore"), "generated/\n"),
        writeFile(join(root, "src/widget.html"), template("HTML A")),
        writeFile(join(root, "src/widget.css"), ":host { --test-color: red; }"),
        writeFile(join(root, "src/state.ts"), 'export const message: string = "TS A";'),
        writeFile(
            join(root, "src/main.ts"),
            `import { FASTElement } from "@microsoft/fast-element/fast-element.js";
            import { template } from "../generated/widget.template.js";
            import { styles } from "../generated/widget.styles.js";
            import { message } from "./state.js";
            class SourceWidget extends FASTElement { message = message; }
            await SourceWidget.define({name:"source-widget", template, styles});`,
        ),
        writeFile(
            join(root, "index.html"),
            '<!doctype html><source-widget></source-widget><script type="module" src="/src/main.ts"></script>',
        ),
        writeFile(join(root, "ssr.html"), "<!doctype html><!--fixture-->"),
        writeFile(
            join(root, "src/entry-server.ts"),
            `import html from "./widget.html?raw";
            import css from "./widget.css?raw";
            import { message } from "./state.js";
            export function render() {
                return { fixture: html + "<style>" + css + "</style><b>" + message + "</b>" };
            }`,
        ),
        writeFile(
            join(root, "vite.config.mjs"),
            `import { createHarnessConfig } from ${JSON.stringify(configModule)};
            export default createHarnessConfig({
                sourceGeneration: { root: "./src", outDir: "./generated" },
                resolve: { alias: ${JSON.stringify(
                    Object.fromEntries(
                        ["html.js", "css.js", "fast-element.js"].map(name => [
                            `@microsoft/fast-element/${name}`,
                            fileURLToPath(
                                import.meta.resolve(`@microsoft/fast-element/${name}`),
                            ),
                        ]),
                    ),
                )} },
                server: { fs: { allow: ${JSON.stringify([root, elementRoot])} } }
            });`,
        ),
    ]);
    return {
        root,
        async start() {
            server = await startServer(root, root, join(root, "vite.config.mjs"), {
                port: 0,
            });
            return `http://localhost:${server.port}`;
        },
        async stop() {
            await server?.close();
            server = undefined;
        },
    };
}

test("legacy configuration stays the default", () => {
    const config = createHarnessConfig();
    assert.deepEqual(config, defaultConfig);
    assert.equal(
        createHarnessConfig({ sourceGeneration: false }).plugins?.length ?? 0,
        0,
    );
});

test("source mode generates on a clean checkout and watches HTML, CSS and TypeScript", {
    timeout: 120_000,
}, async t => {
    const app = await workspace(t);
    await assert.rejects(stat(join(app.root, "generated")));
    const origin = await app.start();
    const browser = await chromium.launch();
    t.after(() => browser.close());
    const page = await browser.newPage();
    page.on("pageerror", error => t.diagnostic(error.message));
    await page.goto(origin);
    const element = page.locator("source-widget");
    const text = element.locator("p");
    await expect(text).toHaveText("HTML A TS A");
    const color = () =>
        element
            .evaluate(el => getComputedStyle(el).getPropertyValue("--test-color").trim())
            .catch(() => "");
    await expect.poll(color).toBe("red");
    let fixtureUrl = "";
    const renderSSR = async () => {
        if (!fixtureUrl) {
            const result = await fetch(`${origin}/generate-fixture`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ testId: "source-edit" }),
            });
            assert.equal(result.status, 200);
            fixtureUrl = (await result.json()).url;
        }
        const result = await fetch(origin + fixtureUrl);
        assert.equal(result.status, 200);
        return await result.text();
    };
    assert.match(await renderSSR(), /HTML A/);
    const ssrPage = await browser.newPage();
    await ssrPage.goto(origin + fixtureUrl);
    await expect(ssrPage.locator("b")).toHaveText("TS A");
    await writeFile(join(app.root, "src/widget.html"), template("HTML B"));
    await expect(text).toHaveText("HTML B TS A");
    assert.match(await renderSSR(), /HTML B/);
    await expect.poll(() => ssrPage.content()).toContain("HTML B");
    await writeFile(join(app.root, "src/widget.css"), ":host { --test-color: blue; }");
    await expect.poll(color).toBe("blue");
    assert.match(await renderSSR(), /--test-color: blue/);
    const generated = join(app.root, "generated/widget.template.ts");
    const before = (await stat(generated)).mtimeMs;
    await writeFile(
        join(app.root, "src/state.ts"),
        'export const message: string = "TS B";',
    );
    await expect(text).toHaveText("HTML B TS B");
    assert.match(await renderSSR(), /<b>TS B<\/b>/);
    await expect(ssrPage.locator("b")).toHaveText("TS B");
    assert.equal((await stat(generated)).mtimeMs, before);
    const held = await readFile(generated, "utf8");
    await writeFile(join(app.root, "src/widget.html"), "<broken>");
    await expect.poll(async () => (await fetch(origin)).status).toBe(500);
    assert.equal(await readFile(generated, "utf8"), held);
    await writeFile(join(app.root, "src/widget.html"), template("Recovered"));
    await expect(text).toHaveText("Recovered TS B");
    await expect.poll(() => ssrPage.content()).toContain("Recovered");
    assert.equal((await fetch(origin, { headers: { Accept: "text/html" } })).status, 200);
    const config = join(app.root, "vite.config.mjs");
    await writeFile(
        config,
        (await readFile(config, "utf8")).replace(
            "sourceGeneration:",
            'plugins: [{ name: "restart-proof", transformIndexHtml: html => html + "<!--restarted-->" }], sourceGeneration:',
        ),
    );
    await expect.poll(() => page.content()).toContain("<!--restarted-->");
    await writeFile(
        join(app.root, "src/state.ts"),
        'export const message: string = "TS C";',
    );
    await expect(text).toHaveText("Recovered TS C");
    await expect(ssrPage.locator("b")).toHaveText("TS C");
});

test("nested sources are watched and only owned stale outputs are removed", async t => {
    const app = await workspace(t);
    await app.start();
    await mkdir(join(app.root, "src/nested"));
    await writeFile(join(app.root, "src/nested/widget.html"), template("Nested"));
    await writeFile(join(app.root, "src/nested/widget.css"), ":host { color: green; }");
    const output = join(app.root, "generated/nested");
    await expect
        .poll(() => readFile(join(output, "widget.template.ts"), "utf8").catch(() => ""))
        .toContain("Nested");
    await expect
        .poll(() => readFile(join(output, "widget.styles.ts"), "utf8").catch(() => ""))
        .toContain("color: green");
    const handwritten = join(output, "handwritten.ts");
    await writeFile(handwritten, "export const keep = true;\n");
    await rm(join(app.root, "src/nested/widget.css"));
    await expect
        .poll(() =>
            stat(join(output, "widget.styles.ts")).then(
                () => true,
                () => false,
            ),
        )
        .toBe(false);
    await app.stop();
    await rm(join(app.root, "src/nested/widget.html"));
    await app.start();
    await assert.rejects(stat(join(output, "widget.template.ts")));
    assert.equal(await readFile(handwritten, "utf8"), "export const keep = true;\n");
});

test("source generation never overwrites handwritten TypeScript", async t => {
    const app = await workspace(t);
    await mkdir(join(app.root, "generated"));
    const output = join(app.root, "generated/widget.template.ts");
    await writeFile(output, "export const handwritten = true;\n");
    await assert.rejects(app.start(), /Refusing to overwrite/);
    assert.equal(await readFile(output, "utf8"), "export const handwritten = true;\n");
});

test("source generation rejects directory overlap and symlink output traversal", async t => {
    const app = await workspace(t);
    const config = join(app.root, "vite.config.mjs");
    const original = await readFile(config, "utf8");
    await writeFile(config, original.replace('outDir: "./generated"', 'outDir: "."'));
    await assert.rejects(app.start(), /outDir must not contain root/);
    await writeFile(config, original);
    await mkdir(join(app.root, "src/nested"));
    await writeFile(join(app.root, "src/nested/widget.html"), template("Nested"));
    await mkdir(join(app.root, "outside"));
    await mkdir(join(app.root, "generated"));
    await symlink(
        join(app.root, "outside"),
        join(app.root, "generated/nested"),
        "junction",
    );
    await assert.rejects(app.start(), /cannot use a symbolic link/);
    await assert.rejects(stat(join(app.root, "outside/widget.template.ts")));
    await assert.rejects(stat(join(app.root, "generated/widget.template.ts")));
});

test("source globs can select templates and disable stylesheet generation", async t => {
    const app = await workspace(t);
    await writeFile(
        join(app.root, "src/shell.html"),
        "<!doctype html><title>Shell</title>",
    );
    const config = join(app.root, "vite.config.mjs");
    await writeFile(
        config,
        (await readFile(config, "utf8")).replace(
            'root: "./src", outDir:',
            'root: "./src", templates: ["widget.html"], stylesheets: false, outDir:',
        ),
    );
    await app.start();
    assert.match(
        await readFile(join(app.root, "generated/widget.template.ts"), "utf8"),
        /export const template/,
    );
    await assert.rejects(stat(join(app.root, "generated/shell.template.ts")));
    await assert.rejects(stat(join(app.root, "generated/widget.styles.ts")));
});
