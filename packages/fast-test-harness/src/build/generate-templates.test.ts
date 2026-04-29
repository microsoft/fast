import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { installDomShim } from "@microsoft/fast-test-harness/build/dom-shim.js";
import {
    convertTemplate,
    generateFTemplates,
} from "@microsoft/fast-test-harness/build/generate-templates.js";
import { generateWebuiTemplates } from "@microsoft/fast-test-harness/build/generate-webui-templates.js";

test.describe("convertTemplate", async () => {
    // Install the DOM shim before any tests — convertTemplate needs fast-html
    // syntax constants which require a DOM environment, and FAST Element needs
    // basic DOM globals to initialize.
    installDomShim();

    // Dynamic import after the DOM shim is installed so FAST Element can
    // access `document`, `CSSStyleSheet`, etc.
    const { html, ref, slotted, children } = await import("@microsoft/fast-element");
    test("should wrap a static template in f-template tags", () => {
        const template = html`<template><div>hello</div></template>`;
        const result = convertTemplate(template, "fast-test");

        assert.ok(result);
        assert.ok(result.includes('<f-template name="fast-test"'));
        assert.ok(result.includes("shadowrootmode"));
        assert.ok(result.includes("<div>hello</div>"));
        assert.ok(result.includes("{{styles}}"));
    });

    test("should return null-safe for empty factories", () => {
        const template = html`<template><span></span></template>`;
        const result = convertTemplate(template, "fast-empty");

        assert.ok(result);
        assert.ok(result.includes("<span></span>"));
    });

    test("should inject {{styles}} after the opening template tag", () => {
        const template = html`<template><p>content</p></template>`;
        const result = convertTemplate(template, "fast-styles");

        assert.ok(result);
        const templateIdx = result.indexOf("<template>");
        const stylesIdx = result.indexOf("{{styles}}");
        assert.ok(stylesIdx > templateIdx, "{{styles}} should appear after <template>");
    });

    test("should convert RefDirective factories to f-ref attributes", () => {
        const template = html`<template><div ${ref("myRef")}></div></template>`;
        const result = convertTemplate(template, "fast-ref");

        assert.ok(result);
        assert.ok(result.includes('f-ref="{myRef}"'), `got: ${result}`);
    });

    test("should convert SlottedDirective factories to f-slotted attributes", () => {
        const template = html`<template><slot ${slotted("slottedItems")}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted");

        assert.ok(result);
        assert.ok(result.includes("f-slotted="), `got: ${result}`);
        assert.ok(result.includes("slottedItems"), `got: ${result}`);
    });

    test("should convert value bindings to {{expression}}", () => {
        const template = html`<template><span>${x => x.label}</span></template>`;
        const result = convertTemplate(template, "fast-binding");

        assert.ok(result);
        assert.ok(result.includes("{{label}}"), `got: ${result}`);
    });

    test("should convert boolean bindings to ?attr expressions", () => {
        const template = html`<template><button ?disabled="${x => x.disabled}"></button></template>`;
        const result = convertTemplate(template, "fast-bool");

        assert.ok(result);
        assert.ok(result.includes('?disabled="{{disabled}}"'), `got: ${result}`);
    });

    test("should inline static sub-templates", () => {
        const template = html`<template><div>${() => "<svg>icon</svg>"}</div></template>`;
        const result = convertTemplate(template, "fast-inline");

        assert.ok(result);
        assert.ok(result.includes("<svg>icon</svg>"), `got: ${result}`);
    });

    test("should convert ChildrenDirective factories to f-children attributes", () => {
        const template = html`<template><div ${children("childItems")}></div></template>`;
        const result = convertTemplate(template, "fast-children");

        assert.ok(result);
        assert.ok(result.includes("f-children="), `got: ${result}`);
        assert.ok(result.includes("childItems"), `got: ${result}`);
    });

    test("should convert event bindings to @event expressions", () => {
        const template = html`<template><button @click="${(x, c) => x.handleClick(c.event)}"></button></template>`;
        const result = convertTemplate(template, "fast-event");

        assert.ok(result);
        assert.ok(result.includes("@click="), `got: ${result}`);
        assert.ok(result.includes("handleClick"), `got: ${result}`);
    });

    test("should convert property bindings to :prop expressions", () => {
        const template = html`<template><input :value="${x => x.currentValue}" /></template>`;
        const result = convertTemplate(template, "fast-prop");

        assert.ok(result);
        assert.ok(result.includes(":value="), `got: ${result}`);
        assert.ok(result.includes("currentValue"), `got: ${result}`);
    });

    test("should handle multiple factories in a single template", () => {
        const template = html`<template><span>${x => x.label}</span><button ?disabled="${x => x.disabled}"></button></template>`;
        const result = convertTemplate(template, "fast-multi");

        assert.ok(result);
        assert.ok(result.includes("{{label}}"), `got: ${result}`);
        assert.ok(result.includes('?disabled="{{disabled}}"'), `got: ${result}`);
    });

    test("should inline a static sub-template ViewTemplate", () => {
        const icon = html`<svg>icon</svg>`;
        const template = html`<template><div>${() => icon}</div></template>`;
        const result = convertTemplate(template, "fast-sub");

        assert.ok(result);
        assert.ok(result.includes("<svg>icon</svg>"), `got: ${result}`);
    });
});

test.describe("generateFTemplates", () => {
    let tempDir: string;

    test.beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), "fast-ftemplates-"));
    });

    test.afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    test("should generate an f-template HTML file from a template module", async () => {
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

        await generateFTemplates({ cwd: tempDir, outDir: "out", tagPrefix: "fast" });

        const html = await readFile(join(tempDir, "out", "card.template.html"), "utf8");
        assert.ok(html.includes('<f-template name="fast-card"'));
    });

    test("should skip modules without a template export", async () => {
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

        await generateFTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
            format: html => `<!-- formatted -->\n${html}`,
        });

        const html = await readFile(join(distDir, "text.template.html"), "utf8");
        assert.ok(html.startsWith("<!-- formatted -->"));
    });
});

test.describe("generateWebuiTemplates", () => {
    let tempDir: string;

    test.beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), "fast-webui-"));
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
});
