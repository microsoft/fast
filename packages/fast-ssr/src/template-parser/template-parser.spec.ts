import "../install-dom-shim.js";

import { deepStrictEqual, doesNotThrow, notStrictEqual, strictEqual, throws } from "node:assert/strict";
import { describe, test } from "node:test";
import { customElement, DOMAspect, FASTElement, html, ViewBehaviorFactory, ViewTemplate } from "@microsoft/fast-element";
import { AttributeBindingOp, CustomElementOpenOp, OpCodes, OpType, TemplateElementOpenOp, TextOp, ViewBehaviorFactoryOp } from "./op-codes.js";
import { customElementNameExcludeList, parseStringToOpCodes, parseTemplateToOpCodes } from "./template-parser.js";

@customElement("hello-world")
class HelloWorld extends FASTElement {}

function firstFactory(factories: Record<string, ViewBehaviorFactory>) {
    for (const key in factories) {
        return factories[key];
    }

    return null;
}

describe("parseTemplateToOpCodes", () => {
    test("should throw when invoked with a ViewTemplate with a HTMLTemplateElement template", () => {
        throws(() => {
            parseTemplateToOpCodes(new ViewTemplate(document.createElement("template"), {}));
        });
    });
    test("should not throw when invoked with a ViewTemplate with a string template", () => {
        doesNotThrow(() => {
            parseTemplateToOpCodes(new ViewTemplate("", {}));
        });
    });

    test("should emit a single text op for a template with no bindings or directives", () => {
        const codes = parseTemplateToOpCodes(html`<p>Hello world</p>`);
        const code = codes[0] as TextOp;
        deepStrictEqual(codes.length, 1);
        strictEqual(code.type, OpType.text);
        strictEqual(code.value, "<p>Hello world</p>");
    });
    test("should emit doctype, html, head, and body elements as part of text op", () => {
        const codes = parseTemplateToOpCodes(html`<!DOCTYPE html><html><head></head><body></body></html>`);
        const code = codes[0] as TextOp;
        strictEqual(code.type, OpType.text);
        strictEqual(code.value, "<!DOCTYPE html><html><head></head><body></body></html>");
    })
    test("should emit a viewBehaviorFactory op from a binding", () => {
        const input = html`${() => "hello world"}`;
            const codes = parseTemplateToOpCodes(input);
            strictEqual(codes.length, 1);
            const code = codes[0] as ViewBehaviorFactoryOp;
            strictEqual(code.type, OpType.viewBehaviorFactory);
            strictEqual(code.factory, firstFactory(input.factories));
            strictEqual(code.index, 0);
    });
    test("should emit a directive op from a content binding", () => {
            const input = html`Hello ${() => "World"}.`;

            const codes = parseTemplateToOpCodes(input);
            const code = codes[1] as ViewBehaviorFactoryOp;
            strictEqual(codes.length, 3);
            strictEqual(code.type, OpType.viewBehaviorFactory);
    });
    test("should sandwich viewBehaviorFactory ops between text ops when binding native element content", () => {
            const input = html`<p>${() => "hello world"}</p>`;
            const codes = parseTemplateToOpCodes(input);
            strictEqual(codes[0].type, OpType.text);
            strictEqual(codes[1].type, OpType.viewBehaviorFactory);
            strictEqual(codes[2].type, OpType.text);
        });
    test("should emit custom element codes for undefined custom elements", () => {
        const codes = parseTemplateToOpCodes(html`<undefined-element test-attribute="test" test-bool></undefined-element>`)
        strictEqual(codes.length, 7);
        deepStrictEqual(Array.from(codes), [
            {
                type: OpType.customElementOpen,
                tagName: "undefined-element",
                ctor: undefined,
                staticAttributes: new Map([["test-attribute", "test"], ["test-bool", ""]])
            },
            {
                type: OpType.text,
                value: "<undefined-element  "
            },
            { type: OpType.customElementAttributes },
            { type: OpType.text, value: ">"},
            { type: OpType.customElementShadow },
            { type: OpType.customElementClose },
            { type: OpType.text, value: "</undefined-element>"}
        ]);
    })

    test("should emit custom element open, close, attribute, and shadow ops for a defined custom element", () => {
        const input = html`<hello-world></hello-world>`;
        deepStrictEqual(Array.from(parseTemplateToOpCodes(input)), [
            {type: OpType.customElementOpen, ctor: HelloWorld, tagName: "hello-world", staticAttributes: new Map()},
            {type: OpType.text, value: "<hello-world"},
            {type: OpType.customElementAttributes},
            {type: OpType.text, value: ">"},
            {type: OpType.customElementShadow},
            {type: OpType.customElementClose},
            {type: OpType.text, value: "</hello-world>"}
        ])
    });

    describe("should emit text op for ", () => {
        customElementNameExcludeList.forEach((name) => {
            test(`${name} in customElementExclude list`, () => {
                const codes = parseTemplateToOpCodes(html`<${html.partial(name)}></${html.partial(name)}>`);
                strictEqual(codes.length, 1);
                strictEqual(codes[0].type, OpType.text);
                strictEqual((codes[0] as TextOp).value, `<${name}></${name}>`)
            });
        })
    });
    test("should emit static attributes of a custom element custom element open, close, attribute, and shadow ops for a defined custom element", () => {
        const input = html`<hello-world string-value="test" bool-value></hello-world>`;
        const code = parseTemplateToOpCodes(input).find((op) => op.type ===OpType.customElementOpen) as CustomElementOpenOp | undefined ;
        notStrictEqual(code, undefined);
        strictEqual(code?.staticAttributes.get("string-value"), "test");
        strictEqual(code?.staticAttributes.get("bool-value"), "");
        strictEqual(code?.staticAttributes.size, 2);
    });
    test("should emit attributes binding ops for a native element with attribute bindings", () => {
        const input = html`<p string-value="${x => "value"}" ?bool-value="${x => false}" :property-value="${x => "value"}" @event="${x => {}}"></p>`;
        const codes = parseTemplateToOpCodes(input).filter(x => x.type === OpType.attributeBinding) as AttributeBindingOp[];

        strictEqual(codes.length, 4);
        strictEqual(codes[0].factory.aspectType, DOMAspect.attribute);
        strictEqual(codes[1].factory.aspectType, DOMAspect.booleanAttribute);
        strictEqual(codes[2].factory.aspectType, DOMAspect.property);
        strictEqual(codes[3].factory.aspectType, DOMAspect.event);
    });
    test("should emit attributes binding ops for a custom element with attribute bindings", () => {
        const input = html`<hello-world string-value="${x => "value"}" ?bool-value="${x => false}" :property-value="${x => "value"}" @event="${x => {}}"></hello-world>`;
        const codes = parseTemplateToOpCodes(input).filter(x => x.type === OpType.attributeBinding) as AttributeBindingOp[];

        strictEqual(codes.length, 4);
        strictEqual(codes[0].factory.aspectType, DOMAspect.attribute);
        strictEqual(codes[1].factory.aspectType, DOMAspect.booleanAttribute);
        strictEqual(codes[2].factory.aspectType , DOMAspect.property);
        strictEqual(codes[3].factory.aspectType, DOMAspect.event);
    });

    test("should emit names to attribute bindings ops that do not contain attribute type prefixes", () => {
        const input = html`<hello-world string-value="${x => "value"}" ?bool-value="${x => false}" :property-value="${x => "value"}" @event="${x => {}}"></hello-world>`;
        const codes = parseTemplateToOpCodes(input).filter(x => x.type === OpType.attributeBinding) as AttributeBindingOp[];

        strictEqual(codes.length, 4);
    });

    test("should emit template open and close ops for a template element", () => {
        const input = html`<template></template>`;
        const codes = parseTemplateToOpCodes(input);

        strictEqual(codes.length, 2);
        strictEqual(codes[0].type, OpType.templateElementOpen);
        strictEqual(codes[1].type, OpType.templateElementClose);
    });
    test("should emit template open ops with static attributes", () => {
        const input = html`<template id="foo" boolean></template>`;
        const open = parseTemplateToOpCodes(input)[0] as TemplateElementOpenOp;

        strictEqual(open.staticAttributes.get("id"), "foo");
        strictEqual(open.staticAttributes.get("boolean"), "");
    });
    test("should emit template open ops with dynamic attributes", () => {
        const input = html`<template id=${x => "foo"} ?boolean=${x => true} @event=${x => undefined} :property=${x => "value"}></template>`;
        const open = parseTemplateToOpCodes(input)[0] as TemplateElementOpenOp;

        const attrs = new Map(open.dynamicAttributes.map(x => {
            return [x.factory.targetAspect, x];
        }))

        strictEqual(attrs.has("id"), true);
        strictEqual(attrs.get("id")!.factory.aspectType, DOMAspect.attribute);
        strictEqual(attrs.has("boolean"), true);
        strictEqual(attrs.get("boolean")!.factory.aspectType, DOMAspect.booleanAttribute);
        strictEqual(attrs.has("event"), true);
        strictEqual(attrs.get("event")!.factory.aspectType, DOMAspect.event);
        strictEqual(attrs.has("property"), true);
        strictEqual(attrs.get("property")!.factory.aspectType, DOMAspect.property);
    });
    test("should emit template open ops with static and dynamic attributes", () => {
        const input = html`<template id="foo" ?boolean=${x => true}></template>`;
        const open = parseTemplateToOpCodes(input)[0] as TemplateElementOpenOp;

        strictEqual(open.staticAttributes.size, 1);
        strictEqual(open.staticAttributes.get("id"), "foo");
        strictEqual(open.dynamicAttributes.length, 1);
        strictEqual(open.dynamicAttributes[0].factory.targetAspect, "boolean");
    });

    test("should emit template template ops between other ops when nested inside of another element", () => {
        const input = html`<div><template></template></div>`;
        const codes = parseTemplateToOpCodes(input);

        strictEqual(codes[0].type, OpType.text);
        strictEqual((codes[0] as TextOp).value, `<div>`);
        strictEqual(codes[1].type, OpType.templateElementOpen);
        strictEqual(codes[2].type, OpType.templateElementClose);
        strictEqual(codes[3].type, OpType.text);
        strictEqual((codes[3] as TextOp).value, `</div>`);
    })
});
describe("parseStringToOpCodes", () => {
    test("should increment binding index for each static host binding for a custom element template", () => {
        // Ensure alignment w/ client-side host binding indexing
        const template = html`
            <template attr-one="foo" attr-two="bar"><p>${() => "binding three"}</p></template>
        `
        const codes = parseStringToOpCodes(template.html as string, template.factories, true);
        const bindingCode = codes.find(code => code.type === OpType.viewBehaviorFactory) as ViewBehaviorFactoryOp;

        notStrictEqual(bindingCode, undefined);
        strictEqual(bindingCode.index, 2);
    })
})
