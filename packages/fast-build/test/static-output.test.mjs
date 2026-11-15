import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { chromium, firefox, webkit } from "@playwright/test";
import { createServer } from "vite";
import { compileServerModule } from "../server.js";

const directory = fileURLToPath(new URL("./fixtures/static-output/", import.meta.url));
const root = path.resolve(directory, "../../../../..");
const input = JSON.parse(readFileSync(path.join(directory, "input.json"), "utf8"));
const legacy = readFileSync(path.join(directory, "legacy.html"), "utf8");
const modern = readFileSync(path.join(directory, "modern.html"), "utf8");
const source = compileServerModule(
    input.entry,
    input.templates,
    new URL("../server-runtime.mjs", import.meta.url).href,
);
const serverModule = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const emitted = serverModule.renderEntry(input.state);
assert.equal(emitted, modern, "JS and native frozen modern output must agree");
const noDsd = serverModule.renderEntry(input.state, { dsd: [] });
const outputs = { legacy, modern: emitted, noDsd };
const expectedWhitespace = "  first\n\tsecond & < \n";

test("actual emitted DSD preserves browser parsing, hydration and whitespace", async t => {
    const server = await createServer({
        configFile: false,
        root,
        cacheDir: path.join(root, ".qualification-vite-cache"),
        optimizeDeps: { noDiscovery: true },
        server: { host: "127.0.0.1", port: 0 },
        plugins: [
            {
                name: "static-output-qualification",
                configureServer(server) {
                    server.middlewares.use((request, response, next) => {
                        const policy = request.url?.slice(1);
                        if (!Object.hasOwn(outputs, policy)) {
                            return next();
                        }
                        response.setHeader("Content-Type", "text/html; charset=utf-8");
                        response.end(
                            `<!doctype html><meta charset="utf-8">${outputs[policy]}`,
                        );
                    });
                },
            },
        ],
    });
    await server.listen();
    const address = server.httpServer.address();
    const base = `http://127.0.0.1:${address.port}`;
    try {
        for (const [name, browserType] of Object.entries({ chromium, firefox, webkit })) {
            await t.test(name, async () => {
                const browser = await browserType.launch();
                t.diagnostic(`${name} ${browser.version()}`);
                try {
                    const results = [];
                    for (const policy of ["legacy", "modern"]) {
                        const page = await browser.newPage();
                        const errors = [];
                        page.on("pageerror", error => errors.push(error.message));
                        const response = await page.goto(`${base}/${policy}`);
                        assert.equal(
                            (await response.body()).toString("utf8"),
                            `<!doctype html><meta charset="utf-8">${outputs[policy]}`,
                            "delivery must preserve the complete UTF-8 output",
                        );
                        assert.equal(
                            await page
                                .locator("qualified-card")
                                .evaluate(host => !!host.shadowRoot),
                            true,
                            "the real navigation parser must attach DSD before client imports",
                        );
                        const result = await page.evaluate(async state => {
                            const { qualify } = await import(
                                "/packages/fast-build/test/fixtures/static-output/client.ts"
                            );
                            return qualify(state);
                        }, input.state);
                        assert.equal(result.hydrated, true);
                        assert.deepEqual(result.identity, {
                            elements: true,
                            text: true,
                            nested: true,
                            scope: true,
                            repeat: true,
                            whitespace: true,
                        });
                        assert.equal(result.snapshot.pre, expectedWhitespace);
                        assert.equal(result.snapshot.textarea, expectedWhitespace);
                        assert.equal(result.snapshot.inline, "A B\nC");
                        assert.equal(result.snapshot.scope, "  scoped\n text ");
                        assert.equal(result.snapshot.role, "group");
                        assert.equal(result.snapshot.title, "default & <");
                        assert.equal(result.snapshot.boundTitle, input.state.label);
                        assert.equal(result.snapshot.delegatesFocus, true);
                        assert.equal(result.snapshot.clonable, true);
                        assert.equal(result.snapshot.serializable, true);
                        assert.deepEqual(result.closed, [
                            {
                                publicRoot: null,
                                mode: "closed",
                                delegatesFocus: true,
                                text: "closed",
                            },
                            {
                                publicRoot: null,
                                mode: "closed",
                                delegatesFocus: false,
                                text: "conflict",
                            },
                            {
                                publicRoot: null,
                                mode: "closed",
                                delegatesFocus: false,
                                text: "legacy input",
                            },
                        ]);
                        assert.equal(result.updated.heading, "updated & < 😄");
                        assert.equal(result.updated.title, "updated & < 😄");
                        assert.equal(result.updated.nested, "updated & < 😄");
                        assert.equal(result.updated.conditional, true);
                        assert.deepEqual(result.updated.repeat, ["one", "two", "three"]);
                        assert.equal(result.updated.pre, expectedWhitespace);
                        assert.equal(result.updated.textarea, expectedWhitespace);
                        assert.equal(result.updated.inline, "A B\nC");
                        assert.equal(result.updated.scope, "  scoped\n text ");
                        assert.equal(result.updated.textIdentity, true);
                        assert.deepEqual(errors, []);
                        results.push(result);
                        // innerHTML deliberately does not attach DSD, regardless of alias policy.
                        const inert = await page.evaluate(markup => {
                            const inertDocument =
                                document.implementation.createHTMLDocument();
                            const container = inertDocument.createElement("div");
                            container.innerHTML = markup;
                            return {
                                root: !!container.firstElementChild.shadowRoot,
                                templates: container.querySelectorAll("template").length,
                            };
                        }, outputs[policy]);
                        assert.equal(inert.root, false);
                        assert.equal(inert.templates, 4);
                        await page.close();
                    }
                    assert.deepEqual(results[1], results[0]);
                    const noDsdPage = await browser.newPage();
                    await noDsdPage.goto(`${base}/noDsd`);
                    assert.deepEqual(
                        await noDsdPage.evaluate(() => ({
                            roots: [...document.querySelectorAll("body > *")].some(
                                host => host.shadowRoot,
                            ),
                            templates: document.querySelectorAll("template").length,
                        })),
                        { roots: false, templates: 0 },
                    );
                    await noDsdPage.close();
                } finally {
                    await browser.close();
                }
            });
        }
        assert.equal(
            noDsd,
            "<qualified-card></qualified-card>\n<qualified-closed></qualified-closed>\n<qualified-conflict></qualified-conflict>\n<qualified-legacy></qualified-legacy>",
        );
        t.diagnostic(
            JSON.stringify({
                boundary: "raw-rendered-HTML-only; no timings or external page assembly",
                legacy: {
                    utf16Units: legacy.length,
                    utf8Bytes: Buffer.byteLength(legacy),
                    gzipBytes: gzipSync(legacy).length,
                    brotliBytes: brotliCompressSync(legacy).length,
                },
                modern: {
                    utf16Units: modern.length,
                    utf8Bytes: Buffer.byteLength(modern),
                    gzipBytes: gzipSync(modern).length,
                    brotliBytes: brotliCompressSync(modern).length,
                },
                noDsdUtf8Bytes: Buffer.byteLength(noDsd),
            }),
        );
    } finally {
        await server.close();
    }
});
