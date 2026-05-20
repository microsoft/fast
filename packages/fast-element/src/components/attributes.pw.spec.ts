import { expect, test } from "@playwright/test";
import { booleanConverter } from "./attributes.js";

const FALSE_CASES: Array<{ label: string; value: unknown }> = [
    { label: "null", value: null },
    { label: "undefined", value: undefined },
    { label: "false", value: false },
    { label: "0", value: 0 },
    { label: '""', value: "" },
    { label: "NaN", value: NaN },
];

const TRUE_CASES: Array<{ label: string; value: unknown }> = [
    { label: "true", value: true },
    { label: "1", value: 1 },
    { label: '"false"', value: "false" },
    { label: '"true"', value: "true" },
    { label: '"0"', value: "0" },
    { label: '"anything"', value: "anything" },
];

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

    test.describe("booleanConverter", () => {
        test.describe("fromView()", () => {
            for (const { label, value } of FALSE_CASES) {
                test(`returns false for ${label}`, () => {
                    expect(booleanConverter.fromView(value)).toBe(false);
                });
            }

            for (const { label, value } of TRUE_CASES) {
                test(`returns true for ${label}`, () => {
                    expect(booleanConverter.fromView(value)).toBe(true);
                });
            }
        });

        test.describe("attribute → property reflection (parity with native <button disabled>)", () => {
            // Attribute values are always strings. Each case is applied via setAttribute
            // on both a FAST custom element with `boolean`-mode `bool` and a native <button>
            // with `disabled`; both elements must report the same property value.
            const ATTRIBUTE_CASES: Array<{
                label: string;
                attrValue: string;
                expectedProperty: boolean;
            }> = [
                {
                    label: 'string "false"',
                    attrValue: "false",
                    expectedProperty: true,
                },
                { label: 'string "true"', attrValue: "true", expectedProperty: true },
                { label: 'string "0"', attrValue: "0", expectedProperty: true },
                {
                    label: 'arbitrary string "anything"',
                    attrValue: "anything",
                    expectedProperty: true,
                },
                { label: 'empty string ""', attrValue: "", expectedProperty: true },
            ];

            for (const { label, attrValue, expectedProperty } of ATTRIBUTE_CASES) {
                test(`setAttribute(${label}) sets the property to ${expectedProperty} (matches native)`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async attrValue => {
                        // @ts-expect-error: Client module.
                        const { FASTElement, uniqueElementName } = await import(
                            "/main.js"
                        );

                        class TestEl extends FASTElement {}

                        const name = uniqueElementName();
                        await TestEl.define({
                            name,
                            attributes: [{ property: "bool", mode: "boolean" }],
                        });

                        const fast = document.createElement(name) as any;
                        fast.setAttribute("bool", attrValue);

                        const native = document.createElement("button") as any;
                        native.setAttribute("disabled", attrValue);

                        return {
                            fastProperty: fast.bool,
                            nativeProperty: native.disabled,
                        };
                    }, attrValue);

                    expect(result.nativeProperty).toBe(expectedProperty);
                    expect(result.fastProperty).toBe(result.nativeProperty);
                });
            }

            test("removeAttribute() after the attribute was present sets the property to false (matches native)", async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElement, uniqueElementName } = await import("/main.js");

                    class TestEl extends FASTElement {}

                    const name = uniqueElementName();
                    await TestEl.define({
                        name,
                        attributes: [{ property: "bool", mode: "boolean" }],
                    });

                    const fast = document.createElement(name) as any;
                    fast.setAttribute("bool", "true");
                    const fastBefore = fast.bool;
                    fast.removeAttribute("bool");
                    const fastAfter = fast.bool;

                    const native = document.createElement("button") as any;
                    native.setAttribute("disabled", "true");
                    const nativeBefore = native.disabled;
                    native.removeAttribute("disabled");
                    const nativeAfter = native.disabled;

                    return { fastBefore, fastAfter, nativeBefore, nativeAfter };
                });

                expect(result.nativeBefore).toBe(true);
                expect(result.nativeAfter).toBe(false);
                expect(result.fastBefore).toBe(result.nativeBefore);
                expect(result.fastAfter).toBe(result.nativeAfter);
            });

            test('setAttribute("false") preserves the literal attribute value while the property is true (matches native)', async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElement, Updates, uniqueElementName } = await import(
                        "/main.js"
                    );

                    class TestEl extends FASTElement {}

                    const name = uniqueElementName();
                    await TestEl.define({
                        name,
                        attributes: [{ property: "bool", mode: "boolean" }],
                    });

                    const fast = document.createElement(name) as any;
                    fast.setAttribute("bool", "false");
                    // Allow one update cycle to confirm no reflection-back occurs.
                    await Updates.next();

                    const native = document.createElement("button") as any;
                    native.setAttribute("disabled", "false");

                    return {
                        fastProperty: fast.bool,
                        fastAttribute: fast.getAttribute("bool"),
                        nativeProperty: native.disabled,
                        nativeAttribute: native.getAttribute("disabled"),
                    };
                });

                expect(result.nativeProperty).toBe(true);
                expect(result.nativeAttribute).toBe("false");
                expect(result.fastProperty).toBe(result.nativeProperty);
                expect(result.fastAttribute).toBe(result.nativeAttribute);
            });
        });

        test.describe("property → attribute reflection (parity with native <button disabled>)", () => {
            for (const { label, value } of FALSE_CASES) {
                test(`setting the property to ${label} removes the attribute (matches native)`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async value => {
                        // @ts-expect-error: Client module.
                        const { FASTElement, Updates, uniqueElementName } = await import(
                            "/main.js"
                        );

                        class TestEl extends FASTElement {}

                        const name = uniqueElementName();
                        await TestEl.define({
                            name,
                            attributes: [{ property: "bool", mode: "boolean" }],
                        });

                        // Pre-seed both to a truthy state so the falsy assignment
                        // must explicitly remove the attribute.
                        const fast = document.createElement(name) as any;
                        fast.bool = true;
                        await Updates.next();
                        const fastSeededHas = fast.hasAttribute("bool");

                        const native = document.createElement("button") as any;
                        native.disabled = true;
                        const nativeSeededHas = native.hasAttribute("disabled");

                        fast.bool = value;
                        await Updates.next();
                        native.disabled = value;

                        return {
                            fastSeededHas,
                            fastHas: fast.hasAttribute("bool"),
                            nativeSeededHas,
                            nativeHas: native.hasAttribute("disabled"),
                        };
                    }, value);

                    expect(result.nativeSeededHas).toBe(true);
                    expect(result.nativeHas).toBe(false);
                    expect(result.fastSeededHas).toBe(result.nativeSeededHas);
                    expect(result.fastHas).toBe(result.nativeHas);
                });
            }

            for (const { label, value } of TRUE_CASES) {
                test(`setting the property to ${label} adds the attribute with value "" (matches native)`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async value => {
                        // @ts-expect-error: Client module.
                        const { FASTElement, Updates, uniqueElementName } = await import(
                            "/main.js"
                        );

                        class TestEl extends FASTElement {}

                        const name = uniqueElementName();
                        await TestEl.define({
                            name,
                            attributes: [{ property: "bool", mode: "boolean" }],
                        });

                        const fast = document.createElement(name) as any;
                        fast.bool = value;
                        await Updates.next();

                        const native = document.createElement("button") as any;
                        native.disabled = value;

                        return {
                            fastHas: fast.hasAttribute("bool"),
                            fastAttr: fast.getAttribute("bool"),
                            nativeHas: native.hasAttribute("disabled"),
                            nativeAttr: native.getAttribute("disabled"),
                        };
                    }, value);

                    expect(result.nativeHas).toBe(true);
                    expect(result.nativeAttr).toBe("");
                    expect(result.fastHas).toBe(result.nativeHas);
                    expect(result.fastAttr).toBe(result.nativeAttr);
                });
            }
        });
    });
});
