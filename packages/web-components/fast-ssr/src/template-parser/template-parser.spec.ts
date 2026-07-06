
import "../install-dom-shim.js";
import { customElement, DOMAspect, FASTElement, html, ViewBehaviorFactory, ViewTemplate } from "@microsoft/fast-element";
import { expect, test } from "@playwright/test";
import { AttributeBindingOp, CustomElementOpenOp, ViewBehaviorFactoryOp, OpType, TemplateElementOpenOp, TextOp } from "./op-codes.js";
import { parseTemplateToOpCodes } from "./template-parser.js";

@customElement("hello-world")
class HelloWorld extends FASTElement {}

function firstFactory(factories: Record<string, ViewBehaviorFactory>) {
    for (const key in factories) {
        return factories[key];
    }

    return null;
}

test.describe("parseTemplateToOpCodes", () => {
    test("should throw when invoked with a ViewTemplate with a HTMLTemplateElement template", () => {
        expect(() => {
            parseTemplateToOpCodes(new ViewTemplate(document.createElement("template"), {}));
        }).toThrow();
    });
    test("should not throw when invoked with a ViewTemplate with a string template", () => {
        expect(() => {
            parseTemplateToOpCodes(new ViewTemplate("", {}));
        }).not.toThrow();
    });

    test("should emit a single text op for a template with no bindings or directives", () => {
            expect(parseTemplateToOpCodes(html`<p>Hello world</p>`)).toEqual([{type: OpType.text, value: "<p>Hello world</p>"}])
    });
    test("should emit doctype, html, head, and body elements as part of text op", () => {
        expect(parseTemplateToOpCodes(html`<!DOCTYPE html><html><head></head><body></body></html>`)).toEqual([{type: OpType.text, value: "<!DOCTYPE html><html><head></head><body></body></html>"}])
    })
    test("should emit a viewBehaviorFactory op from a binding", () => {
            const input = html`${() => "hello world"}`;
            expect(parseTemplateToOpCodes(input)).toEqual([{ type: OpType.viewBehaviorFactory, factory: firstFactory(input.factories)}])
    });
    test("should emit a directive op from a content binding", () => {
            const input = html`Hello ${() => "World"}.`;

            const codes = parseTemplateToOpCodes(input);
            const code = codes[1] as ViewBehaviorFactoryOp;
            expect(codes.length).toBe(3);
            expect(code.type).toBe(OpType.viewBehaviorFactory);
    });
    test("should sandwich viewBehaviorFactory ops between text ops when binding native element content", () => {

            const input = html`<p>${() => "hello world"}</p>`;
            expect(parseTemplateToOpCodes(input)).toEqual([
                    { type: OpType.text, value: "<p>"},
                    { type: OpType.viewBehaviorFactory, factory: firstFactory(input.factories)},
                    { type: OpType.text, value: "</p>"},
            ])
        });
    test("should emit a custom element as text if it has not been defined", () => {
        const input = html`<undefined-element test-attribute="test" test-bool></undefined-element>`;
        expect(parseTemplateToOpCodes(input)).toEqual([{ type: OpType.text, value: "<undefined-element test-attribute=\"test\" test-bool></undefined-element>"}])
    })

    test("should emit custom element open, close, attribute, and shadow ops for a defined custom element", () => {
        const input = html`<hello-world></hello-world>`;
        expect(parseTemplateToOpCodes(input)).toEqual([
            {type: OpType.customElementOpen, ctor: HelloWorld, tagName: "hello-world", staticAttributes: new Map()},
            {type: OpType.text, value: "<hello-world"},
            {type: OpType.customElementAttributes},
            {type: OpType.text, value: ">"},
            {type: OpType.customElementShadow},
            {type: OpType.customElementClose},
            {type: OpType.text, value: "</hello-world>"}
        ])
    });
    test("should emit static attributes of a custom element custom element open, close, attribute, and shadow ops for a defined custom element", () => {
        const input = html`<hello-world string-value="test" bool-value></hello-world>`;
        const code = parseTemplateToOpCodes(input).find((op) => op.type ===OpType.customElementOpen) as CustomElementOpenOp | undefined ;
        expect(code).not.toBeUndefined();
        expect(code?.staticAttributes.get("string-value")).toBe("test");
        expect(code?.staticAttributes.get("bool-value")).toBe("");
        expect(code?.staticAttributes.size).toBe(2);
    });
    test("should emit attributes binding ops for a native element with attribute bindings", () => {
        const input = html`<p string-value="${x => "value"}" ?bool-value="${x => false}" :property-value="${x => "value"}" @event="${x => {}}"></p>`;
        const codes = parseTemplateToOpCodes(input).filter(x => x.type === OpType.attributeBinding) as AttributeBindingOp[];

        expect(codes.length).toBe(4);
        expect(codes[0].aspect).toBe(DOMAspect.attribute);
        expect(codes[1].aspect).toBe(DOMAspect.booleanAttribute);
        expect(codes[2].aspect).toBe(DOMAspect.property);
        expect(codes[3].aspect).toBe(DOMAspect.event);
    });
    test("should emit attributes binding ops for a custom element with attribute bindings", () => {
        const input = html`<hello-world string-value="${x => "value"}" ?bool-value="${x => false}" :property-value="${x => "value"}" @event="${x => {}}"></hello-world>`;
        const codes = parseTemplateToOpCodes(input).filter(x => x.type === OpType.attributeBinding) as AttributeBindingOp[];

        expect(codes.length).toBe(4);
        expect(codes[0].aspect).toBe(DOMAspect.attribute);
        expect(codes[1].aspect).toBe(DOMAspect.booleanAttribute);
        expect(codes[2].aspect).toBe(DOMAspect.property);
        expect(codes[3].aspect).toBe(DOMAspect.event);
    });

    test("should emit names to attribute bindings ops that do not contain attribute type prefixes", () => {
        const input = html`<hello-world string-value="${x => "value"}" ?bool-value="${x => false}" :property-value="${x => "value"}" @event="${x => {}}"></hello-world>`;
        const codes = parseTemplateToOpCodes(input).filter(x => x.type === OpType.attributeBinding) as AttributeBindingOp[];

        expect(codes.length).toBe(4);
    });

    test("should emit template open and close ops for a template element", () => {
        const input = html`<template></template>`;
        const codes = parseTemplateToOpCodes(input);

        expect(codes.length).toBe(2);
        expect(codes[0].type).toBe(OpType.templateElementOpen);
        expect(codes[1].type).toBe(OpType.templateElementClose);
    });
    test("should emit template open ops with static attributes", () => {
        const input = html`<template id="foo" boolean></template>`;
        const open = parseTemplateToOpCodes(input)[0] as TemplateElementOpenOp;

        expect(open.staticAttributes.get("id")).toBe("foo");
        expect(open.staticAttributes.get("boolean")).toBe("");
    });
    test("should emit template open ops with dynamic attributes", () => {
        const input = html`<template id=${x => "foo"} ?boolean=${x => true} @event=${x => undefined} :property=${x => "value"}></template>`;
        const open = parseTemplateToOpCodes(input)[0] as TemplateElementOpenOp;

        const attrs = new Map(open.dynamicAttributes.map(x => {
            return [x.target, x];
        }))

        expect(attrs.has("id")).toBe(true);
        expect(attrs.get("id")!.aspect).toBe(DOMAspect.attribute);
        expect(attrs.has("boolean")).toBe(true);
        expect(attrs.get("boolean")!.aspect).toBe(DOMAspect.booleanAttribute);
        expect(attrs.has("event")).toBe(true);
        expect(attrs.get("event")!.aspect).toBe(DOMAspect.event);
        expect(attrs.has("property")).toBe(true);
        expect(attrs.get("property")!.aspect).toBe(DOMAspect.property);
    });
    test("should emit template open ops with static and dynamic attributes", () => {
        const input = html`<template id="foo" ?boolean=${x => true}></template>`;
        const open = parseTemplateToOpCodes(input)[0] as TemplateElementOpenOp;

        expect(open.staticAttributes.size).toBe(1);
        expect(open.staticAttributes.get("id")).toBe("foo");
        expect(open.dynamicAttributes.length).toBe(1);
        expect(open.dynamicAttributes[0].target).toBe("boolean");
    });

    test("should emit template template ops between other ops when nested inside of another element", () => {
        const input = html`<div><template></template></div>`;
        const codes = parseTemplateToOpCodes(input);

        expect(codes[0].type).toBe(OpType.text);
        expect((codes[0] as TextOp).value).toBe(`<div>`);
        expect(codes[1].type).toBe(OpType.templateElementOpen);
        expect(codes[2].type).toBe(OpType.templateElementClose);
        expect(codes[3].type).toBe(OpType.text);
        expect((codes[3] as TextOp).value).toBe(`</div>`);
    })
});
