import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
    mkdir,
    mkdtemp,
    readFile,
    realpath,
    rm,
    stat,
    symlink,
    writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startServer } from "./server.mjs";
import defaultConfig, { createHarnessConfig } from "./vite.config.mjs";

const configModule = new URL("./vite.config.mjs", import.meta.url).href;
const nodeModules = fileURLToPath(new URL("../../node_modules/", import.meta.url));
const harnessRoot = fileURLToPath(new URL(".", import.meta.url));
const elementRoot = dirname(
    fileURLToPath(import.meta.resolve("@microsoft/fast-element/package.json")),
);
const template = (text: string) =>
    `<f-template name="source-widget"><template><p>${text} {{message}}</p></template></f-template>`;
const component = (
    directory = "./src",
    tagName = "source-widget",
    className = "SourceWidget",
    generated = "./generated",
) => ({
    tagName,
    template: `${directory}/widget.html`,
    stylesheet: `${directory}/widget.css`,
    clientModule: `${directory}/main.ts`,
    className,
    generated,
});
const defaultComponents = [component()];

async function workspace(t: any, components = JSON.stringify(defaultComponents)) {
    const root = await mkdtemp(join(await realpath(tmpdir()), "fast-harness-sources-"));
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
            import { template } from "../generated/source-widget.template.js";
            import { styles } from "../generated/source-widget.styles.js";
            import { message } from "./state.js";
            export class SourceWidget extends FASTElement { message = message; }
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
                components: ${components},
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
                server: {
                    watch: { useFsEvents: false, usePolling: false },
                    fs: { allow: ${JSON.stringify([root, elementRoot, harnessRoot])} }
                }
            });`,
        ),
    ]);
    return {
        root,
        async start(options = {}) {
            server = await startServer(root, root, join(root, "vite.config.mjs"), {
                port: 0,
                ...options,
            });
            return `http://localhost:${server.port}`;
        },
        async stop() {
            await server?.close();
            server = undefined;
        },
    };
}

test("disabled generation does not require the optional converter peer", () => {
    const { Module } = createRequire(import.meta.url)("node:module");
    const load = Module._load;
    Module._load = function (specifier: string, ...args: any[]) {
        if (specifier.startsWith("@microsoft/fast-build/")) {
            throw Object.assign(new Error("Missing optional peer"), {
                code: "MODULE_NOT_FOUND",
            });
        }
        return load.call(this, specifier, ...args);
    };
    try {
        assert.deepEqual(createHarnessConfig(), defaultConfig);
        assert.deepEqual(createHarnessConfig({ components: [] }), defaultConfig);
        assert.throws(
            () => createHarnessConfig({ components: defaultComponents }),
            /requires @microsoft\/fast-build with its component-sources.js API/,
        );
    } finally {
        Module._load = load;
    }
});

