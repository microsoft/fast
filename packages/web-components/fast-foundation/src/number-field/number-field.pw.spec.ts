import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTNumberField } from "./number-field.js";

test.describe("NumberField", () => {
    test.describe("should set the boolean attribute on the internal control", () => {
        Object.entries({
            autofocus: "true",
            disabled: "true",
            readOnly: "true",
            required: "true",
        }).forEach(([key, value]) => {
            test(`${key}`, async ({ page }) => {
                await page.goto(
                    fixtureURL("number-field--number-field", { [key]: value })
                );

                const element = page.locator("fast-number-field");

                const control = element.locator(".control");

                expect(
                    await control.evaluate((node, key) => node.hasAttribute(key), key)
                ).toBeTruthy();
            });
        });
    });

    test.describe("should set the ARIA attribute on the internal control", () => {
        Object.entries({
            ariaAtomic: "true",
            ariaBusy: "false",
            ariaControls: "testId",
            ariaCurrent: "page",
            ariaDescribedby: "testId",
            ariaDetails: "testId",
            ariaDisabled: "true",
            ariaErrormessage: "test",
            ariaFlowto: "testId",
            ariaHaspopup: "true",
            ariaHidden: "true",
            ariaInvalid: "spelling",
            ariaKeyshortcuts: "F4",
            ariaLabel: "Foo label",
            ariaLabelledby: "testId",
            ariaLive: "polite",
            ariaOwns: "testId",
            ariaRelevant: "removals",
            ariaRoledescription: "slide",
        }).forEach(([key, value]) => {
            test(key, async ({ page }) => {
                await page.goto(
                    fixtureURL("number-field--number-field", { [key]: value })
                );

                await expect(page.locator("fast-number-field .control")).toHaveAttribute(
                    spinalCase(key),
                    `${value}`
                );
            });
        });
    });

    test.describe("should set the attribute on the internal control", () => {
        Object.entries({
            list: "listId",
            maxlength: 14,
            minlength: 8,
            placeholder: "placeholder",
            size: 8,
        }).forEach(([key, value]) => {
            test(key, async ({ page }) => {
                await page.goto(
                    fixtureURL("number-field--number-field", { [key]: value })
                );

                await expect(page.locator("fast-number-field .control")).toHaveAttribute(
                    key,
                    `${value}`
                );
            });
        });
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("number-field--number-field"));

        const element = page.locator("fast-number-field");

        const { value, initialValue } = await element.evaluate(
            ({ value, initialValue }: FASTNumberField) => ({
                value,
                initialValue,
            })
        );

        expect(value).toMatch(initialValue);
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        const value = "10";

        await page.goto(fixtureURL("number-field--number-field", { value }));

        await expect(page.locator("fast-number-field")).toHaveJSProperty("value", value);
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        const value = "10";
        await page.goto(fixtureURL("number-field--number-field"));

        const element = page.locator("fast-number-field");

        await element.evaluate((node, value) => node.setAttribute("value", value), value);

        await expect(element).toHaveJSProperty("value", value);
    });

    test.describe("events", () => {
        test("should fire a change event when the internal control emits a change event", async ({
            page,
        }) => {
            await page.goto(fixtureURL("number-field--number-field"));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            const [wasChanged] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("change", () => resolve(true));
                        })
                ),

                // FIXME: Playwright's keyboard API is not working as expected.
                control.evaluate(node =>
                    node.dispatchEvent(new KeyboardEvent("change", { key: "1" }))
                ),
            ]);

            expect(wasChanged).toBeTruthy();
        });

        test("should fire an input event when incrementing or decrementing", async ({
            page,
        }) => {
            await page.goto(fixtureURL("number-field--number-field"));

            const element = page.locator("fast-number-field");

            // const control = element.locator(".control");

            const [wasIncreased] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("input", () => resolve(true), {
                                once: true,
                            });
                        })
                ),
                element.evaluate((node: FASTNumberField) => node.stepUp()),
            ]);

            expect(wasIncreased).toBeTruthy();

            const [wasDecreased] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("input", () => resolve(true), {
                                once: true,
                            });
                        })
                ),
                element.evaluate((node: FASTNumberField) => node.stepDown()),
            ]);

            expect(wasDecreased).toBeTruthy();
        });
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test('should reset its `value` property to "" if no `value` attribute is set', async ({
            page,
        }) => {
            await page.goto(fixtureURL("number-field--number-field-in-form"));

            const element = page.locator("fast-number-field");

            const form = page.locator("form");

            await element.evaluate((node: FASTNumberField) => {
                node.value = "10";
            });

            await expect(element).toHaveJSProperty("value", "10");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "");
        });

        test("should reset it's value property to the value of the value attribute if it is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("number-field--number-field-in-form", { value: 20 })
            );

            const element = page.locator("fast-number-field");

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "20");

            await element.evaluate((node: FASTNumberField) => {
                node.value = "10";
            });

            await expect(element).toHaveJSProperty("value", "10");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "20");
        });

        test("should update input field when script sets value", async ({ page }) => {
            await page.goto(fixtureURL("number-field--number-field"));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveValue("");

            await element.evaluate(node => {
                node.setAttribute("value", "10");
            });

            await expect(control).toHaveValue("10");
        });

        test("should put the control into a clean state, where value attribute changes the property value prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("number-field--number-field-in-form", { value: 10 })
            );

            const element = page.locator("fast-number-field");

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "10");

            await element.evaluate((node: FASTNumberField) => {
                node.value = "20";
            });

            await expect(element).toHaveJSProperty("value", "20");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "10");

            await element.evaluate(node => node.setAttribute("value", "30"));

            await expect(element).toHaveJSProperty("value", "30");
        });
    });

    test.describe("min and max values", () => {
        test("should set min value", async ({ page }) => {
            const min = 1;
            await page.goto(fixtureURL("number-field--number-field", { min }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("min", min.toString());

            await expect(element).toHaveJSProperty("min", min);
        });

        test("should set max value", async ({ page }) => {
            const max = 10;
            await page.goto(fixtureURL("number-field--number-field", { max }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("max", max.toString());

            await expect(element).toHaveJSProperty("max", max);
        });

        test("should set value to max when value is greater than max", async ({
            page,
        }) => {
            const max = "10";
            const value = "20";
            await page.goto(fixtureURL("number-field--number-field", { max, value }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveValue(max);

            await expect(element).toHaveJSProperty("value", max);
        });

        test("should set value to max if the max changes to a value less than the value", async ({
            page,
        }) => {
            const max = "10";
            const value = "20";
            await page.goto(fixtureURL("number-field--number-field", { value }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveValue(value);

            await element.evaluate((node: FASTNumberField) => {
                node.max = 10;
            });

            await expect(control).toHaveValue(max);

            await expect(element).toHaveJSProperty("value", max);
        });

        test("should set value to min when value is less than min", async ({ page }) => {
            const min = "10";
            const value = "5";
            await page.goto(fixtureURL("number-field--number-field", { value }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveValue(value);

            await element.evaluate((node: FASTNumberField) => {
                node.min = 10;
            });

            await expect(control).toHaveValue(min);

            await expect(element).toHaveJSProperty("value", min);
        });

        test("should update the `value` property when the `min` property is greater than the `value`", async ({
            page,
        }) => {
            const min = "20";
            const value = "10";
            await page.goto(fixtureURL("number-field--number-field", { value }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await element.evaluate((node: FASTNumberField) => {
                node.min = 20;
            });

            await expect(control).toHaveValue(min);

            await expect(element).toHaveJSProperty("value", min);
        });

        test("should set the `max` property to `min` when `min` is greater than `max`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("number-field--number-field", { min: 10, max: 1 })
            );

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("max", "1");
        });
    });

    test.describe("step and increment/decrement", () => {
        test("should set step to a default of 1", async ({ page }) => {
            await page.goto(fixtureURL("number-field--number-field"));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("step", "1");
        });

        test("should update the internal control `step` attribute when `step` is changed", async ({
            page,
        }) => {
            await page.goto(fixtureURL("number-field--number-field"));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await element.evaluate((node: FASTNumberField) => {
                node.step = 2;
            });

            await expect(control).toHaveAttribute("step", "2");
        });

        test("should increment the `value` by the step amount", async ({ page }) => {
            await page.goto(
                fixtureURL("number-field--number-field", { step: 2, value: 5 })
            );

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await element.evaluate((node: FASTNumberField) => {
                node.stepUp();
            });

            await expect(control).toHaveValue("7");
        });

        test("should decrement the value by the step amount", async ({ page }) => {
            await page.goto(
                fixtureURL("number-field--number-field", { step: 2, value: 5 })
            );

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            await element.evaluate((node: FASTNumberField) => {
                node.stepDown();
            });

            await expect(control).toHaveValue("3");
        });

        test.describe("should offset an undefined `value` from zero", () => {
            test("when stepped down", async ({ page }) => {
                await page.goto(fixtureURL("number-field--number-field", { step: 2 }));

                const element = page.locator("fast-number-field");

                const control = element.locator(".control");

                await element.evaluate((node: FASTNumberField) => {
                    node.stepDown();
                });

                await expect(control).toHaveValue("-2");
            });

            test("when stepped up", async ({ page }) => {
                await page.goto(fixtureURL("number-field--number-field", { step: 2 }));

                const element = page.locator("fast-number-field");

                const control = element.locator(".control");

                await element.evaluate((node: FASTNumberField) => {
                    node.stepUp();
                });

                await expect(control).toHaveValue("2");
            });
        });

        test.describe(
            "should offset the `value` from zero when `min` is a negative value",
            () => {
                test("when stepped down", async ({ page }) => {
                    await page.goto(
                        fixtureURL("number-field--number-field", { min: -10 })
                    );

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.evaluate((node: FASTNumberField) => {
                        node.stepDown();
                    });

                    await expect(control).toHaveValue("0");
                });

                test("when stepped up", async ({ page }) => {
                    await page.goto(
                        fixtureURL("number-field--number-field", { min: -10 })
                    );

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.evaluate((node: FASTNumberField) => {
                        node.stepUp();
                    });

                    await expect(control).toHaveValue("0");
                });
            }
        );

        test.describe(
            "should set `value` to match `min` when `min` is greater than zero and `value` is undefined",
            () => {
                test("when stepped down", async ({ page }) => {
                    await page.goto(
                        fixtureURL("number-field--number-field", { min: 10 })
                    );

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.evaluate((node: FASTNumberField) => {
                        node.stepDown();
                    });

                    await expect(control).toHaveValue("10");
                });

                test("`stepUp()`", async ({ page }) => {
                    await page.goto(
                        fixtureURL("number-field--number-field", { min: 10 })
                    );

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.evaluate((node: FASTNumberField) => {
                        node.stepDown();
                    });

                    await expect(control).toHaveValue("10");
                });
            }
        );

        test.describe(
            "should set the `value` to `max` when `value` is undefined and `min` and `max` are less than zero",
            () => {
                test("when stepped down", async ({ page }) => {
                    await page.goto(
                        fixtureURL("number-field--number-field", { min: -100, max: -10 })
                    );

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.evaluate((node: FASTNumberField) => {
                        node.stepDown();
                    });

                    await expect(control).toHaveValue("-10");
                });

                test("when stepped up", async ({ page }) => {
                    await page.goto(
                        fixtureURL("number-field--number-field", { min: -100, max: -10 })
                    );

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.evaluate((node: FASTNumberField) => {
                        node.stepUp();
                    });

                    await expect(control).toHaveValue("-10");
                });
            }
        );

        test.describe("should update the proxy value", () => {
            test("when stepping down", async ({ page }) => {
                await page.goto(
                    fixtureURL("number-field--number-field", { step: 2, value: 5 })
                );

                const element = page.locator("fast-number-field");

                const control = element.locator(".control");

                await element.evaluate((node: FASTNumberField) => {
                    node.stepDown();
                });

                await expect(control).toHaveValue("3");

                expect(
                    await element.evaluate((node: FASTNumberField) => node.proxy.value)
                ).toBe("3");
            });

            test("when stepping up", async ({ page }) => {
                await page.goto(
                    fixtureURL("number-field--number-field", { step: 2, value: 5 })
                );

                const element = page.locator("fast-number-field");

                const control = element.locator(".control");

                await element.evaluate((node: FASTNumberField) => {
                    node.stepUp();
                });

                await expect(control).toHaveValue("7");

                expect(
                    await element.evaluate((node: FASTNumberField) => node.proxy.value)
                ).toBe("7");
            });
        });

        test("should correct rounding errors", async ({ page }) => {
            const step = 0.1;
            const value = 0.2;

            await page.goto(fixtureURL("number-field--number-field", { step, value }));

            const element = page.locator("fast-number-field");

            const control = element.locator(".control");

            for (let i = 1; i < 10; i++) {
                await element.evaluate((node: FASTNumberField) => {
                    node.stepUp();
                });

                await expect(control).toHaveValue(
                    (value + step * i).toPrecision(2).replace(/\.?0+$/, "")
                );
            }
        });
    });

    test.describe("value entry", () => {
        test.describe("should handle number entry", () => {
            const tests = [
                {
                    title: "allow positive float numbers",
                    value: "18.2",
                    expected: "18.2",
                },
                {
                    title: "allow negative float numbers",
                    value: "-18.2",
                    expected: "-18.2",
                },
                {
                    title: "allow positive integer numbers",
                    value: "18",
                    expected: "18",
                },
                {
                    title: "allow negative integer numbers",
                    value: "-18",
                    expected: "-18",
                },
                {
                    // TODO: This test doesn't account for the `e` character.
                    // See https://github.com/microsoft/fast/issues/6251
                    title: "disallow non-numeric characters",
                    value: "18abcdfg",
                    expected: "18",
                },
            ];

            tests.forEach(({ title, value, expected }) => {
                test(title, async ({ page }) => {
                    await page.goto(fixtureURL("number-field--number-field"));

                    const element = page.locator("fast-number-field");

                    const control = element.locator(".control");

                    await element.type(value);

                    await expect(element).toHaveJSProperty("value", expected);

                    await expect(control).toHaveValue(expected);
                });
            });
        });
    });

    test("should not render step controls when `hide-step` attribute is present", async ({
        page,
    }) => {
        await page.goto(fixtureURL("number-field--number-field", { hideStep: true }));

        const element = page.locator("fast-number-field");

        const controls = element.locator(".controls");

        await expect(controls).toBeHidden();
    });

    test("should not render step controls when `readonly` attribute is present", async ({
        page,
    }) => {
        await page.goto(fixtureURL("number-field--number-field", { readonly: true }));

        const element = page.locator("fast-number-field");

        const controls = element.locator(".controls");

        await expect(controls).toBeEmpty();
    });

    test("should allow setting `value` with a number", async ({ page }) => {
        const valueAsNumber = 18;

        await page.goto(fixtureURL("number-field--number-field"));

        const element = page.locator("fast-number-field");

        await element.evaluate((node: FASTNumberField, valueAsNumber) => {
            node.valueAsNumber = valueAsNumber;
        }, valueAsNumber);

        await expect(element).toHaveJSProperty("value", `${valueAsNumber}`);
    });

    test("should allow reading value as number", async ({ page }) => {
        const value = 18;

        await page.goto(fixtureURL("number-field--number-field", { value }));

        const element = page.locator("fast-number-field");

        await expect(element).toHaveJSProperty("valueAsNumber", value);
    });
});
