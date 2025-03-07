import { expect, test } from "@playwright/test";
import { AttributeDataBindingBehaviorConfig, ContentDataBindingBehaviorConfig, DirectiveBehaviorConfig, getNextBehavior } from "./utilities.js";
import type { DataBindingBehaviorConfig } from "./utilities.js";

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

            expect(templateResult?.type).toEqual("directive");
            expect((templateResult as DirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(0);
            expect((templateResult as DirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(25);
            expect((templateResult as DirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(36);
            expect((templateResult as DirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(45);
        });
        test("when directive with content", async () => {
            const innerHTML = "Hello pluto<f-when value=\"{{show}}\">Hello world</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("directive");
            expect((templateResult as DirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(11);
            expect((templateResult as DirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(36);
            expect((templateResult as DirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(47);
            expect((templateResult as DirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(56);
        });
        test("when directive with binding", async () => {
            const innerHTML = "<f-when value=\"{{show}}\">{{text}}</f-when>";
            const templateResult = getNextBehavior(innerHTML);

            expect(templateResult?.type).toEqual("directive");
            expect((templateResult as DirectiveBehaviorConfig)?.openingTagStartIndex).toEqual(0);
            expect((templateResult as DirectiveBehaviorConfig)?.openingTagEndIndex).toEqual(25);
            expect((templateResult as DirectiveBehaviorConfig)?.closingTagStartIndex).toEqual(33);
            expect((templateResult as DirectiveBehaviorConfig)?.closingTagEndIndex).toEqual(42);
        });
    });
});
