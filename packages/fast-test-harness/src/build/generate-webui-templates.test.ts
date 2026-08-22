import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
    fTemplateToWebui,
    generateWebuiTemplates,
} from "@microsoft/fast-test-harness/build/generate-webui-templates.js";

test.describe("generateWebuiTemplates", () => {
    let tempDir: string;

    test.beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), "fast-webui-templ-"));
    });

    test.afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    test("should generate a webui template without f-template wrapper", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "badge.template.js"),
            `export const template = {
                html: "<template><slot></slot></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "contoso" });

        const html = await readFile(join(distDir, "badge.template-webui.html"), "utf8");
        assert.ok(html.includes('<template shadowrootmode="open">'));
        assert.ok(html.includes("<slot></slot>"));
        assert.ok(!html.includes("<f-template"), "should not have f-template wrapper");
        assert.ok(!html.includes("{{styles}}"), "should not have styles marker");
    });

    test("should write to outDir when specified", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "card.template.js"),
            `export const template = {
                html: "<template><div>card</div></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({
            cwd: tempDir,
            outDir: "out",
            tagPrefix: "fast",
        });

        const html = await readFile(
            join(tempDir, "out", "card.template-webui.html"),
            "utf8",
        );
        assert.ok(html.includes('<template shadowrootmode="open">'));
    });

    test("should skip modules without a template export", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "empty.template.js"),
            `export const styles = ":host {}";`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        try {
            await readFile(join(distDir, "empty.template-webui.html"), "utf8");
            assert.fail("Should not have created an HTML file");
        } catch (err: any) {
            assert.strictEqual(err.code, "ENOENT");
        }
    });

    test("should apply a format function", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "text.template.js"),
            `export const template = {
                html: "<template><span>text</span></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
            format: html => `<!-- webui-formatted -->\n${html}`,
        });

        const html = await readFile(join(distDir, "text.template-webui.html"), "utf8");
        assert.ok(html.startsWith("<!-- webui-formatted -->"));
    });

    test("should add shadowrootdelegatesfocus by default when definition-async exists", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "input.template.js"),
            `export const template = {
                html: "<template><input /></template>",
                factories: {}
            };`,
        );

        await writeFile(
            join(distDir, "input.definition-async.js"),
            `export const definition = {
                name: "fast-input",
                shadowOptions: { delegatesFocus: true },
            };`,
        );

        await generateWebuiTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
        });

        const html = await readFile(join(distDir, "input.template-webui.html"), "utf8");
        assert.ok(
            html.includes("shadowrootdelegatesfocus"),
            `should include delegatesFocus, got: ${html}`,
        );
    });

    test("should not add shadowrootdelegatesfocus when no definition-async exists", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "div.template.js"),
            `export const template = {
                html: "<template><div>hello</div></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(join(distDir, "div.template-webui.html"), "utf8");
        assert.ok(!html.includes("shadowrootdelegatesfocus"));
    });

    test("should convert f-when directives to webui if directives", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "conditional.template.js"),
            `export const template = {
                html: '<template><f-when value="{{count > 0}}"><span>{{label}}</span></f-when></template>',
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(
            join(distDir, "conditional.template-webui.html"),
            "utf8",
        );
        assert.ok(
            html.includes('<if condition="count > 0"><span>{{label}}</span></if>'),
            `got: ${html}`,
        );
        assert.ok(!html.includes("f-when"), `got: ${html}`);
    });

    test("should convert f-repeat directives to webui for directives", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "list.template.js"),
            `export const template = {
                html: '<template><ul><f-repeat value="{{item in items}}" positioning="true" recycle="false"><li>{{item.name}}</li></f-repeat></ul></template>',
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(join(distDir, "list.template-webui.html"), "utf8");
        assert.ok(
            html.includes('<for each="item in items"><li>{{item.name}}</li></for>'),
            `got: ${html}`,
        );
        assert.ok(!html.includes("f-repeat"), `got: ${html}`);
        assert.ok(!html.includes("positioning"), `got: ${html}`);
        assert.ok(!html.includes("recycle"), `got: ${html}`);
    });

    test("should convert nested f-when and f-repeat directives", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "nested.template.js"),
            `export const template = {
                html: '<template><f-when value="{{show}}"><f-repeat value="{{item in items}}"><p>{{item}}</p></f-repeat></f-when></template>',
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(join(distDir, "nested.template-webui.html"), "utf8");
        assert.ok(
            html.includes(
                '<if condition="show"><for each="item in items"><p>{{item}}</p></for></if>',
            ),
            `got: ${html}`,
        );
        assert.ok(!html.includes("f-when"), `got: ${html}`);
        assert.ok(!html.includes("f-repeat"), `got: ${html}`);
    });

    test("should strip the {{styles}} marker from output", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        // The template contains nested content that would produce a styles marker
        // during f-template generation (convertTemplate injects it).
        await writeFile(
            join(distDir, "label.template.js"),
            `export const template = {
                html: "<template><label>Name</label></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "contoso" });

        const html = await readFile(join(distDir, "label.template-webui.html"), "utf8");
        assert.ok(
            !html.includes("{{styles}}"),
            `should not contain styles marker: ${html}`,
        );
        assert.ok(
            !html.includes("{%styles%}"),
            `should not contain alt styles marker: ${html}`,
        );
    });

    test("should handle modules with a default export", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "icon.template.js"),
            `const template = {
                html: "<template><svg></svg></template>",
                factories: {}
            };
            export default template;`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(join(distDir, "icon.template-webui.html"), "utf8");
        assert.ok(html.includes('<template shadowrootmode="open">'));
        assert.ok(html.includes("<svg></svg>"));
    });

    test("should handle multiple template modules in one pass", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "button.template.js"),
            `export const template = {
                html: "<template><button><slot></slot></button></template>",
                factories: {}
            };`,
        );

        await writeFile(
            join(distDir, "badge.template.js"),
            `export const template = {
                html: "<template><span><slot></slot></span></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "contoso" });

        const buttonHtml = await readFile(
            join(distDir, "button.template-webui.html"),
            "utf8",
        );
        const badgeHtml = await readFile(
            join(distDir, "badge.template-webui.html"),
            "utf8",
        );

        assert.ok(buttonHtml.includes("<button>"));
        assert.ok(badgeHtml.includes("<span>"));
    });

    test("should gracefully handle a format function that throws", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "broken.template.js"),
            `export const template = {
                html: "<template><div>ok</div></template>",
                factories: {}
            };`,
        );

        // Should not throw — just warn and skip formatting.
        await generateWebuiTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
            format: () => {
                throw new Error("format boom");
            },
        });

        const html = await readFile(join(distDir, "broken.template-webui.html"), "utf8");
        // The file should still be written (unformatted).
        assert.ok(html.includes("<div>ok</div>"));
    });

    test("should use a custom glob pattern", async () => {
        const distDir = join(tempDir, "dist");
        const sub = join(distDir, "components");
        await mkdir(sub, { recursive: true });

        // Use the standard .template.js suffix so basename extraction works
        await writeFile(
            join(sub, "alert.template.js"),
            `export const template = {
                html: "<template><div role='alert'></div></template>",
                factories: {}
            };`,
        );

        await generateWebuiTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
            pattern: "components/*.template.js",
        });

        const html = await readFile(join(sub, "alert.template-webui.html"), "utf8");
        assert.ok(html.includes("role="), `got: ${html}`);
        assert.ok(html.includes("alert"), `got: ${html}`);
    });
});

test.describe("fTemplateToWebui", () => {
    test("should preserve root template attributes and event bindings", () => {
        const fTemplate = [
            '<f-template name="contoso-button" shadowrootmode="open">',
            '    <template @click="{clickHandler($e)}" @keypress="{keypressHandler($e)}">',
            "        {{styles}}",
            '        <slot name="start" f-ref="{start}"></slot>',
            "        <slot></slot>",
            "    </template>",
            "</f-template>",
        ].join("\n");

        const webui = fTemplateToWebui(fTemplate, {});

        assert.ok(
            webui.includes('shadowrootmode="open"'),
            `should apply shadowrootmode, got: ${webui}`,
        );
        assert.ok(
            webui.includes('@click="{clickHandler($e)}"'),
            `should preserve @click binding, got: ${webui}`,
        );
        assert.ok(
            webui.includes('@keypress="{keypressHandler($e)}"'),
            `should preserve @keypress binding, got: ${webui}`,
        );
        assert.ok(!webui.includes("<f-template"), `got: ${webui}`);
        assert.ok(!webui.includes("{{styles}}"), `got: ${webui}`);
    });

    test("should merge shadow attributes with preserved bindings", () => {
        const fTemplate =
            '<f-template name="contoso-input" shadowrootmode="open"><template @change="{onChange($e)}">{{styles}}<slot></slot></template></f-template>';

        const webui = fTemplateToWebui(fTemplate, { shadowrootdelegatesfocus: "" });

        assert.ok(webui.includes("shadowrootdelegatesfocus"), `got: ${webui}`);
        assert.ok(webui.includes('shadowrootmode="open"'), `got: ${webui}`);
        assert.ok(webui.includes('@change="{onChange($e)}"'), `got: ${webui}`);
    });

    test("should emit a plain template when the root has no attributes", () => {
        const fTemplate =
            '<f-template name="contoso-badge" shadowrootmode="open"><template>{{styles}}<slot></slot></template></f-template>';

        const webui = fTemplateToWebui(fTemplate, {});

        assert.ok(webui.includes('<template shadowrootmode="open">'), `got: ${webui}`);
    });

    test("should adopt shadowrootmode from the f-template wrapper", () => {
        const fTemplate =
            '<f-template name="contoso-panel" shadowrootmode="closed"><template>{{styles}}<slot></slot></template></f-template>';

        const webui = fTemplateToWebui(fTemplate, {});

        assert.ok(
            webui.includes('<template shadowrootmode="closed">'),
            `should mirror the wrapper's shadowrootmode, got: ${webui}`,
        );
    });

    test("should default shadowrootmode to open when the wrapper omits it", () => {
        const fTemplate =
            '<f-template name="contoso-panel"><template>{{styles}}<slot></slot></template></f-template>';

        const webui = fTemplateToWebui(fTemplate, {});

        assert.ok(
            webui.includes('<template shadowrootmode="open">'),
            `should default to open, got: ${webui}`,
        );
    });
});
