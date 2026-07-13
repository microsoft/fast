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

    // The `@attr` changed callback is not the native attributeChangedCallback. Its
    // `oldValue` is read back from the backing field (`AttributeDefinition.setValue`),
    // which the native callback never writes, so the first `oldValue` is `undefined`
    // rather than the `null` the platform passes. These tests pin that contract, and
    // the number of times the callback fires during initialization, which varies with
    // where the value comes from: a default assignment, the tag, or a pre-upgrade
    // property. They characterize the behavior FAST ships today: whether the first
    // assignment *should* fire at all is an open design question, and a change to it
    // is a breaking change to this contract, not a bug fix. See the Component
    // Lifecycle documentation.
    test.describe("@attr initialization contract", () => {
        test("passes `undefined`, not `null`, as the first oldValue", async ({
            page,
        }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                // `undefined` and `null` both cross the page boundary as `null`.
                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="tag"></${name}>`;

                return calls;
            });

            expect(calls).toEqual([["@@undefined", "tag"]]);
            expect(calls[0][0]).toBe("@@undefined");
            expect(calls[0][0]).not.toBe("@@null");
        });

        test("receives `undefined` where the native callback receives `null`, for the same mutation", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const nativeCalls: any[][] = [];
                const attrCalls: any[][] = [];

                class TestEl extends FASTElement {
                    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
                        nativeCalls.push([name, tag(oldValue), tag(newValue)]);
                        super.attributeChangedCallback(name, oldValue, newValue);
                    }

                    fooChanged(oldValue: any, newValue: any) {
                        attrCalls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const element = document.createElement(name);
                element.setAttribute("foo", "tag");

                return { nativeCalls, attrCalls };
            });

            expect(result.nativeCalls).toEqual([["foo", "@@null", "tag"]]);
            expect(result.attrCalls).toEqual([["@@undefined", "tag"]]);
        });

        test("a default value fires the changed callback once, at construction", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    foo = "default";

                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const element = document.createElement(name) as any;

                return {
                    calls,
                    isConnected: element.isConnected,
                    // The class-field default must go through the accessor, not
                    // shadow it with an own property.
                    hasOwnProperty: Object.prototype.hasOwnProperty.call(element, "foo"),
                    value: element.foo,
                };
            });

            expect(result.calls).toEqual([["@@undefined", "default"]]);
            expect(result.isConnected).toBe(false);
            expect(result.hasOwnProperty).toBe(false);
            expect(result.value).toBe("default");
        });

        test("a class field default and a constructor default fire identically", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const fieldCalls: any[][] = [];
                const constructorCalls: any[][] = [];

                class FieldEl extends FASTElement {
                    foo = "default";

                    fooChanged(oldValue: any, newValue: any) {
                        fieldCalls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                class ConstructorEl extends FASTElement {
                    constructor() {
                        super();
                        (this as any).foo = "default";
                    }

                    fooChanged(oldValue: any, newValue: any) {
                        constructorCalls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const fieldName = uniqueElementName();
                await FieldEl.define({ name: fieldName, attributes: ["foo"] });
                const constructorName = uniqueElementName();
                await ConstructorEl.define({
                    name: constructorName,
                    attributes: ["foo"],
                });

                document.createElement(fieldName);
                document.createElement(constructorName);

                return { fieldCalls, constructorCalls };
            });

            expect(result.fieldCalls).toEqual([["@@undefined", "default"]]);
            expect(result.constructorCalls).toEqual(result.fieldCalls);
        });

        test("a default value and a tag attribute fire the changed callback twice, and the tag wins", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    foo = "default";

                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="tag"></${name}>`;

                const element = host.firstElementChild as any;
                await Updates.next();

                return {
                    calls,
                    value: element.foo,
                    attribute: element.getAttribute("foo"),
                };
            });

            expect(result.calls).toEqual([
                ["@@undefined", "default"],
                ["default", "tag"],
            ]);
            expect(result.value).toBe("tag");
            expect(result.attribute).toBe("tag");
        });

        test("a declared attribute with no default and no tag attribute never fires", async ({
            page,
        }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([oldValue, newValue]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name}></${name}>`;
                await Updates.next();

                return calls;
            });

            expect(calls).toEqual([]);
        });

        test("an explicit `undefined` default never fires", async ({ page }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    foo = undefined;

                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([oldValue, newValue]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                document.createElement(name);

                return calls;
            });

            expect(calls).toEqual([]);
        });

        test("an empty string attribute fires the changed callback", async ({ page }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo=""></${name}>`;

                return calls;
            });

            expect(calls).toEqual([["@@undefined", ""]]);
        });

        test("a `false` boolean-mode default fires, and a tag attribute fires it again", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const defaultOnlyCalls: any[][] = [];
                const withTagCalls: any[][] = [];

                class DefaultOnlyEl extends FASTElement {
                    bool = false;

                    boolChanged(oldValue: any, newValue: any) {
                        defaultOnlyCalls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                class WithTagEl extends FASTElement {
                    bool = false;

                    boolChanged(oldValue: any, newValue: any) {
                        withTagCalls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const attributes = [{ property: "bool", mode: "boolean" }];
                const defaultOnlyName = uniqueElementName();
                await DefaultOnlyEl.define({ name: defaultOnlyName, attributes });
                const withTagName = uniqueElementName();
                await WithTagEl.define({ name: withTagName, attributes });

                document.createElement(defaultOnlyName);

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${withTagName} bool></${withTagName}>`;

                return { defaultOnlyCalls, withTagCalls };
            });

            expect(result.defaultOnlyCalls).toEqual([["@@undefined", false]]);
            expect(result.withTagCalls).toEqual([
                ["@@undefined", false],
                [false, true],
            ]);
        });

        test("removeAttribute in reflect mode fires the changed callback with `null`", async ({
            page,
        }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="tag"></${name}>`;
                host.firstElementChild!.removeAttribute("foo");

                return calls;
            });

            // `null` never appears as the first oldValue, but it does appear later:
            // this is exactly why `if (oldValue !== null)` guards are wrong.
            expect(calls).toEqual([
                ["@@undefined", "tag"],
                ["tag", "@@null"],
            ]);
        });

        test("removeAttribute in boolean mode fires the changed callback with `false`, never `null`", async ({
            page,
        }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    boolChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({
                    name,
                    attributes: [{ property: "bool", mode: "boolean" }],
                });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} bool></${name}>`;
                host.firstElementChild!.removeAttribute("bool");

                return calls;
            });

            // boolean mode maps the platform's `null` to `false` before setValue, so a
            // boolean-mode changed callback never sees `null` - not first, not later.
            expect(calls).toEqual([
                ["@@undefined", true],
                [true, false],
            ]);
        });

        test("setting the same value through the attribute and the property fires once", async ({
            page,
        }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const element = document.createElement(name) as any;
                element.setAttribute("foo", "same");
                element.foo = "same";

                return calls;
            });

            expect(calls).toEqual([["@@undefined", "same"]]);
        });

        test("a pre-upgrade property beats a tag attribute and reflects back over it", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="tag"></${name}>`;

                const element = host.firstElementChild as any;
                element.foo = "preupgrade";

                await TestEl.define({ name, attributes: ["foo"] });
                await Updates.next();

                return {
                    calls,
                    value: element.foo,
                    attribute: element.getAttribute("foo"),
                };
            });

            expect(result.calls).toEqual([
                ["@@undefined", "tag"],
                ["tag", "preupgrade"],
            ]);
            expect(result.value).toBe("preupgrade");
            expect(result.attribute).toBe("preupgrade");
        });

        test("a pre-upgrade property with no tag attribute fires once and is preserved", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name}></${name}>`;

                const element = host.firstElementChild as any;
                element.foo = "preupgrade";

                await TestEl.define({ name, attributes: ["foo"] });
                await Updates.next();

                return { calls, value: element.foo };
            });

            expect(result.calls).toEqual([["@@undefined", "preupgrade"]]);
            expect(result.value).toBe("preupgrade");
        });

        test("a default, a tag attribute and a pre-upgrade property fire the changed callback three times, and the property wins", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];

                class TestEl extends FASTElement {
                    foo = "default";

                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                    }
                }

                const name = uniqueElementName();

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="tag"></${name}>`;

                const element = host.firstElementChild as any;
                element.foo = "preupgrade";

                await TestEl.define({ name, attributes: ["foo"] });
                await Updates.next();

                return {
                    calls,
                    value: element.foo,
                    attribute: element.getAttribute("foo"),
                };
            });

            // Three firings, which is the case the documentation table calls out and
            // the one that surprises people. The pre-upgrade property does not shadow
            // the default: the ElementController constructor runs during `super()`,
            // and it deletes the pre-upgrade own property and stashes it before the
            // subclass's field initializer executes. So the default assignment reaches
            // the prototype accessor, the tag attribute overwrites it at upgrade, and
            // the stashed property is replayed through the accessor at connect - last
            // write wins, and it reflects back over the tag attribute.
            expect(result.calls).toEqual([
                ["@@undefined", "default"],
                ["default", "tag"],
                ["tag", "preupgrade"],
            ]);
            expect(result.value).toBe("preupgrade");
            expect(result.attribute).toBe("preupgrade");
        });

        test("the changed callback and the default value both go through the converter", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const tag = (value: any) =>
                    value === undefined
                        ? "@@undefined"
                        : value === null
                          ? "@@null"
                          : value;

                const calls: any[][] = [];
                const types: string[] = [];

                // Declared inline: the test harness does not export FAST's converters.
                const converter = {
                    toView(value: any) {
                        return value === null ? null : String(value);
                    },
                    fromView(value: any) {
                        return value === null ? null : Number(value);
                    },
                };

                class TestEl extends FASTElement {
                    // A string default, exactly as it would be authored on the tag.
                    foo = "42";

                    fooChanged(oldValue: any, newValue: any) {
                        calls.push([tag(oldValue), tag(newValue)]);
                        types.push(typeof newValue);
                    }
                }

                const name = uniqueElementName();
                await TestEl.define({
                    name,
                    attributes: [{ property: "foo", converter }],
                });

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="7"></${name}>`;

                return { calls, types, value: (host.firstElementChild as any).foo };
            });

            expect(result.calls).toEqual([
                ["@@undefined", 42],
                [42, 7],
            ]);
            expect(result.types).toEqual(["number", "number"]);
            expect(result.value).toBe(7);
        });

        test("a reflect-mode default writes the attribute on the next update", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                class TestEl extends FASTElement {
                    foo = "default";
                }

                const name = uniqueElementName();
                await TestEl.define({ name, attributes: ["foo"] });

                const element = document.createElement(name);
                const beforeUpdate = element.getAttribute("foo");
                await Updates.next();

                return { beforeUpdate, afterUpdate: element.getAttribute("foo") };
            });

            expect(result.beforeUpdate).toBe(null);
            expect(result.afterUpdate).toBe("default");
        });

        test("every initialization firing happens while `$fastController.isConnected` is false", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, Updates, uniqueElementName } = await import(
                    "/main.js"
                );

                const observed: boolean[] = [];
                const applied: string[] = [];

                class TestEl extends FASTElement {
                    foo = "default";

                    fooChanged() {
                        observed.push(this.$fastController.isConnected);

                        // The guard the documentation recommends. It drops the value
                        // rather than deferring it: FAST never re-invokes the callback.
                        if (!this.$fastController.isConnected) {
                            return;
                        }

                        applied.push(this.foo);
                    }
                }

                const name = uniqueElementName();

                const host = document.createElement("div");
                document.body.append(host);
                host.innerHTML = `<${name} foo="tag"></${name}>`;

                const element = host.firstElementChild as any;
                element.foo = "preupgrade";

                await TestEl.define({ name, attributes: ["foo"] });
                await Updates.next();

                const duringInitialization = observed.slice();
                const appliedAfterConnect = applied.slice();

                element.foo = "runtime";

                return {
                    duringInitialization,
                    appliedAfterConnect,
                    applied,
                    isConnected: element.$fastController.isConnected,
                };
            });

            // The default assignment and the tag attribute both land before `connect()`
            // runs at all, and the pre-upgrade property is replayed while the stage is
            // still `connecting`, so the guard is `false` for all three.
            expect(result.duringInitialization).toEqual([false, false, false]);
            // Which means a guarded changed callback does no work at all for the value
            // the element was initialized with - `connectedCallback` has to apply it.
            expect(result.appliedAfterConnect).toEqual([]);
            // Only mutations after connect get through the guard.
            expect(result.isConnected).toBe(true);
            expect(result.applied).toEqual(["runtime"]);
        });
    });
});
