import { expect, test } from "@playwright/test";
import { AttributeDataBindingBehaviorConfig, ContentDataBindingBehaviorConfig, TemplateDirectiveBehaviorConfig, getNextBehavior, AttributeDirectiveBindingBehaviorConfig, getAllPartials, getIndexOfNextMatchingTag, pathResolver } from "./utilities.js";

test.describe("utilities", async () => {
    test.describe("content", async () => {
        test("get the next content binding", async () => {
            const innerHTML = "{{text}}";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("dataBinding");
            expect((templateResult as ContentDataBindingBehaviorConfig)?.subtype).toEqual("content");
            expect((templateResult as ContentDataBindingBehaviorConfig)?.openingStartIndex).toEqual(0);
            expect((templateResult as ContentDataBindingBehaviorConfig)?.openingEndIndex).toEqual(2);
            expect((templateResult as ContentDataBindingBehaviorConfig)?.closingStartIndex).toEqual(6);
            expect((templateResult as ContentDataBindingBehaviorConfig)?.closingEndIndex).toEqual(8);
        });
    });

    test.describe("attributes", async () => {
        test("get the next attribute binding", async () => {
            const innerHTML = "<input type=\"{{type}}\" disabled>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("dataBinding");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.subtype).toEqual("attribute");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.aspect).toEqual(null);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingStartIndex).toEqual(13);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingEndIndex).toEqual(15);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingStartIndex).toEqual(19);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingEndIndex).toEqual(21);
        });

        test("get the next attribute event binding", async () => {
            const innerHTML = "<input @click=\"{{handleClick()}}\">";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("dataBinding");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.subtype).toEqual("attribute");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.aspect).toEqual("@");
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingStartIndex).toEqual(15);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.openingEndIndex).toEqual(17);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingStartIndex).toEqual(30);
            expect((templateResult as AttributeDataBindingBehaviorConfig)?.closingEndIndex).toEqual(32);
        });
    });

    test.describe("templates", async () => {
        test("when directive", async () => {
            const innerHTML = "<f-when value=\"{{show}}\">Hello world</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("templateDirective");
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(0);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(25);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(36);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(45);
        });
        test("when directive with content", async () => {
            const innerHTML = "Hello pluto<f-when value=\"{{show}}\">Hello world</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("templateDirective");
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(11);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(36);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(47);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(56);
        });
        test("when directive with binding", async () => {
            const innerHTML = "<f-when value=\"{{show}}\">{{text}}</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("templateDirective");
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(0);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(25);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(33);
            expect((templateResult as TemplateDirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(42);
        });
    });

    test.describe("attributes", async () => {
        test("children directive", async () => {
            const innerHTML = "<ul f-children=\"{{list}}\"></ul>";
            const result = getNextBehavior(innerHTML);

            expect(result?.type).toEqual("dataBinding");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.subtype).toEqual("attributeDirective")
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.name).toEqual("children");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingStartIndex).toEqual(16);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingEndIndex).toEqual(18);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingStartIndex).toEqual(22);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingEndIndex).toEqual(24);
        });
        test("slotted directive", async () => {
            const innerHTML = "<slot f-slotted=\"{{slottedNodes}}\"></slot>";
            const result = getNextBehavior(innerHTML);

            expect(result?.type).toEqual("dataBinding");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.subtype).toEqual("attributeDirective")
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.name).toEqual("slotted");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingStartIndex).toEqual(17);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingEndIndex).toEqual(19);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingStartIndex).toEqual(31);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingEndIndex).toEqual(33);
        });
        test("ref directive", async () => {
            const innerHTML = "<video f-ref=\"{{video}}\"></video>";
            const result = getNextBehavior(innerHTML);

            expect(result?.type).toEqual("dataBinding");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.subtype).toEqual("attributeDirective")
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.name).toEqual("ref");
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingStartIndex).toEqual(14);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.openingEndIndex).toEqual(16);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingStartIndex).toEqual(21);
            expect((result as AttributeDirectiveBindingBehaviorConfig)?.closingEndIndex).toEqual(23);
        });
    });

    test.describe("partials", async () => {
        test("get a single partial", async () => {
            const partialContent = "{{text}}";
            const partial = `<f-partial id="foo">${partialContent}</f-partial>`;
            const allPartials = getAllPartials(partial);

            expect(allPartials.foo.innerHTML).toEqual(partialContent);
            expect(allPartials.foo.startIndex).toEqual(20);
            expect(allPartials.foo.endIndex).toEqual(28);
        });
        test("get multiple partials", async () => {
            const partial1Content = "{{text}}";
            const partial2Content = "{{othertext}}";
            const partial1 = `<f-partial id="foo">${partial1Content}</f-partial>`;
            const partial2 = `<f-partial id="foobar">${partial2Content}</f-partial>`;
            const allPartials = getAllPartials(`${partial1}${partial2}`);

            expect(allPartials.foo.innerHTML).toEqual(partial1Content);
            expect(allPartials.foo.startIndex).toEqual(20);
            expect(allPartials.foo.endIndex).toEqual(28);

            expect(allPartials.foobar.innerHTML).toEqual(partial2Content);
            expect(allPartials.foobar.startIndex).toEqual(63);
            expect(allPartials.foobar.endIndex).toEqual(76);
        });
    });

    test.describe("getIndexOfNextMatchingTag", async () => {
        test("should resolve a single tag", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div>Hello world</div>`,
                `<div`,
                `</div>`,
                0
            );

            expect(index).toEqual(16);
        });
        test("should resolve when there is a nested tag", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div><div>Hello world</div></div>`,
                `<div`,
                `</div>`,
                0
            );

            expect(index).toEqual(27);
        });
        test("should get adjacent tags", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div>Hello world</div><div>Hello pluto</div>`,
                `<div`,
                `</div>`,
                0
            );

            expect(index).toEqual(16);
        });
        test("should add an offset for content before the tag", async () => {
            const index = getIndexOfNextMatchingTag(
                `<div>Hello world</div>`,
                `<div`,
                `</div>`,
                23
            );

            expect(index).toEqual(39);
        });
    });

    test.describe("pathResolver", async () => {
        test("should resolve a path with no nesting", async () => {
            expect(pathResolver("foo")({ foo: "bar" }, {})).toEqual("bar");
        });
        test("should resolve a path with nesting", async () => {
            expect(pathResolver("foo.bar.bat")({ foo: { bar: { bat: "baz" }} }, {})).toEqual("baz");
        });
        test("should resolve a path with no nesting and self reference", async () => {
            expect(pathResolver("foo", true)("bar", {})).toEqual("bar");
        });
        test("should resolve a path with nesting and self reference", async () => {
            expect(pathResolver("foo.bar.bat", true)({ bar: { bat: "baz" }}, {})).toEqual("baz");
        });
        test("should resolve a path with context", async () => {
            expect(pathResolver("../foo")({}, {parent: {foo: "bar"}})).toEqual("bar");
        });
    });
});
