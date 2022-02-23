
import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import { test, expect } from "@playwright/test";
import { parseTemplateToOpCodes} from "./template-parser.js";
import { ViewTemplate, html } from "@microsoft/fast-element"
import { Op, OpType } from "./op-codes.js";

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

	interface Fixture {
		title: string,
		input: ViewTemplate,
		result: Op[];
	}

	const fixtures: ( (()=> Fixture) | Fixture )[] = [
		{
			title: "should emit a single text op for a template with no bindings or directives",
			input: html`<p>Hello world</p>`, result: [{type: OpType.text, value: "<p>Hello world</p>"}]
		},
		{
			title: "should emit doctype, html, head, and body elements as part of text op",
			input: html`<!DOCTYPE html><html><head></head><body></body></html>`, result: [{type: OpType.text, value: "<!DOCTYPE html><html><head></head><body></body></html>"}]
		},
		() => {
			const input = html`${() => "hello world"}`;
			return {
				title: "should emit a directive op from a binding",
				input,
				result: [{ type: OpType.directive, directive: input.directives[0]}] } as Fixture
		},
		() => {
			const input = html`<p>${() => "hello world"}</p>`;
			return {
				title: "should sandwich directive ops between text ops when binding native element content",
				input,
				result: [
					{ type: OpType.text, value: "<p>"},
					{ type: OpType.directive, directive: input.directives[0]},
					{ type: OpType.text, value: "</p>"},
			]} as Fixture
		},
	];

	fixtures.forEach((fixture, index) => {
		const { input, result, title } = typeof fixture === "function" ? fixture() : fixture;
		test(title, () => {
			expect(parseTemplateToOpCodes(input)).toEqual(result)
		});
	})
})
