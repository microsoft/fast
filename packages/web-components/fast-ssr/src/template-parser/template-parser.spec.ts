
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
		input: ViewTemplate,
		result: Op[];
	}

	const fixtures: ( (()=> Fixture) | Fixture )[] = [
		{input: html`<p>Hello world</p>`, result: [{type: OpType.text, value: "<p>Hello world</p>"}]},
		{input: html`<!DOCTYPE html><html><head></head><body></body></html>`, result: [{type: OpType.text, value: "<!DOCTYPE html><html><head></head><body></body></html>"}]},
		() => {
			const input = html`${() => "hello world"}`;
			return { input, result: [{ type: OpType.directive, directive: input.directives[0]}] } as Fixture
		}
	];

	fixtures.forEach((fixture, index) => {
		const { input, result } = typeof fixture === "function" ? fixture() : fixture;
		test(`should parse template to op codes for fixture ${index}`, () => {
			expect(parseTemplateToOpCodes(input)).toEqual(result)
		})
	})
})
