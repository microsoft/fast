import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import {
    compileArtifacts,
    createPreparedRuntime,
} from "@microsoft/fast-build/prepared.js";

const require = createRequire(import.meta.url);
const build = require("@microsoft/fast-build/wasm/microsoft_fast_build.js");
const convert = require("@microsoft/fast-build/wasm/convert/microsoft_fast_convert.js");
const state = {
    heading: "Parent before",
    message: "Child <& before",
    items: [{ label: "Alpha" }, { label: "Beta" }],
    show: true,
    clicks: 0,
};
const entry = readFileSync(
    new URL("./composed-entry.html", import.meta.url),
    "utf8",
).replace('"__STATE__"', JSON.stringify(state).replaceAll("<", "\\u003c"));
const templates: Record<string, any> = {};
const modules = new Map<string, string>();
for (const name of ["parent", "child"]) {
    const source = readFileSync(
        new URL(`./composed-${name}.html`, import.meta.url),
        "utf8",
    );
    const [definition] = JSON.parse(build.parse_f_templates(source));
    templates[definition.name] = definition;
    modules.set(
        `\0composed-${name}`,
        convert.convert_template(source, "fast-v3-ts").output,
    );
}

let client: string;
test.beforeAll(async () => {
    const bundle = await rollup({
        input: fileURLToPath(new URL("./composed-main.mjs", import.meta.url)),
        plugins: [
            {
                name: "independently-converted-components",
                resolveId(id) {
                    for (const name of ["parent", "child"]) {
                        if (id === `./composed-${name}.template.js`) {
                            return `\0composed-${name}`;
                        }
                    }
                },
                load(id) {
                    return modules.get(id);
                },
            },
            nodeResolve(),
        ],
    });
    try {
        const { output } = await bundle.generate({ format: "es" });
        const chunk = output.find(item => item.type === "chunk");
        if (!chunk) {
            throw new Error("Missing composed client bundle.");
        }
        client = chunk.code;
    } finally {
        await bundle.close();
    }
});

for (const markersV2 of [false, true]) {
    for (const mode of ["sync", "prepared", "prepared-stream"]) {
        test(`independent conversion hydrates nested ${mode} output, markersV2=${markersV2}`, async ({
            page,
        }) => {
            const expected = build.render_entry_with_templates(
                entry,
                JSON.stringify(templates),
                JSON.stringify(state),
                undefined,
                false,
                markersV2,
            );
            let html = expected;
            if (mode !== "sync") {
                const compiled = compileArtifacts({
                    entries: { composed: entry },
                    templates,
                });
                const runtime = createPreparedRuntime({
                    manifest: compiled.manifest,
                    loadArtifact: async id => {
                        const bytes = compiled.artifacts.get(id);
                        if (!bytes) {
                            throw new Error(`Missing composed artifact ${id}`);
                        }
                        return bytes;
                    },
                });
                try {
                    const rendered = await runtime.render("composed", state, {
                        markersV2,
                        stream: mode === "prepared-stream",
                    });
                    html = Array.isArray(rendered) ? rendered.join("") : rendered;
                } finally {
                    await runtime.dispose();
                }
                expect(html).toBe(expected);
            }

            const errors: string[] = [];
            page.on("pageerror", error => errors.push(error.message));
            await page.route("http://composed-components.test/**", route => {
                const isClient = new URL(route.request().url()).pathname === "/client.js";
                return route.fulfill({
                    contentType: isClient ? "text/javascript" : "text/html",
                    body: isClient ? client : html,
                });
            });
            await page.goto("http://composed-components.test/");
            await page.waitForFunction(
                () => typeof (window as any).startHydration === "function",
            );
            const parent = page.locator("composed-parent");
            const child = parent.locator("composed-child");
            await expect(parent).toHaveAttribute("role", "region");
            await expect(child).toHaveAttribute("role", "status");
            await expect(parent.locator("h2")).toHaveText(state.heading);
            await expect(child.locator(".message")).toHaveText(state.message);
            await expect(child.locator("li")).toHaveText(["Alpha", "Beta"]);
            await expect(parent.locator("h2")).toHaveCSS("color", "rgb(12, 34, 56)");
            await expect(child.locator(".message")).toHaveCSS("color", "rgb(65, 43, 21)");
            expect(
                await page.evaluate(() => {
                    const parent = document.querySelector("composed-parent")!;
                    const child = parent.shadowRoot!.querySelector("composed-child")!;
                    (window as any).ssrNodes = [
                        parent.shadowRoot!.querySelector("h2"),
                        parent.shadowRoot!.querySelector("style"),
                        child,
                        child.shadowRoot!.querySelector(".message"),
                        child.shadowRoot!.querySelector("li"),
                        child.shadowRoot!.querySelector("style"),
                    ];
                    return {
                        parentRegistered: !!customElements.get("composed-parent"),
                        childRegistered: !!customElements.get("composed-child"),
                        delegatesFocus: parent.shadowRoot!.delegatesFocus,
                        unknownShadow:
                            parent.shadowRoot!.querySelector("composed-unknown")!
                                .shadowRoot,
                    };
                }),
            ).toEqual({
                parentRegistered: false,
                childRegistered: false,
                delegatesFocus: true,
                unknownShadow: null,
            });

            await page.evaluate(
                markersV2 => (window as any).startHydration(markersV2),
                markersV2,
            );
            expect(
                await page.evaluate(() => {
                    const parent = document.querySelector("composed-parent")!;
                    const child = parent.shadowRoot!.querySelector("composed-child")!;
                    return [
                        parent.shadowRoot!.querySelector("h2"),
                        parent.shadowRoot!.querySelector("style"),
                        child,
                        child.shadowRoot!.querySelector(".message"),
                        child.shadowRoot!.querySelector("li"),
                        child.shadowRoot!.querySelector("style"),
                    ].map((node, index) => node === (window as any).ssrNodes[index]);
                }),
            ).toEqual([true, true, true, true, true, true]);
            await expect(parent.locator("h2")).toHaveText(state.heading);
            await expect(child.locator(".message")).toHaveText(state.message);
            await expect(child.locator("li")).toHaveText(["Alpha", "Beta"]);
            await child.locator("button").click();
            await expect(child.locator(".clicks")).toHaveText("1");
            await parent.evaluate((node: any) => {
                node.heading = "Parent after";
                node.message = "Child after";
                node.items = [{ label: "Gamma" }];
                node.show = false;
            });
            await expect(parent.locator("h2")).toHaveText("Parent after");
            await expect(child.locator(".message")).toHaveText("Child after");
            await expect(child.locator("li")).toHaveText(["Gamma"]);
            await expect(parent.locator(".conditional")).toHaveCount(0);
            await expect(parent.locator(".light")).toHaveText("Authored light DOM");
            await expect(parent).toHaveAttribute("role", "region");
            await expect(child).toHaveAttribute("role", "status");
            await expect(child.locator(".message")).toHaveCSS("color", "rgb(65, 43, 21)");
            expect(errors).toEqual([]);
        });
    }
}
