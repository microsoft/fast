import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { generateWebuiTemplates } from "@microsoft/fast-test-harness/build/generate-webui-templates.js";

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

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "mai" });

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

    test("should add shadowrootdelegatesfocus from definition-async", async () => {
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

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(join(distDir, "input.template-webui.html"), "utf8");
        assert.ok(
            html.includes("shadowrootdelegatesfocus"),
            `should include delegatesFocus, got: ${html}`,
        );
    });

    test("should not add shadowrootdelegatesfocus when absent", async () => {
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

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "mai" });

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

        await generateWebuiTemplates({ cwd: tempDir, tagPrefix: "mai" });

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