test("components configuration requires an array and rejects the old wrapper", () => {
    for (const components of [component(), false, null, "src"]) {
        assert.throws(
            () => createHarnessConfig({ components }),
            /components must be an array/,
        );
    }
    assert.throws(
        () => createHarnessConfig({ sources: [] }),
        /components directly instead of sources/,
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
    await expect.poll(() => ssrPage.content().catch(() => "")).toContain("HTML B");
    await writeFile(join(app.root, "src/widget.css"), ":host { --test-color: blue; }");
    await expect.poll(color).toBe("blue");
    assert.match(await renderSSR(), /--test-color: blue/);
    const generated = join(app.root, "generated/source-widget.template.ts");
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
    await expect
        .poll(async () => (await fetch(origin)).status, { intervals: [1] })
        .toBe(500);
    assert.equal(await readFile(generated, "utf8"), held);
    await writeFile(join(app.root, "src/widget.html"), template("Recovered"));
    try {
        await expect(text).toHaveText("Recovered TS B");
    } catch (error) {
        t.diagnostic(`Generated template: ${await readFile(generated, "utf8")}`);
        t.diagnostic(
            `Recovery page: ${await page.content().catch(error => error.message)}`,
        );
        throw error;
    }
    await expect.poll(() => ssrPage.content().catch(() => "")).toContain("Recovered");
    assert.equal((await fetch(origin, { headers: { Accept: "text/html" } })).status, 200);
    const config = join(app.root, "vite.config.mjs");
    await writeFile(
        config,
        (await readFile(config, "utf8")).replace(
            "components:",
            'plugins: [{ name: "restart-proof", transformIndexHtml: html => html + "<!--restarted-->" }], components:',
        ),
    );
    await expect.poll(() => page.content().catch(() => "")).toContain("<!--restarted-->");
    await writeFile(
        join(app.root, "src/state.ts"),
        'export const message: string = "TS C";',
    );
    await expect(text).toHaveText("Recovered TS C");
    await expect(ssrPage.locator("b")).toHaveText("TS C");
});

test("source recovery catches repairs completed before the error page connects", {
    timeout: 30_000,
}, async t => {
    const app = await workspace(t);
    const origin = await app.start();
    await writeFile(join(app.root, "src/widget.html"), "<broken>");
    await expect
        .poll(
            async () =>
                (await fetch(origin, { headers: { Accept: "text/html" } })).status,
        )
        .toBe(500);
    const browser = await chromium.launch();
    t.after(() => browser.close());
    const page = await browser.newPage();
    let resumeClient = () => {};
    const clientGate = new Promise<void>(resolve => {
        resumeClient = resolve;
    });
    await page.route("**/@vite/client", async route => {
        await clientGate;
        await route.continue();
    });
    try {
        const clientRequest = page.waitForRequest("**/@vite/client");
        const response = await page.goto(origin, { waitUntil: "commit" });
        assert.equal(response?.status(), 500);
        await clientRequest;
        await writeFile(join(app.root, "src/widget.html"), template("Recovered"));
        await expect
            .poll(
                async () =>
                    (await fetch(origin, { headers: { Accept: "text/html" } })).status,
            )
            .toBe(200);
        await expect
            .poll(() =>
                readFile(join(app.root, "generated/source-widget.template.ts"), "utf8"),
            )
            .toContain("Recovered");
    } finally {
        resumeClient();
        await page.unrouteAll({ behavior: "wait" });
    }
    await expect(page.locator("source-widget p")).toHaveText("Recovered TS A");
});

test("authored package exports render and hydrate through native SSR without dist", {
    timeout: 60_000,
}, async t => {
    const app = await workspace(
        t,
        JSON.stringify([{ ...component(), clientModule: "./src/element.ts" }]),
    );
    const packageName = `fast-harness-source-${randomUUID()}`;
    const packageLink = join(nodeModules, packageName);
    await symlink(app.root, packageLink, "junction");
    t.after(() => rm(packageLink, { force: true }));
    await symlink(nodeModules, join(app.root, "node_modules"), "junction");
    await Promise.all([
        writeFile(
            join(app.root, "package.json"),
            JSON.stringify({
                name: packageName,
                type: "module",
                exports: {
                    "./template.html": "./src/widget.html",
                    "./styles.css": "./src/widget.css",
                },
            }),
        ),
        writeFile(
            join(app.root, "src/widget.html"),
            '<f-template name="source-widget" shadowrootmode="open"><template><p>HTML A {{label}}</p></template></f-template>',
        ),
        writeFile(
            join(app.root, "src/element.ts"),
            `import { FASTElement } from "@microsoft/fast-element/fast-element.js";
            import { attr } from "@microsoft/fast-element/attr.js";
            export class SourceWidget extends FASTElement { @attr label = ""; }`,
        ),
        writeFile(
            join(app.root, "src/entry-server.ts"),
            `import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";
            export const { render } = createSSRRenderer({
                tagPrefix: "source",
                components: [{ name: "widget", packageName: ${JSON.stringify(packageName)} }],
                nativeAddonPath: ${JSON.stringify(
                    fileURLToPath(
                        new URL(
                            "../../crates/microsoft-fast-build/target/node-host/fast-build.node",
                            import.meta.url,
                        ),
                    ),
                )}
            });`,
        ),
        writeFile(
            join(app.root, "src/entry-client.ts"),
            `import { enableHydration } from "@microsoft/fast-element/hydration.js";
            import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
            import { SourceWidget } from "./element.js";
            const hydration = enableHydration();
            await SourceWidget.define({ name: "source-widget", template: declarativeTemplate() });
            await hydration.whenHydrated();
            window.sourceHydrated = true;`,
        ),
        writeFile(
            join(app.root, "ssr.html"),
            '<!doctype html><html><head><!--stylespreload--></head><body><!--fixture--><!--templates--><script type="module" src="/src/entry-client.ts"></script></body></html>',
        ),
    ]);
    await assert.rejects(stat(join(app.root, "dist")));
    await assert.rejects(stat(join(app.root, "generated")));
    const origin = await app.start();
    const result = await fetch(`${origin}/generate-fixture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            testId: "native-source",
            tagName: "source-widget",
            attributes: JSON.stringify({ label: "Server" }),
        }),
    });
    assert.equal(result.status, 200, await result.clone().text());
    const { url } = await result.json();
    const html = await (await fetch(origin + url)).text();
    assert.match(html, /<template shadowrootmode="open"/);
    assert.match(html, /HTML A/);
    assert.match(html, /Server/);
    assert.match(html, /widget\.css/);
    const browser = await chromium.launch();
    t.after(() => browser.close());
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    let resumeClient = () => {};
    const clientGate = new Promise<void>(resolve => {
        resumeClient = resolve;
    });
    await page.route("**/src/entry-client.ts", async route => {
        await clientGate;
        await route.continue();
    });
    const text = page.locator("source-widget p");
    try {
        await page.goto(origin + url, { waitUntil: "commit" });
        await expect(text).toHaveText("HTML A Server");
        await page.evaluate(() => {
            (window as any).serverNode = document
                .querySelector("source-widget")!
                .shadowRoot!.querySelector("p");
        });
    } finally {
        resumeClient();
    }
    const hydrated = () => page.evaluate(() => (window as any).sourceHydrated === true);
    await expect.poll(hydrated).toBe(true);
    assert.equal(
        await page.evaluate(
            () =>
                (window as any).serverNode ===
                document.querySelector("source-widget")!.shadowRoot!.querySelector("p"),
        ),
        true,
    );
    await page.locator("source-widget").evaluate(el => {
        (el as any).label = "Client";
    });
    await expect(text).toHaveText("HTML A Client");
    await writeFile(
        join(app.root, "src/widget.html"),
        '<f-template name="source-widget" shadowrootmode="open"><template><p>HTML B {{label}}</p></template></f-template>',
    );
    await expect(text).toHaveText("HTML B Server");
    await expect.poll(hydrated).toBe(true);
    assert.match(await (await fetch(origin + url)).text(), /HTML B/);
    const color = () =>
        page
            .locator("source-widget")
            .evaluate(el => getComputedStyle(el).getPropertyValue("--test-color").trim())
            .catch(() => "");
    await expect.poll(color).toBe("red");
    await writeFile(join(app.root, "src/widget.css"), ":host { --test-color: blue; }");
    await expect.poll(color).toBe("blue");
    await expect.poll(hydrated).toBe(true);
    assert.equal(page.url(), origin + url);
    assert.deepEqual(errors, []);
    await assert.rejects(stat(join(app.root, "dist")));
    assert.match(
        await readFile(join(app.root, "generated/source-widget.template.ts"), "utf8"),
        /HTML B/,
    );
    assert.match(
        await readFile(join(app.root, "generated/source-widget.styles.ts"), "utf8"),
        /blue/,
    );
});

test("explicit nested sources are watched, unlisted files ignored, and stale owned outputs removed", async t => {
    const nested = {
        ...component(),
        tagName: "nested-widget",
        template: "./src/nested/widget.html",
        stylesheet: "./src/nested/widget.css",
        generated: "./generated/",
    };
    const app = await workspace(t, JSON.stringify([component(), nested]));
    await mkdir(join(app.root, "src/nested"));
    await writeFile(join(app.root, "src/nested/widget.html"), template("Nested"));
    await writeFile(join(app.root, "src/nested/widget.css"), ":host { color: green; }");
    await writeFile(join(app.root, "src/unlisted.html"), "<broken>");
    const origin = await app.start();
    const output = join(app.root, "generated");
    await assert.rejects(stat(join(output, "unlisted.template.ts")));
    await writeFile(join(app.root, "src/nested/widget.html"), template("Nested edit"));
    await expect
        .poll(() =>
            readFile(join(output, "nested-widget.template.ts"), "utf8").catch(() => ""),
        )
        .toContain("Nested edit");
    await expect
        .poll(() =>
            readFile(join(output, "nested-widget.styles.ts"), "utf8").catch(() => ""),
        )
        .toContain("color: green");
    const handwritten = join(output, "handwritten.ts");
    await writeFile(handwritten, "export const keep = true;\n");
    await rm(join(app.root, "src/nested/widget.css"));
    await expect.poll(async () => (await fetch(origin)).status).toBe(500);
    await writeFile(join(app.root, "src/nested/widget.css"), ":host { color: blue; }");
    await expect
        .poll(
            async () =>
                (await fetch(origin, { headers: { Accept: "text/html" } })).status,
        )
        .toBe(200);
    await app.stop();
    const config = join(app.root, "vite.config.mjs");
    await writeFile(
        config,
        (await readFile(config, "utf8")).replace(
            JSON.stringify([component(), nested]),
            JSON.stringify(defaultComponents),
        ),
    );
    await app.start();
    await expect
        .poll(() =>
            stat(join(output, "nested-widget.styles.ts")).then(
                () => true,
                () => false,
            ),
        )
        .toBe(false);
    await assert.rejects(stat(join(output, "nested-widget.template.ts")));
    assert.equal(await readFile(handwritten, "utf8"), "export const keep = true;\n");
});

test("source generation never overwrites handwritten TypeScript", async t => {
    const app = await workspace(t);
    await mkdir(join(app.root, "generated"));
    const output = join(app.root, "generated/source-widget.template.ts");
    await writeFile(output, "export const handwritten = true;\n");
    await assert.rejects(app.start(), /Refusing to overwrite/);
    assert.equal(await readFile(output, "utf8"), "export const handwritten = true;\n");
});

test("source generation rejects directory overlap and symlink output traversal", async t => {
    const app = await workspace(t);
    const config = join(app.root, "vite.config.mjs");
    const original = await readFile(config, "utf8");
    await writeFile(
        config,
        original.replace('"generated":"./generated"', '"generated":"."'),
    );
    await assert.rejects(
        app.start(),
        /generated directory must not contain component inputs/,
    );
    await writeFile(config, original);
    await mkdir(join(app.root, "outside"));
    await mkdir(join(app.root, "generated"));
    const target = join(app.root, "outside/handwritten.ts");
    await writeFile(target, "export const keep = true;");
    await symlink(
        join(app.root, "outside"),
        join(app.root, "generated/source-widget.template.ts"),
        "junction",
    );
    await assert.rejects(app.start(), /Refusing to overwrite/);
    assert.equal(await readFile(target, "utf8"), "export const keep = true;");
    await assert.rejects(stat(join(app.root, "generated/source-widget.styles.ts")));
});

test("components without a stylesheet generate only a typed template", async t => {
    const { stylesheet, ...withoutStyles } = component();
    const app = await workspace(t, JSON.stringify([withoutStyles]));
    await writeFile(
        join(app.root, "src/shell.html"),
        "<!doctype html><title>Shell</title>",
    );
    await app.start();
    assert.match(
        await readFile(join(app.root, "generated/source-widget.template.ts"), "utf8"),
        /html<SourceWidget>/,
    );
    await assert.rejects(stat(join(app.root, "generated/shell.template.ts")));
    await assert.rejects(stat(join(app.root, "generated/source-widget.styles.ts")));
});

test("per-template source types preserve binding checks in generated TypeScript", async t => {
    const components = [
        {
            ...component(),
            clientModule: "./src/model.ts",
        },
        {
            tagName: "other-widget",
            template: "./src/other.html",
            className: "OtherWidget",
            clientModule: "./src/other-model.mts",
            generated: "./src/generated/",
        },
    ];
    const app = await workspace(t, JSON.stringify(components));
    await mkdir(join(app.root, "node_modules/@microsoft"), { recursive: true });
    await symlink(
        elementRoot,
        join(app.root, "node_modules/@microsoft/fast-element"),
        "junction",
    );
    await symlink(
        harnessRoot,
        join(app.root, "node_modules/@microsoft/fast-test-harness"),
        "junction",
    );
    await writeFile(
        join(app.root, "config.ts"),
        `import { createHarnessConfig } from "@microsoft/fast-test-harness/vite.config.mjs";
        import type { SourceComponent } from "@microsoft/fast-test-harness/vite.config.mjs";
        const components: SourceComponent[] = ${JSON.stringify(components)};
        const component = components[0];
        createHarnessConfig({ components });
        createHarnessConfig({ components: [] });
        // @ts-expect-error Components must always be an array.
        createHarnessConfig({ components: component });
        // @ts-expect-error An empty array, not false, disables generation.
        createHarnessConfig({ components: false });
        // @ts-expect-error The unpublished configuration name has been replaced.
        createHarnessConfig({ sourceGeneration: components });
        // @ts-expect-error The sources wrapper is no longer supported.
        createHarnessConfig({ sources: [{ outDir: "./generated", components }] });
        // @ts-expect-error A component must identify the exported class.
        const incomplete: SourceComponent = { tagName: "my-widget", template: "./widget.html", clientModule: "./widget.ts", generated: "./generated" };
        // @ts-expect-error Each component must identify its generated directory.
        const noOutput: SourceComponent = { tagName: "my-widget", template: "./widget.html", clientModule: "./widget.ts", className: "MyWidget" };
        // @ts-expect-error Glob settings are not component configuration.
        createHarnessConfig({ components: [{ ...component, templates: "**/*.html" }] });`,
    );
    await writeFile(
        join(app.root, "src/model.ts"),
        'export class SourceWidget { message = ""; }',
    );
    await writeFile(
        join(app.root, "src/other-model.mts"),
        'export class OtherWidget { label = ""; }',
    );
    await writeFile(
        join(app.root, "src/other.html"),
        '<f-template name="other-widget"><template><p>{{label}}</p></template></f-template>',
    );
    await app.start();
    assert.match(
        await readFile(join(app.root, "generated/source-widget.template.ts"), "utf8"),
        /import type \{ SourceWidget \} from "\.\.\/src\/model\.js"/,
    );
    assert.match(
        await readFile(join(app.root, "src/generated/other-widget.template.ts"), "utf8"),
        /import type \{ OtherWidget \} from "\.\.\/other-model\.mjs"/,
    );
    const ts: typeof import("typescript") = createRequire(import.meta.url)("typescript");
    const diagnostics = () =>
        ts.getPreEmitDiagnostics(
            ts.createProgram({
                rootNames: [
                    join(app.root, "config.ts"),
                    join(app.root, "generated/source-widget.template.ts"),
                    join(app.root, "src/generated/other-widget.template.ts"),
                ],
                options: {
                    noEmit: true,
                    strict: true,
                    skipLibCheck: true,
                    types: [],
                    target: ts.ScriptTarget.ES2022,
                    module: ts.ModuleKind.NodeNext,
                    moduleResolution: ts.ModuleResolutionKind.NodeNext,
                },
            }),
        );
    assert.deepEqual(
        diagnostics().map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n")),
        [],
    );
    await writeFile(join(app.root, "src/widget.html"), template("{{misspelled}}"));
    await expect
        .poll(() =>
            readFile(join(app.root, "generated/source-widget.template.ts"), "utf8"),
        )
        .toContain("misspelled");
    const errors = diagnostics();
    assert.equal(errors.length, 1);
    assert.equal(errors[0].code, 2339);
    assert.match(
        ts.flattenDiagnosticMessageText(errors[0].messageText, "\n"),
        /misspelled.*SourceWidget/,
    );
});

test("per-component generated directories support independent package routes", {
    timeout: 60_000,
}, async t => {
    const app = await workspace(
        t,
        JSON.stringify([
            component("./src", "source-widget", "SourceWidget", "./src/generated"),
            component(
                "./other/src",
                "other-widget",
                "OtherWidget",
                "./other/src/generated/",
            ),
        ]),
    );
    const other = join(app.root, "other");
    await mkdir(join(other, "src"), { recursive: true });
    const main = (await readFile(join(app.root, "src/main.ts"), "utf8")).replaceAll(
        "../generated/",
        "./generated/",
    );
    await Promise.all([
        writeFile(join(app.root, "src/main.ts"), main),
        writeFile(
            join(other, "index.html"),
            '<!doctype html><other-widget></other-widget><script type="module" src="/src/main.ts"></script>',
        ),
        writeFile(
            join(other, "src/main.ts"),
            main
                .replaceAll("SourceWidget", "OtherWidget")
                .replaceAll("source-widget", "other-widget"),
        ),
        writeFile(join(other, "src/widget.html"), template("Other A")),
        writeFile(join(other, "src/widget.css"), ":host { --test-color: green; }"),
        writeFile(join(other, "src/state.ts"), 'export const message = "Other TS A";'),
    ]);
    const origin = await app.start({
        routes: [
            { base: "/one/", root: app.root },
            { base: "/two/", root: other },
        ],
    });
    const browser = await chromium.launch();
    t.after(() => browser.close());
    const first = await browser.newPage();
    const second = await browser.newPage();
    await first.goto(`${origin}/one/`);
    await second.goto(`${origin}/two/`);
    await expect(first.locator("source-widget p")).toHaveText("HTML A TS A");
    await expect(second.locator("other-widget p")).toHaveText("Other A Other TS A");
    await writeFile(join(other, "src/widget.html"), template("Other B"));
    await expect(second.locator("other-widget p")).toHaveText("Other B Other TS A");
    await writeFile(join(app.root, "src/widget.html"), template("First B"));
    await expect(first.locator("source-widget p")).toHaveText("First B TS A");
    await writeFile(join(other, "src/state.ts"), 'export const message = "Other TS B";');
    await expect(second.locator("other-widget p")).toHaveText("Other B Other TS B");
    await writeFile(join(other, "src/widget.css"), ":host { --test-color: blue; }");
    await expect
        .poll(() =>
            second
                .locator("other-widget")
                .evaluate(el =>
                    getComputedStyle(el).getPropertyValue("--test-color").trim(),
                )
                .catch(() => ""),
        )
        .toBe("blue");
    await app.stop();
    const config = join(app.root, "vite.config.mjs");
    await writeFile(
        config,
        (await readFile(config, "utf8")).replace(
            '"stylesheet":"./other/src/widget.css",',
            "",
        ),
    );
    await app.start();
    await assert.rejects(stat(join(other, "src/generated/other-widget.styles.ts")));
    assert.match(
        await readFile(join(other, "src/generated/other-widget.template.ts"), "utf8"),
        /Other B/,
    );
    assert.match(
        await readFile(join(app.root, "src/generated/source-widget.template.ts"), "utf8"),
        /First B/,
    );
});

test("component outputs reject nested directories and preflight all conversions", async t => {
    const app = await workspace(t);
    await mkdir(join(app.root, "other/src"), { recursive: true });
    await writeFile(join(app.root, "other/src/widget.html"), "<broken>");
    await writeFile(join(app.root, "other/src/widget.css"), ":host {}");
    await writeFile(join(app.root, "other/src/main.ts"), "export class OtherWidget {}");
    const config = join(app.root, "vite.config.mjs");
    const original = await readFile(config, "utf8");
    const configure = async (generated: string, tagName = "other-widget") =>
        writeFile(
            config,
            original.replace(
                JSON.stringify(defaultComponents),
                JSON.stringify([
                    component(),
                    component("./other/src", tagName, "OtherWidget", generated),
                ]),
            ),
        );
    for (const generated of ["./generated/nested", "./other"]) {
        await configure(generated);
        await assert.rejects(
            app.start(),
            /overlap|generated directory must not contain component inputs/,
        );
        await assert.rejects(stat(join(app.root, "generated/source-widget.template.ts")));
    }
    await symlink(
        join(app.root, "generated"),
        join(app.root, "generated-alias"),
        "junction",
    );
    await configure("./generated-alias", "source-widget");
    await assert.rejects(app.start(), /Multiple sources generate the same output/);
    await configure("./other/generated");
    await assert.rejects(app.start(), /Source generation failed/);
    await assert.rejects(stat(join(app.root, "generated/source-widget.template.ts")));
    await writeFile(join(app.root, "other/src/widget.html"), template("Shared output"));
    await configure("./generated-alias");
    await app.start();
    assert.match(
        await readFile(join(app.root, "generated/source-widget.template.ts"), "utf8"),
        /HTML A/,
    );
    assert.match(
        await readFile(join(app.root, "generated/other-widget.template.ts"), "utf8"),
        /Shared output/,
    );
});

test("explicit components reject invalid configuration and duplicate outputs", () => {
    for (const tagName of ["m-fast-card", "a-", "a--b", "a_.-b"]) {
        assert.doesNotThrow(() =>
            createHarnessConfig({ components: [{ ...component(), tagName }] }),
        );
    }
    for (const invalid of [
        null,
        {},
        { ...component(), tagName: "../widget" },
        { ...component(), tagName: "widget" },
        { ...component(), tagName: "A-widget" },
        { ...component(), tagName: "a-b!" },
        { ...component(), template: "./src/widget.ts" },
        { ...component(), stylesheet: false },
        { ...component(), clientModule: "./src/model.html" },
        { ...component(), className: "../Widget" },
        { ...component(), generated: "" },
        { ...component(), generated: false },
    ]) {
        assert.throws(
            () =>
                createHarnessConfig({
                    components: [invalid],
                }),
            /Each component requires/,
        );
    }
    assert.throws(
        () =>
            createHarnessConfig({
                components: [component(), component()],
            }),
        /Duplicate component output/,
    );
    for (const key of [
        "srcDir",
        "root",
        "templates",
        "stylesheets",
        "templateTypes",
        "outDir",
        "components",
    ]) {
        assert.throws(
            () =>
                createHarnessConfig({
                    components: [{ ...component(), [key]: "**/*" }],
                }),
            /accept exact source paths and generated/,
        );
    }
});
