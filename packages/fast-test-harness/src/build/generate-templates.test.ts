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

interface RepeatHost {
    items: RepeatItem[];
}

interface RepeatChild {
    name: string;
}

interface RepeatItem {
    children: RepeatChild[];
    label: string;
    name: string;
    visible: boolean;
}

interface WhenHost {
    items: RepeatItem[];
    label: string;
    ready: boolean;
    visible: boolean;
}

test.describe("convertTemplate", async () => {
    // Install the DOM shim before any tests — convertTemplate needs declarative
    // syntax constants which require a DOM environment, and FAST Element needs
    // basic DOM globals to initialize.
    installDomShim();

    // Dynamic import after the DOM shim is installed so FAST Element can
    // access `document`, `CSSStyleSheet`, etc.
    const { html, ref, slotted, children, elements, repeat, when } = await import(
        "@microsoft/fast-element"
    );
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

    test("should strip static template wrapper tags with whitespace", () => {
        const template = {
            html: '<template\n    data-host="x"\n><span>content</span></template \n\t>',
            factories: {},
        };
        const result = convertTemplate(template, "fast-whitespace");

        assert.ok(result);
        assert.ok(result.includes("<span>content</span>"), `got: ${result}`);
        assert.ok(!result.includes("data-host"), `got: ${result}`);
        assert.ok(!result.includes("</template \n\t>"), `got: ${result}`);
    });

    test("should inject {{styles}} after template opening tags with whitespace", () => {
        const template = {
            html: "<template\n><span>content</span></template \n>",
            factories: {
                "fast-test-1": {
                    constructor: { name: "UnknownDirective" },
                },
            },
        };
        const result = convertTemplate(template, "fast-whitespace-dynamic");

        assert.ok(result);
        assert.ok(!result.includes("<template><template"), `got: ${result}`);
        assert.ok(result.includes("<template\n>{{styles}}"), `got: ${result}`);
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

    test("should convert SlottedDirective factories with elements filter", () => {
        const template = html`<template><slot ${slotted({
            property: "slottedItems",
            filter: elements(),
        })}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted-elements");

        assert.ok(result);
        assert.ok(
            result.includes('f-slotted="{slottedItems filter elements()}"'),
            `got: ${result}`,
        );
    });

    test("should convert SlottedDirective factories with selector elements filter", () => {
        const template = html`<template><slot ${slotted({
            property: "slottedItems",
            filter: elements("p, ol"),
        })}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted-elements-selector");

        assert.ok(result);
        assert.ok(
            result.includes('f-slotted="{slottedItems filter elements(p, ol)}"'),
            `got: ${result}`,
        );
    });

    test("should convert SlottedDirective factories with the single option", () => {
        const template = html`<template><slot ${slotted({
            property: "slottedItem",
            single: true,
        })}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted-single");

        assert.ok(result);
        assert.ok(result.includes('f-slotted="{slottedItem single}"'), `got: ${result}`);
    });

    test("should convert SlottedDirective factories with single and a filter", () => {
        const template = html`<template><slot ${slotted({
            property: "slottedItem",
            filter: elements(),
            single: true,
        })}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted-single-elements");

        assert.ok(result);
        assert.ok(
            result.includes('f-slotted="{slottedItem single filter elements()}"'),
            `got: ${result}`,
        );
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

    test("should convert ChildrenDirective factories with an elements filter", () => {
        const template = html`<template><div ${children({
            property: "childItems",
            filter: elements("li"),
        })}></div></template>`;
        const result = convertTemplate(template, "fast-children-elements");

        assert.ok(result);
        assert.ok(
            result.includes('f-children="{childItems filter elements(li)}"'),
            `got: ${result}`,
        );
    });

    test("should convert ChildrenDirective factories with the single option", () => {
        const template = html`<template><div ${children({
            property: "childItem",
            filter: elements(),
            single: true,
        })}></div></template>`;
        const result = convertTemplate(template, "fast-children-single");

        assert.ok(result);
        assert.ok(
            result.includes('f-children="{childItem single filter elements()}"'),
            `got: ${result}`,
        );
    });

    test("should convert an inline element-only filter to elements()", () => {
        const template = html`<template><slot ${slotted({
            property: "slottedItems",
            filter: (node: Node) => node.nodeType === 1,
        })}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted-inline-elements");

        assert.ok(result);
        assert.ok(
            result.includes('f-slotted="{slottedItems filter elements()}"'),
            `got: ${result}`,
        );
    });

    test("should not fabricate an elements() filter for an undecodable slotted filter", () => {
        const template = html`<template><slot ${slotted({
            property: "slottedItems",
            // Throws on the element probe: no textContent on the probe object.
            filter: (node: Node) => node.textContent!.length > 0,
        })}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted-custom-filter");

        assert.ok(result);
        assert.ok(result.includes('f-slotted="{slottedItems}"'), `got: ${result}`);
        assert.ok(!result.includes("filter elements("), `got: ${result}`);
    });

    test("should not fabricate an elements() filter for an undecodable children filter", () => {
        const template = html`<template><div ${children({
            property: "childItems",
            // Text nodes only — the inverse of elements(); not representable.
            filter: (node: Node) => node.nodeType === 3,
        })}></div></template>`;
        const result = convertTemplate(template, "fast-children-custom-filter");

        assert.ok(result);
        assert.ok(result.includes('f-children="{childItems}"'), `got: ${result}`);
        assert.ok(!result.includes("filter elements("), `got: ${result}`);
    });

    test("should not fabricate an elements() filter for a pass-through filter", () => {
        const template = html`<template><div ${children({
            property: "childItems",
            filter: () => true,
        })}></div></template>`;
        const result = convertTemplate(template, "fast-children-passthrough-filter");

        assert.ok(result);
        assert.ok(result.includes('f-children="{childItems}"'), `got: ${result}`);
        assert.ok(!result.includes("filter elements("), `got: ${result}`);
    });

    test("should convert event bindings to @event expressions", () => {
        const template = html`<template><button @click="${(x, c) => x.handleClick(c.event)}"></button></template>`;
        const result = convertTemplate(template, "fast-event");

        assert.ok(result);
        assert.ok(result.includes("@click="), `got: ${result}`);
        assert.ok(result.includes("handleClick"), `got: ${result}`);
    });

    test("should convert custom event bindings", () => {
        const template = html`<template><test-child @value-change="${(x, c) => x.handleValueChange(c.event)}"></test-child></template>`;
        const result = convertTemplate(template, "fast-custom-event");

        assert.ok(result);
        assert.ok(result.includes("@value-change="), `got: ${result}`);
        assert.ok(result.includes("handleValueChange"), `got: ${result}`);
        assert.ok(result.includes("$e"), `got: ${result}`);
    });

    test("should convert property bindings to :prop expressions", () => {
        const template = html`<template><input :value="${x => x.currentValue}" /></template>`;
        const result = convertTemplate(template, "fast-prop");

        assert.ok(result);
        assert.ok(result.includes(":value="), `got: ${result}`);
        assert.ok(result.includes("currentValue"), `got: ${result}`);
    });

    test("should convert plain innerHTML wrappers to unescaped content bindings", () => {
        const template = html`<template><div :innerHTML="${x => x.html}"></div></template>`;
        const result = convertTemplate(template, "fast-inner-html");

        assert.ok(result);
        assert.ok(result.includes("{{{html}}}"), `got: ${result}`);
        assert.ok(!result.includes(":innerHTML"), `got: ${result}`);
    });

    test("should preserve innerHTML property bindings on divs with static attributes", () => {
        const template = html`<template><div class="content" :innerHTML="${x => x.html}"></div></template>`;
        const result = convertTemplate(template, "fast-inner-html-attrs");

        assert.ok(result);
        assert.ok(
            result.includes('<div class="content" :innerHTML="{{html}}"></div>'),
            `got: ${result}`,
        );
        assert.ok(!result.includes("{{{html}}}"), `got: ${result}`);
    });

    test("should preserve innerHTML property bindings on divs with other bindings", () => {
        const template = html`<template><div :innerHTML="${x => x.html}" ?hidden="${x => x.hidden}"></div></template>`;
        const result = convertTemplate(template, "fast-inner-html-bindings");

        assert.ok(result);
        assert.ok(result.includes(':innerHTML="{{html}}"'), `got: ${result}`);
        assert.ok(result.includes('?hidden="{{hidden}}"'), `got: ${result}`);
        assert.ok(!result.includes("{{{html}}}"), `got: ${result}`);
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

    test("should convert RepeatDirective factories to f-repeat directives", () => {
        const itemTemplate = html<RepeatItem>`<li>${x => x.label}</li>`;
        const template = html<RepeatHost>`<template><ul>${repeat(
            x => x.items,
            itemTemplate,
            {
                positioning: true,
                recycle: false,
            },
        )}</ul></template>`;
        const result = convertTemplate(template, "fast-repeat");

        assert.ok(result);
        assert.ok(
            result.includes(
                '<f-repeat value="{{item in items}}" positioning="true" recycle="false">',
            ),
            `got: ${result}`,
        );
        assert.ok(result.includes("<li>{{item.label}}</li>"), `got: ${result}`);
        assert.ok(result.includes("</f-repeat>"), `got: ${result}`);
        assert.ok(!result.includes("<!--fast-"), `got: ${result}`);
    });

    test("should convert RepeatDirective factories with inline templates", () => {
        const template = html<RepeatHost>`<template><ul>${repeat(
            x => x.items,
            html<RepeatItem>`<li>${x => x.name}</li>`,
        )}</ul></template>`;
        const result = convertTemplate(template, "fast-repeat-inline");

        assert.ok(result);
        assert.ok(
            result.includes('<f-repeat value="{{item in items}}">'),
            `got: ${result}`,
        );
        assert.ok(result.includes("<li>{{item.name}}</li>"), `got: ${result}`);
        assert.ok(result.includes("</f-repeat>"), `got: ${result}`);
        assert.ok(!result.includes("<!--fast-"), `got: ${result}`);
    });

    test("should convert nested RepeatDirective factories", () => {
        const childTemplate = html<RepeatChild>`<li>${x => x.name}</li>`;
        const itemTemplate = html<RepeatItem>`<li>${x => x.label}<ol>${repeat(
            x => x.children,
            childTemplate,
        )}</ol></li>`;
        const template = html<RepeatHost>`<template><ul>${repeat(
            x => x.items,
            itemTemplate,
        )}</ul></template>`;
        const result = convertTemplate(template, "fast-repeat-nested");

        assert.ok(result);
        assert.ok(
            result.includes('<f-repeat value="{{item in items}}">'),
            `got: ${result}`,
        );
        assert.ok(
            result.includes('<f-repeat value="{{item1 in item.children}}">'),
            `got: ${result}`,
        );
        assert.ok(result.includes("{{item.label}}"), `got: ${result}`);
        assert.ok(result.includes("{{item1.name}}"), `got: ${result}`);
    });

    test("should convert when bindings to f-when directives", () => {
        const template = html<WhenHost>`<template>${when(
            x => x.visible,
            html<WhenHost>`<span>${x => x.label}</span>`,
        )}</template>`;
        const result = convertTemplate(template, "fast-when");

        assert.ok(result);
        assert.ok(result.includes('<f-when value="{{visible}}">'), `got: ${result}`);
        assert.ok(result.includes("<span>{{label}}</span>"), `got: ${result}`);
        assert.ok(result.includes("</f-when>"), `got: ${result}`);
    });

    test("should convert nested when bindings", () => {
        const template = html<WhenHost>`<template>${when(
            x => x.visible,
            html<WhenHost>`${when(
                x => x.ready,
                html<WhenHost>`<span>${x => x.label}</span>`,
            )}`,
        )}</template>`;
        const result = convertTemplate(template, "fast-when-nested");

        assert.ok(result);
        assert.ok(result.includes('<f-when value="{{visible}}">'), `got: ${result}`);
        assert.ok(result.includes('<f-when value="{{ready}}">'), `got: ${result}`);
        assert.ok(result.includes("<span>{{label}}</span>"), `got: ${result}`);
    });

    test("should convert when bindings inside repeat item templates", () => {
        const itemTemplate = html<RepeatItem>`<li>${when(
            x => x.visible,
            html<RepeatItem>`<span>${x => x.label}</span>`,
        )}</li>`;
        const template = html<RepeatHost>`<template><ul>${repeat(
            x => x.items,
            itemTemplate,
        )}</ul></template>`;
        const result = convertTemplate(template, "fast-repeat-when");

        assert.ok(result);
        assert.ok(
            result.includes('<f-repeat value="{{item in items}}">'),
            `got: ${result}`,
        );
        assert.ok(result.includes('<f-when value="{{item.visible}}">'), `got: ${result}`);
        assert.ok(result.includes("<span>{{item.label}}</span>"), `got: ${result}`);
    });

    test("should convert repeat directives inside when bindings", () => {
        const template = html<WhenHost>`<template>${when(
            x => x.visible,
            html<WhenHost>`<ul>${repeat(
                x => x.items,
                html<RepeatItem>`<li>${x => x.name}</li>`,
            )}</ul>`,
        )}</template>`;
        const result = convertTemplate(template, "fast-when-repeat");

        assert.ok(result);
        assert.ok(result.includes('<f-when value="{{visible}}">'), `got: ${result}`);
        assert.ok(
            result.includes('<f-repeat value="{{item in items}}">'),
            `got: ${result}`,
        );
        assert.ok(result.includes("<li>{{item.name}}</li>"), `got: ${result}`);
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

        await generateFTemplates({ cwd: tempDir, tagPrefix: "contoso" });

        const html = await readFile(join(distDir, "badge.template.html"), "utf8");
        assert.ok(html.includes('<f-template name="contoso-badge"'));
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

    test("should preserve subdirectory structure in outDir", async () => {
        const distDir = join(tempDir, "dist", "button");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "button.template.js"),
            `export const template = {
                html: "<template><button>click</button></template>",
                factories: {}
            };`,
        );

        await generateFTemplates({
            cwd: tempDir,
            outDir: "src",
            tagPrefix: "fast",
            resolveShadowOptions: null,
        });

        const html = await readFile(
            join(tempDir, "src", "button", "button.template.html"),
            "utf8",
        );
        assert.ok(html.includes('<f-template name="fast-button"'));
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

    test("should add `shadowrootdelegatesfocus` by default when definition-async exists", async () => {
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

        await generateFTemplates({
            cwd: tempDir,
            tagPrefix: "fast",
        });

        const html = await readFile(join(distDir, "input.template.html"), "utf8");
        assert.ok(
            html.includes("shadowrootdelegatesfocus"),
            `should include delegatesFocus on f-template tag, got: ${html}`,
        );
        assert.ok(
            html.includes("<f-template"),
            `should still have f-template wrapper, got: ${html}`,
        );
    });

    test("should not add `shadowrootdelegatesfocus` when no definition-async exists", async () => {
        const distDir = join(tempDir, "dist");
        await mkdir(distDir, { recursive: true });

        await writeFile(
            join(distDir, "div.template.js"),
            `export const template = {
                html: "<template><div>hello</div></template>",
                factories: {}
            };`,
        );

        await generateFTemplates({ cwd: tempDir, tagPrefix: "fast" });

        const html = await readFile(join(distDir, "div.template.html"), "utf8");
        assert.ok(!html.includes("shadowrootdelegatesfocus"));
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
});
