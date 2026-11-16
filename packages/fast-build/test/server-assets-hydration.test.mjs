import assert from "node:assert/strict";
import * as fs from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const { writeServerAssets } = require("../server.js");
const here = path.dirname(fileURLToPath(import.meta.url));
const esm = path.resolve(here, "../../fast-element/dist/esm");
const runtime = pathToFileURL(require.resolve("../server-runtime.mjs")).href;

test("modular output hydrates both marker formats without replacing shadow or light nodes", async () => {
    assert.ok(
        fs.existsSync(path.join(esm, "index.js")),
        "Build @microsoft/fast-element first.",
    );
    const directory = fs.mkdtempSync(path.join(here, ".modular-hydration-"));
    const oldTmpdir = process.env.TMPDIR;
    process.env.TMPDIR = directory;
    let browser;
    const server = createServer((request, response) => {
        const filename = path.resolve(
            esm,
            `.${new URL(request.url, "http://localhost").pathname}`,
        );
        if (!filename.startsWith(`${esm}${path.sep}`) || !fs.existsSync(filename)) {
            response.writeHead(404).end();
            return;
        }
        response.setHeader("Content-Type", "text/javascript");
        response.end(fs.readFileSync(filename));
    });
    try {
        await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
        const origin = `http://127.0.0.1:${server.address().port}`;
        browser = await chromium.launch({ headless: true });
        const content = "<p>{{text}}</p><slot></slot>";
        const inputs = {
            entry: '<asset-card text="{{text}}"><span>light</span></asset-card>',
            templates: { "asset-card": content },
        };
        const deployment = path.join(directory, "deployment");
        writeServerAssets(deployment, inputs, { runtimeImport: runtime });
        const module = await import(
            pathToFileURL(path.join(deployment, "server.mjs")).href
        );
        for (const markersV2 of [false, true]) {
            const page = await browser.newPage();
            const errors = [];
            page.on("pageerror", error => errors.push(error.message));
            const html = `<!doctype html><meta charset="utf-8">${module.renderEntry({ text: "Server & é" }, { markersV2 })}<f-template name="asset-card"><template>${content}</template></f-template>`;
            await page.route(`${origin}/fixture`, route =>
                route.fulfill({ contentType: "text/html", body: html }),
            );
            await page.goto(`${origin}/fixture`);
            const nodes = await page.evaluateHandle(() => {
                const host = document.querySelector("asset-card");
                return {
                    host,
                    root: host.shadowRoot,
                    paragraph: host.shadowRoot.querySelector("p"),
                    text: Array.from(host.shadowRoot.querySelector("p").childNodes).find(
                        node => node.nodeType === Node.TEXT_NODE,
                    ),
                    light: host.querySelector("span"),
                };
            });
            await page.evaluate(
                async ({ origin, markersV2 }) => {
                    const { FASTElement } = await import(
                        `${origin}/components/fast-element.js`
                    );
                    const { attr } = await import(`${origin}/components/attributes.js`);
                    const { declarativeTemplate } = await import(
                        `${origin}/declarative/index.js`
                    );
                    const { enableHydration, markers_v2 } = await import(
                        `${origin}/hydration/exports.js`
                    );
                    class AssetCard extends FASTElement {
                        constructor() {
                            super();
                            this.text = "default";
                        }
                    }
                    attr(AssetCard.prototype, "text");
                    AssetCard.define({
                        name: "asset-card",
                        template: declarativeTemplate(),
                    });
                    await enableHydration(
                        markersV2 ? { markers: markers_v2 } : {},
                    ).whenHydrated();
                },
                { origin, markersV2 },
            );
            assert.deepEqual(
                await nodes.evaluate(({ host, root, paragraph, text, light }) => ({
                    root: host.shadowRoot === root,
                    paragraph: root.querySelector("p") === paragraph,
                    text: {
                        sameParent: text.parentNode === paragraph,
                        value: text.textContent,
                        rendered: paragraph.textContent,
                        attribute: host.getAttribute("text"),
                    },
                    light: host.querySelector("span") === light,
                })),
                {
                    root: true,
                    paragraph: true,
                    text: {
                        sameParent: true,
                        value: "Server & é",
                        rendered: "Server & é",
                        attribute: "Server & é",
                    },
                    light: true,
                },
            );
            await page
                .locator("asset-card")
                .evaluate(host => host.setAttribute("text", "Changed &<>"));
            await page.waitForFunction(
                () =>
                    document.querySelector("asset-card").shadowRoot.querySelector("p")
                        .textContent === "Changed &<>",
            );
            assert.equal(
                await nodes.evaluate(
                    ({ paragraph, text }) => text.parentNode === paragraph,
                ),
                true,
            );
            assert.deepEqual(errors, []);
            await nodes.dispose();
            await page.close();
        }
    } finally {
        await browser?.close();
        await new Promise(resolve => server.close(resolve));
        if (oldTmpdir === undefined) delete process.env.TMPDIR;
        else process.env.TMPDIR = oldTmpdir;
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
