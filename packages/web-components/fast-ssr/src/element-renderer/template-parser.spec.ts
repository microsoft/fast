
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

	const fixtures: {input: ViewTemplate, result: Op[]}[] = [
		{input: html`<p>Hello world</p>`, result: [{type: OpType.text, value: "<p>Hello world</p>"}]},
		{input: html`<!DOCTYPE html><html><head></head><body></body></html>`, result: [{type: OpType.text, value: "<!DOCTYPE html><html><head></head><body></body></html>"}]}
	];

	fixtures.forEach(({ input, result}, index) => {
		test(`should parse template to op codes for fixture ${index}`, () => {
			expect(parseTemplateToOpCodes(input)).toEqual(result)
		})
	})
})
