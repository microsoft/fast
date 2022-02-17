
import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import { test, expect } from "@playwright/test";
import { parseTemplateToOpCodes} from "./template-parser.js";
import { ViewTemplate } from "@microsoft/fast-element"

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
})
