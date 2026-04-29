import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { installDomShim } from "@microsoft/fast-test-harness/build/dom-shim.js";
import { generateFTemplates } from "@microsoft/fast-test-harness/build/generate-templates.js";
import { generateWebuiTemplates } from "@microsoft/fast-test-harness/build/generate-webui-templates.js";

installDomShim();

describe("generateFTemplates", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), "fast-ftemplates-"));
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    it("should generate an f-template HTML file from a template module", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "badge.template.js"),
            `export const template = {
                html: "<template><slot></slot></template>",
                factories: {}
            };`,
        );

        await generateFTemplates({ cwd: tempDir, tagPrefix: "mai" });

        const html = await readFile(join(distDir, "badge.template.html"), "utf8");
        assert.ok(html.includes('<f-template name="mai-badge"'));
        assert.ok(html.includes("<slot></slot>"));
        assert.ok(html.includes("{{styles}}"));
    });

    it("should write to outDir when specified", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "card.template.js"),
            `export const template = {
                html: "<template><div>card</div></template>",
                factories: {}
            };`,
        );

        await generateFTemplates({ cwd: tempDir, outDir: "out", tagPrefix: "fast" });

        const html = await readFile(join(tempDir, "out", "card.template.html"), "utf8");
        assert.ok(html.includes('<f-template name="fast-card"'));
    });

    it("should skip modules without a template export", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "empty.template.js"),
            `export const styles = ":host {}";`,
        );

        await generateFTemplates({ cwd: tempDir, tagPrefix: "fast" });

        try {
            await readFile(join(distDir, "empty.template.html"), "utf8");
            assert.fail("Should not have created an HTML file");
        } catch (err: any) {
            assert.strictEqual(err.code, "ENOENT");
        }
    });

    it("should apply a format function", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "text.template.js"),
            `export const template = {
                html: "<template><span>text</span></template>",
                factories: {}
            };`,
        );

        await generateFTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
            format: html => `<!-- formatted -->\n${html}`,
        });

        const html = await readFile(join(distDir, "text.template.html"), "utf8");
        assert.ok(html.startsWith("<!-- formatted -->"));
    });
});

describe("generateWebuiTemplates", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), "fast-webui-"));
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    it("should generate a webui template without f-template wrapper", async () => {
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

    it("should write to outDir when specified", async () => {
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

    it("should add shadowrootdelegatesfocus from definition-async", async () => {
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

    it("should not add shadowrootdelegatesfocus when absent", async () => {
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
});
