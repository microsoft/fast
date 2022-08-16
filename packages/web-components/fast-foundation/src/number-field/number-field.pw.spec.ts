import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTNumberField } from "./number-field.js";

test.describe("NumberField", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let control: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-number-field");

        root = page.locator("#root");

        control = element.locator(".field");

        await page.goto(fixtureURL("number-field--number-field"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should initialize to the provided value attribute if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field value="10"></fast-number-field>
            `;
        });

        await expect(element).toHaveJSProperty("value", "10");
    });

    test("should set the `autofocus` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field autofocus></fast-number-field>
            `;
        });

        await expect(control).toHaveBooleanAttribute("autofocus");
    });

    test("should set the `disabled` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field disabled></fast-number-field>
            `;
        });
        await expect(control).toHaveBooleanAttribute("disabled");
    });

    test("should set the `readonly` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field readonly></fast-number-field>
            `;
        });
        await expect(control).toHaveBooleanAttribute("readonly");
    });

    test("should set the `required` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field required></fast-number-field>
            `;
        });
        await expect(control).toHaveBooleanAttribute("required");
    });

    for (const [attribute, value] of Object.entries({
        min: 0,
        max: 10,
        list: "listId",
        maxlength: 14,
        minlength: 8,
        placeholder: "placeholder",
        size: 8,
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
    })) {
        const attrToken = spinalCase(attribute);

        test(`should set the \`${attrToken}\` attribute to "${value}" on the internal control`, async () => {
            await root.evaluate(
                (node, { attrToken, value }) => {
                    node.innerHTML = /* html */ `
                        <fast-number-field ${attrToken}="${value}"></fast-number-field>
                    `;
                },
                { attrToken, value }
            );

            await expect(control).toHaveAttribute(attrToken, `${value}`);
        });
    }

    test("should set `value` property equal to the `max` property when value is greater than max", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field max="10"></fast-number-field>
            `;
        });

        await control.fill("11");

        await expect(element).toHaveJSProperty("value", "10");
    });

    test("should set `value` property equal to the `max` property when max is less than the value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field value="20"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.max = 10;
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await expect(element).toHaveJSProperty("value", "10");
    });

    test("should set the `value` property equal to the `min` property when value is less than min", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="10"></fast-number-field>
            `;
        });

        await control.fill("9");

        await expect(element).toHaveJSProperty("value", "10");

        await expect(control).toHaveValue("10");
    });

    test("should update the `value` property when the `min` property is greater than the `value`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field value="10"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.min = 20;
        });

        await expect(element).toHaveJSProperty("value", "20");

        await expect(control).toHaveValue("20");
    });

    test("should set the `max` property equal to the `min` property when min is greater than max", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="10" max="5"></fast-number-field>
            `;
        });

        await expect(element).toHaveJSProperty("max", 10);

        await expect(control).toHaveJSProperty("max", "10");
    });

    test("should initialize to the provided `value` attribute if set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.value = "10";
        });

        await expect(element).toHaveJSProperty("value", "10");
    });

    test('should fire a "change" event when the internal control emits a "change" event', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

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

    test('should fire an "input" event when incrementing or decrementing', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

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

    test("should allow positive float numbers", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await control.fill("1.1");

        await expect(element).toHaveJSProperty("value", "1.1");

        await expect(control).toHaveValue("1.1");
    });

    test("should allow negative float numbers", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await control.fill("-1.1");

        await expect(element).toHaveJSProperty("value", "-1.1");

        await expect(control).toHaveValue("-1.1");
    });

    test("should allow positive integer numbers", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await control.fill("1");

        await expect(element).toHaveJSProperty("value", "1");

        await expect(control).toHaveValue("1");
    });

    test("should allow negative integer numbers", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await control.fill("-1");

        await expect(element).toHaveJSProperty("value", "-1");

        await expect(control).toHaveValue("-1");
    });

    // TODO: This test doesn't account for the `e` character.
    // See https://github.com/microsoft/fast/issues/6251
    test("should disallow non-numeric characters", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await control.fill("a");

        await expect(element).toHaveJSProperty("value", "");

        await expect(control).toHaveValue("");
    });

    test('should set the `step` property to "1" by default', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await expect(control).toHaveAttribute("step", "1");
    });

    test("should update the `step` attribute on the internal control when the `step` property is changed", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.step = 2;
        });

        await expect(control).toHaveAttribute("step", "2");
    });

    test("should increment the `value` property by the step amount when the `stepUp()` method is invoked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field step="2" value="5"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepUp();
        });

        await expect(element).toHaveJSProperty("value", "7");

        await expect(control).toHaveValue("7");
    });

    test("should decrement the `value` property by the step amount when the `stepDown()` method is invoked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field step="2" value="5"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepDown();
        });

        await expect(element).toHaveJSProperty("value", "3");

        await expect(control).toHaveValue("3");
    });

    test("should offset an undefined `value` from zero when stepped down", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field step="2"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepDown();
        });

        await expect(element).toHaveJSProperty("value", "-2");

        await expect(control).toHaveValue("-2");
    });

    test("should offset an undefined `value` from zero when stepped up", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field step="2"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepUp();
        });

        await expect(element).toHaveJSProperty("value", "2");

        await expect(control).toHaveValue("2");
    });

    test("should offset the `value` from zero after stepping down when `min` is a negative value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="-10"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepDown();
        });

        await expect(element).toHaveJSProperty("value", "0");

        await expect(control).toHaveValue("0");
    });

    test("should offset the `value` from zero after stepping up when `min` is a negative value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="-10"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepUp();
        });

        await expect(element).toHaveJSProperty("value", "0");

        await expect(control).toHaveValue("0");
    });

    test("should set `value` to match `min` after stepping down when `min` is greater than 0", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="10"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepDown();
        });

        await expect(element).toHaveJSProperty("value", "10");

        await expect(control).toHaveValue("10");
    });

    test("should set `value` to match `min` after stepping up when `min` is greater than 0", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="10"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepUp();
        });

        await expect(element).toHaveJSProperty("value", "10");

        await expect(control).toHaveValue("10");
    });

    test("should set the `value` to match `max` after stepping down when `value` is undefined and `min` and `max` are less than zero", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="-10" max="-5"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepDown();
        });

        await expect(element).toHaveJSProperty("value", "-5");

        await expect(control).toHaveValue("-5");
    });

    test("should set the `value` to match `max` after stepping up when `value` is undefined and `min` and `max` are less than zero", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field min="-10" max="-5"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepUp();
        });

        await expect(element).toHaveJSProperty("value", "-5");

        await expect(control).toHaveValue("-5");
    });

    test("should update the proxy value when stepping down", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field step="2" value="5"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepDown();
        });

        await expect(control).toHaveValue("3");

        await expect(element).toHaveJSProperty("value", "3");

        expect(await element.evaluate((node: FASTNumberField) => node.proxy.value)).toBe(
            "3"
        );
    });

    test("should update the proxy value when stepping up", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field step="2" value="5"></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.stepUp();
        });

        await expect(control).toHaveValue("7");

        await expect(element).toHaveJSProperty("value", "7");

        expect(await element.evaluate((node: FASTNumberField) => node.proxy.value)).toBe(
            "7"
        );
    });

    test("should correct rounding errors when stepping down", async () => {
        const step = 0.1;
        const value = 0.2;

        await root.evaluate(
            (node, { step, value }) => {
                node.innerHTML = /* html */ `
                    <fast-number-field step="${step}" value="${value}"></fast-number-field>
                `;
            },
            { step, value }
        );

        for (let i = 1; i < 10; i++) {
            await element.evaluate((node: FASTNumberField) => {
                node.stepUp();
            });

            await expect(control).toHaveValue(
                (value + step * i).toPrecision(2).replace(/\.?0+$/, "")
            );
        }
    });

    test("should not render step controls when `hide-step` attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field hide-step></fast-number-field>
            `;
        });

        const controls = element.locator(".controls");

        await expect(controls).toBeHidden();
    });

    test("should not render step controls when `readonly` attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field readonly></fast-number-field>
            `;
        });

        const controls = element.locator(".controls");

        await expect(controls).toHaveCount(0);
    });

    test("should allow setting `valueAsNumber` property with a number", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field></fast-number-field>
            `;
        });

        await element.evaluate((node: FASTNumberField) => {
            node.valueAsNumber = 18;
        });

        await expect(element).toHaveJSProperty("value", "18");
    });

    test("should allow reading the `valueAsNumber` property as number", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-number-field value="18"></fast-number-field>
            `;
        });

        await expect(element).toHaveJSProperty("valueAsNumber", 18);
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test('should reset its `value` property to "" if no `value` attribute is set', async () => {
            const form = page.locator("form");

            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-number-field></fast-number-field>
                    </form>
                `;
            });

            await element.evaluate((node: FASTNumberField) => {
                node.value = "10";
            });

            await expect(element).toHaveJSProperty("value", "10");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "");
        });

        test("should reset the `value` property to match the `value` attribute", async () => {
            const form = page.locator("form");

            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-number-field value="10"></fast-number-field>
                    </form>
                `;
            });

            await expect(element).toHaveJSProperty("value", "10");

            await element.evaluate((node: FASTNumberField) => {
                node.value = "20";
            });

            await expect(element).toHaveJSProperty("value", "20");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "10");
        });

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async () => {
            const form = page.locator("form");

            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-number-field value="10"></fast-number-field>
                    </form>
                `;
            });

            await expect(element).toHaveJSProperty("value", "10");

            await element.evaluate((node: FASTNumberField) => {
                node.value = "20";
            });

            await expect(element).toHaveJSProperty("value", "20");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "10");

            await element.evaluate(node => {
                node.setAttribute("value", "30");
            });

            await expect(element).toHaveJSProperty("value", "30");
        });
    });
});
