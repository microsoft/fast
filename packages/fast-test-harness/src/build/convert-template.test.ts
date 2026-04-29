import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { installDomShim } from "@microsoft/fast-test-harness/build/dom-shim.js";
import { convertTemplate } from "@microsoft/fast-test-harness/build/generate-templates.js";

// Install the DOM shim before any tests — convertTemplate needs fast-html
// syntax constants which require a DOM environment, and FAST Element needs
// basic DOM globals to initialize.
installDomShim();

// Dynamic import after the DOM shim is installed so FAST Element can
// access `document`, `CSSStyleSheet`, etc.
const { html, ref, slotted, children } = await import("@microsoft/fast-element");

describe("convertTemplate", () => {
    it("should wrap a static template in f-template tags", () => {
        const template = html`<template><div>hello</div></template>`;
        const result = convertTemplate(template, "fast-test");

        assert.ok(result);
        assert.ok(result.includes('<f-template name="fast-test"'));
        assert.ok(result.includes("shadowrootmode"));
        assert.ok(result.includes("<div>hello</div>"));
        assert.ok(result.includes("{{styles}}"));
    });

    it("should return null-safe for empty factories", () => {
        const template = html`<template><span></span></template>`;
        const result = convertTemplate(template, "fast-empty");

        assert.ok(result);
        assert.ok(result.includes("<span></span>"));
    });

    it("should inject {{styles}} after the opening template tag", () => {
        const template = html`<template><p>content</p></template>`;
        const result = convertTemplate(template, "fast-styles");

        assert.ok(result);
        const templateIdx = result.indexOf("<template>");
        const stylesIdx = result.indexOf("{{styles}}");
        assert.ok(stylesIdx > templateIdx, "{{styles}} should appear after <template>");
    });

    it("should convert RefDirective factories to f-ref attributes", () => {
        const template = html`<template><div ${ref("myRef")}></div></template>`;
        const result = convertTemplate(template, "fast-ref");

        assert.ok(result);
        assert.ok(result.includes('f-ref="{myRef}"'), `got: ${result}`);
    });

    it("should convert SlottedDirective factories to f-slotted attributes", () => {
        const template = html`<template><slot ${slotted("slottedItems")}></slot></template>`;
        const result = convertTemplate(template, "fast-slotted");

        assert.ok(result);
        assert.ok(result.includes("f-slotted="), `got: ${result}`);
        assert.ok(result.includes("slottedItems"), `got: ${result}`);
    });

    it("should convert value bindings to {{expression}}", () => {
        const template = html`<template><span>${x => x.label}</span></template>`;
        const result = convertTemplate(template, "fast-binding");

        assert.ok(result);
        assert.ok(result.includes("{{label}}"), `got: ${result}`);
    });

    it("should convert boolean bindings to ?attr expressions", () => {
        const template = html`<template><button ?disabled="${x => x.disabled}"></button></template>`;
        const result = convertTemplate(template, "fast-bool");

        assert.ok(result);
        assert.ok(result.includes('?disabled="{{disabled}}"'), `got: ${result}`);
    });

    it("should inline static sub-templates", () => {
        const template = html`<template><div>${() => "<svg>icon</svg>"}</div></template>`;
        const result = convertTemplate(template, "fast-inline");

        assert.ok(result);
        assert.ok(result.includes("<svg>icon</svg>"), `got: ${result}`);
    });

    it("should convert ChildrenDirective factories to f-children attributes", () => {
        const template = html`<template><div ${children("childItems")}></div></template>`;
        const result = convertTemplate(template, "fast-children");

        assert.ok(result);
        assert.ok(result.includes("f-children="), `got: ${result}`);
        assert.ok(result.includes("childItems"), `got: ${result}`);
    });

    it("should convert event bindings to @event expressions", () => {
        const template = html`<template><button @click="${(x, c) => x.handleClick(c.event)}"></button></template>`;
        const result = convertTemplate(template, "fast-event");

        assert.ok(result);
        assert.ok(result.includes("@click="), `got: ${result}`);
        assert.ok(result.includes("handleClick"), `got: ${result}`);
    });

    it("should convert property bindings to :prop expressions", () => {
        const template = html`<template><input :value="${x => x.currentValue}" /></template>`;
        const result = convertTemplate(template, "fast-prop");

        assert.ok(result);
        assert.ok(result.includes(":value="), `got: ${result}`);
        assert.ok(result.includes("currentValue"), `got: ${result}`);
    });

    it("should handle multiple factories in a single template", () => {
        const template = html`<template><span>${x => x.label}</span><button ?disabled="${x => x.disabled}"></button></template>`;
        const result = convertTemplate(template, "fast-multi");

        assert.ok(result);
        assert.ok(result.includes("{{label}}"), `got: ${result}`);
        assert.ok(result.includes('?disabled="{{disabled}}"'), `got: ${result}`);
    });

    it("should inline a static sub-template ViewTemplate", () => {
        const icon = html`<svg>icon</svg>`;
        const template = html`<template><div>${() => icon}</div></template>`;
        const result = convertTemplate(template, "fast-sub");

        assert.ok(result);
        assert.ok(result.includes("<svg>icon</svg>"), `got: ${result}`);
    });
});
