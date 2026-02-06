import { expect, test } from "@playwright/test";

test.describe("Attributes", () => {
    test("should be properly aggregated across an inheritance hierarchy.", async ({
        page,
    }) => {
        await page.goto("/");

        const { componentAAttributesLength, componentBAttributesLength } =
            await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AttributeConfiguration, AttributeDefinition, FASTElement } =
                    await import("/main.js");

                abstract class BaseElement extends FASTElement {
                    attributeOne = "";
                }
                // Manually add attribute configuration like @attr decorator does
                AttributeConfiguration.locate(BaseElement).push({
                    property: "attributeOne",
                } as any);

                class ComponentA extends BaseElement {
                    attributeTwo = "two-A";
                }
                // Manually add attribute configuration like @attr decorator does
                AttributeConfiguration.locate(ComponentA).push({
                    property: "attributeTwo",
                } as any);

                class ComponentB extends BaseElement {
                    private get attributeTwo(): string {
                        return "two-B";
                    }
                }

                const componentAAttributes = AttributeDefinition.collect(ComponentA);
                const componentBAttributes = AttributeDefinition.collect(ComponentB);

                return {
                    componentAAttributesLength: componentAAttributes.length,
                    componentBAttributesLength: componentBAttributes.length,
                };
            });

        expect(componentAAttributesLength).toBe(2);
        expect(componentBAttributesLength).toBe(1);
    });
});
