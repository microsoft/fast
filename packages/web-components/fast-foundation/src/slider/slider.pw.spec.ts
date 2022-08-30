import { Direction, Orientation } from "@microsoft/fast-web-utilities";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSlider } from "./slider.js";

// TODO: Need to add tests for keyboard handling, position, and focus management
test.describe("Slider", () => {
    test.describe("States, attributes, and classes", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            await page.goto(fixtureURL("slider--slider"));

            element = page.locator("fast-slider");
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should have a role of `slider`", async () => {
            await expect(element).toHaveAttribute("role", "slider");
        });

        test("should set a default `min` property of 0 when `min` is not provided", async () => {
            await expect(element).toHaveJSProperty("min", 0);
        });

        test("should set a default `max` property of 0 when `max` is not provided", async () => {
            await expect(element).toHaveAttribute("max", "10");
        });

        test("should set a `tabindex` of 0", async () => {
            await expect(element).toHaveAttribute("tabindex", "0");
        });

        test("should NOT set a default `aria-disabled` value when `disabled` is not defined", async () => {
            expect(await element.getAttribute("aria-disabled")).toBe(null);
        });

        test("should set a default `aria-orientation` value when `orientation` is not defined", async () => {
            await expect(element).toHaveAttribute(
                "aria-orientation",
                `${Orientation.horizontal}`
            );
        });

        test("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
            expect(await element.getAttribute("aria-readonly")).toBe(null);
        });

        test("should initialize to the initial value if no value property is set", async () => {
            const initialValue = await element.evaluate<string, FASTSlider>(
                node => node.initialValue
            );

            await expect(element).toHaveJSProperty("value", initialValue);
        });

        test("should set the `aria-disabled` attribute when `disabled` value is true", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.disabled = true;
            });

            await expect(element).toHaveAttribute("aria-disabled", "true");
        });

        test("should NOT set a tabindex when `disabled` value is true", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.disabled = true;
            });

            await expect(element).not.hasAttribute("tabindex");
        });

        test("should set the `aria-readonly` attribute when `readonly` value is true", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.readOnly = true;
            });

            await expect(element).toHaveAttribute("aria-readonly", "true");
        });

        test("should add a class of `readonly` when readonly is true", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.readOnly = true;
            });

            await expect(element).toHaveClass(/readonly/);
        });

        test("should set the `aria-orientation` attribute equal to the `orientation` value", async () => {
            await element.evaluate((node: FASTSlider, Orientation) => {
                node.orientation = Orientation.horizontal;
            }, Orientation);

            await expect(element).toHaveAttribute(
                "aria-orientation",
                Orientation.horizontal
            );

            await element.evaluate((node: FASTSlider, Orientation) => {
                node.orientation = Orientation.vertical;
            }, Orientation);

            await expect(element).toHaveAttribute(
                "aria-orientation",
                Orientation.vertical
            );
        });

        test("should add a class equal to the `orientation` value", async () => {
            await element.evaluate((node: FASTSlider, Orientation) => {
                node.orientation = Orientation.horizontal;
            }, Orientation);

            await expect(element).toHaveClass(new RegExp(Orientation.horizontal));

            await element.evaluate((node: FASTSlider, Orientation) => {
                node.orientation = Orientation.vertical;
            }, Orientation);

            await expect(element).toHaveClass(new RegExp(Orientation.vertical));
        });

        test("should set direction equal to the `direction` value", async () => {
            await element.evaluate((node: FASTSlider, Direction) => {
                node.direction = Direction.ltr;
            }, Direction);

            await expect(element).toHaveJSProperty("direction", Direction.ltr);

            await element.evaluate((node: FASTSlider, Direction) => {
                node.direction = Direction.rtl;
            }, Direction);

            await expect(element).toHaveJSProperty("direction", Direction.rtl);
        });

        test("should set the `aria-valuenow` attribute with the `value` property when provided", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.value = "8";
            });

            await expect(element).toHaveAttribute("aria-valuenow", "8");
        });

        test("should set the `aria-valuemin` attribute with the `min` property when provided", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.min = 0;
            });

            await expect(element).toHaveAttribute("aria-valuemin", "0");
        });

        test("should set the `aria-valuemax` attribute with the `max` property when provided", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.max = 75;
            });

            await expect(element).toHaveAttribute("aria-valuemax", "75");
        });

        test.describe("valueAsNumber", () => {
            test("should allow setting value with number", async () => {
                await element.evaluate<void, FASTSlider>(node => {
                    node.valueAsNumber = 8;
                });

                await expect(element).toHaveJSProperty("value", "8");
            });

            test("should allow reading value as number", async () => {
                await element.evaluate<void, FASTSlider>(node => {
                    node.value = "8";
                });

                await expect(element).toHaveJSProperty("valueAsNumber", 8);
            });
        });

        test("should set an `aria-valuestring` attribute with the result of the valueTextFormatter() method", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.valueTextFormatter = () => "Seventy Five Years";
            });

            await expect(element).toHaveAttribute("aria-valuetext", "Seventy Five Years");
        });
    });

    test.describe("increment and decrement methods", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-slider");

            await page.goto(
                fixtureURL("slider--slider", { min: 0, max: 100, value: "50", step: 5 })
            );
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should increment the value when the `increment()` method is invoked", async () => {
            await expect(element).toHaveAttribute("aria-valuenow", "50");

            await element.evaluate<void, FASTSlider>(node => {
                node.increment();
            });

            await expect(element).toHaveJSProperty("value", "55");

            await expect(element).toHaveAttribute("aria-valuenow", "55");
        });

        test("should decrement the value when the `decrement()` method is invoked", async () => {
            await element.evaluate<void, FASTSlider>(node => {
                node.value = "50";
            });

            await expect(element).toHaveAttribute("aria-valuenow", "50");

            await element.evaluate<void, FASTSlider>(node => {
                node.decrement();
            });

            await expect(element).toHaveJSProperty("value", "45");

            await expect(element).toHaveAttribute("aria-valuenow", "45");
        });
    });

    test("should constrain and normalize the value between `min` and `max` when the value is out of range", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider--slider", { min: 0, max: 10 }));

        const element = page.locator("fast-slider");

        await element.evaluate<void, FASTSlider>(node => {
            node.value = "15";
        });

        await expect(element).toHaveJSProperty("value", "10");

        await expect(element).toHaveAttribute("aria-valuenow", "10");

        await element.evaluate<void, FASTSlider>(node => {
            node.value = "-5";
        });

        await expect(element).toHaveJSProperty("value", "0");
    });

    test("should constrain and normalize the value when the `step` attribute has been provided and is a float", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider--slider", { step: 0.1 }));

        const element = page.locator("fast-slider");

        const elementBoundingBox = await element.boundingBox();

        const width = elementBoundingBox!.width;

        const halfWidth = width / 4;

        expect(
            await element.evaluate(
                (node: FASTSlider, halfWidth) => node.calculateNewValue(halfWidth),
                halfWidth
            )
        ).toBeCloseTo(2.5, 1);
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider--slider", { value: 3 }));

        const element = page.locator("fast-slider");

        await expect(element).toHaveJSProperty("value", "3");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider--slider"));

        const element = page.locator("fast-slider");

        await element.evaluate<void, FASTSlider>(node => {
            node.setAttribute("value", "3");
        });

        await expect(element).toHaveJSProperty("value", "3");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-slider");

        await page.evaluate(() => {
            const slider = document.createElement("fast-slider") as FASTSlider;
            slider.value = "3";

            document.body.appendChild(slider);
        });

        await expect(element).toHaveJSProperty("value", "3");
    });

    test("should update the `stepMultiplier` when the `step` attribute has been updated", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider--slider", { step: 2, value: 4 }));

        const element = page.locator("fast-slider");

        await element.evaluate<void, FASTSlider>(node => {
            node.increment();
        });

        await expect(element).toHaveJSProperty("value", "6");

        await element.evaluate<void, FASTSlider>(node => {
            node.step = 0.1;
            node.increment();
        });

        await expect(element).toHaveJSProperty("value", "6.1");
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test("should reset its `value` property to the midpoint if no `value` attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("slider--slider-in-form"));

            const element = page.locator("fast-slider");

            const form = page.locator("form");

            await element.evaluate<void, FASTSlider>(node => {
                node.value = "3";
            });

            await expect(element).toHaveAttribute("value", "");

            await expect(element).toHaveJSProperty("value", "3");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "5");
        });

        test("should reset its `value` property to match the `value` attribute when it is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("slider--slider-in-form"));

            const element = page.locator("fast-slider");

            const form = page.locator("form");

            await element.evaluate<void, FASTSlider>(node => {
                node.setAttribute("value", "7");
            });

            await element.evaluate<void, FASTSlider>(node => {
                node.value = "8";
            });

            await expect(element).toHaveAttribute("value", "7");
            await expect(element).toHaveJSProperty("value", "8");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "7");
        });

        test("should put the control into a clean state, where the value attribute changes the value property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("slider--slider-in-form"));

            const element = page.locator("fast-slider");

            const form = page.locator("form");

            await element.evaluate<void, FASTSlider>(node => {
                node.value = "7";
            });

            await element.evaluate<void, FASTSlider>(node => {
                node.setAttribute("value", "8");
            });

            await expect(element).toHaveJSProperty("value", "7");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "8");

            await element.evaluate<void, FASTSlider>(node => {
                node.setAttribute("value", "3");
            });

            await expect(element).toHaveJSProperty("value", "3");
        });
    });
});
