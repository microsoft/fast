
import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import { test, expect } from "@playwright/test";
import { parseTemplateToOpCodes} from "./template-parser.js";
import { ViewTemplate, html, FASTElement, customElement } from "@microsoft/fast-element"
import { Op, OpType, CustomElementOpenOp, AttributeBindingOp } from "./op-codes.js";
import { AttributeType } from "./attributes.js";

@customElement("hello-world")
class HelloWorld extends FASTElement {}

test.describe("parseTemplateToOpCodes", () => {
	test("should throw when invoked with a ViewTemplate with a HTMLTemplateElement template", () => {
		expect(() => {
			parseTemplateToOpCodes(new ViewTemplate(document.createElement("template"), []));
		}).toThrow();
	});
	test("should not throw when invoked with a ViewTemplate with a string template", () => {
		expect(() => {
			parseTemplateToOpCodes(new ViewTemplate("", []));
		}).not.toThrow();
	});

	test("should emit a single text op for a template with no bindings or directives", () => {
			expect(parseTemplateToOpCodes(html`<p>Hello world</p>`)).toEqual([{type: OpType.text, value: "<p>Hello world</p>"}])
	});
	test("should emit doctype, html, head, and body elements as part of text op", () => {
		expect(parseTemplateToOpCodes(html`<!DOCTYPE html><html><head></head><body></body></html>`)).toEqual([{type: OpType.text, value: "<!DOCTYPE html><html><head></head><body></body></html>"}])
	})
	test("should emit a directive op from a binding", () => {
			const input = html`${() => "hello world"}`;
			expect(parseTemplateToOpCodes(input)).toEqual([{ type: OpType.directive, directive: input.directives[0]}])
	})

	test("should sandwich directive ops between text ops when binding native element content", () => {

			const input = html`<p>${() => "hello world"}</p>`;
			expect(parseTemplateToOpCodes(input)).toEqual([
					{ type: OpType.text, value: "<p>"},
					{ type: OpType.directive, directive: input.directives[0]},
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
			expect(codes[0].attributeType).toBe(AttributeType.content);
			expect(codes[1].attributeType).toBe(AttributeType.booleanContent);
			expect(codes[2].attributeType).toBe(AttributeType.idl);
			expect(codes[3].attributeType).toBe(AttributeType.event);
	});
})
