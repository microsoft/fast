import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTextField } from "./text-field.js";

test.describe("TextField", () => {
    test("should set the boolean attribute on the internal input", async ({ page }) => {
        const attributes = {
            autofocus: true,
            disabled: true,
            readOnly: true,
            required: true,
            spellcheck: true,
        };

        await page.goto(fixtureURL("text-field--text-field", attributes));

        const control = page.locator("fast-text-field .control");

        for (const attribute of Object.keys(attributes)) {
            await expect(control).toHaveBooleanAttribute(attribute);
        }
    });

    test("should set the attribute on the internal control", async ({ page }) => {
        const attributes = {
            maxlength: 14,
            minlength: 14,
            name: "foo",
            placeholder: "foo",
            size: 4,
            list: "listId",
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
            ariaRoledescription: "search",
        };

        await page.goto(fixtureURL("text-field--text-field", attributes));

        const control = page.locator("fast-text-field .control");

        for (const [attribute, value] of Object.entries(attributes)) {
            await expect(control).toHaveAttribute(spinalCase(attribute), `${value}`);
        }
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field"));

        const element = page.locator("fast-text-field");

        const initialValue = await element.evaluate<string, FASTTextField>(
            node => node.initialValue
        );

        await expect(element).toHaveJSProperty("value", initialValue);
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { value: "foo" }));

        const element = page.locator("fast-text-field");

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-field");

        await page.evaluate(() => {
            const element = document.createElement("fast-text-field") as FASTTextField;

            element.value = "foo";

            document.getElementById("root")?.append(element);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field"));

        const element = page.locator("fast-text-field");

        await element.evaluate(node => {
            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should hide the label when start content is provided", async ({ page }) => {
        await page.goto(
            fixtureURL("text-field--text-field", { storyContent: "!undefined" })
        );

        const element = page.locator("fast-text-field");

        const label = element.locator(".label");

        await element.evaluate(node => {
            const svg = document.createElement("svg");
            svg.slot = "start";
            node.append(svg);
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when end content is provided", async ({ page }) => {
        await page.goto(
            fixtureURL("text-field--text-field", { storyContent: "!undefined" })
        );

        const element = page.locator("fast-text-field");

        const label = element.locator(".label");

        await element.evaluate(node => {
            const svg = document.createElement("svg");
            svg.slot = "end";
            node.append(svg);
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start and end content are provided", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("text-field--text-field", { storyContent: "!undefined" })
        );

        const element = page.locator("fast-text-field");

        const label = element.locator(".label");

        await element.evaluate(node => {
            const svg = document.createElement("svg");
            svg.slot = "start";
            node.append(svg);
        });

        await element.evaluate(node => {
            const svg = document.createElement("svg");
            svg.slot = "end";
            node.append(svg);
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when space-only text nodes are slotted", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("text-field--text-field", { storyContent: "!undefined" })
        );

        const element = page.locator("fast-text-field");

        const label = element.locator(".label");

        await element.evaluate(node => {
            const textNode = document.createTextNode(`

            `);

            node.append(textNode);
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when no default slotted content is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-field");

        const label = element.locator(".label");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-field") as FASTTextField;
            document.getElementById("root")?.append(node);
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should fire a `change` event when the internal control emits a `change` event", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field"));

        const element = page.locator("fast-text-field");

        const control = element.locator("input");

        const [wasChanged] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("change", () => resolve(true));
                    })
            ),
            control.evaluate(node => {
                node.dispatchEvent(
                    new Event("change", {
                        key: "a",
                    } as EventInit)
                );
            }),
        ]);

        expect(wasChanged).toBeTruthy();
    });

    test.describe("with a type of `password`", () => {
        test("should report invalid validity when the `value` property is an empty string and required is true", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    type: "password",
                    required: true,
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeTruthy();
        });

        test("should report valid validity when the `value` property is a string that is non-empty and required is true", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "password",
                    value: "some value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is empty and `minlength` is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    minlength: 1,
                    type: "password",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length less than `minlength`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    minlength: 6,
                    type: "password",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is empty and `maxlength` is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 0,
                    type: "password",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length which exceeds the `maxlength`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 4,
                    type: "password",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` is shorter than `maxlength` and the element is `required`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 6,
                    required: true,
                    type: "password",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` matches `pattern`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    pattern: "value",
                    required: true,
                    type: "password",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeFalsy();
        });

        test("should report invalid validity when `value` does not match `pattern`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    pattern: "value",
                    required: true,
                    type: "password",
                    value: "other value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `tel`", () => {
        test("should report invalid validity when the `value` property is an empty string and `required` is true", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    type: "tel",
                    required: true,
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeTruthy();
        });

        test("should report valid validity when the `value` property is not empty and `required` is true", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "tel",
                    value: "some value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `minlength` is set and `value` is an empty string", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    minlength: 1,
                    type: "tel",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the length of `value` is less than `minlength`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    minlength: 6,
                    type: "tel",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is an empty string", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 0,
                    type: "tel",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length which exceeds `maxlength`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 4,
                    type: "tel",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` is shorter than `maxlength` and the element is `required`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 6,
                    required: true,
                    type: "tel",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` matches `pattern`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    pattern: "value",
                    required: true,
                    type: "tel",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeFalsy();
        });

        test("should report invalid validity when `value` does not match `pattern`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    pattern: "value",
                    required: true,
                    type: "tel",
                    value: "other value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `text`", () => {
        test("should report invalid validity when the `value` property is an empty string and `required` is true", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    type: "text",
                    required: true,
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeTruthy();
        });

        test("should report valid validity when the `value` property is not empty and `required` is true", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "text",
                    value: "some value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is an empty string and `minlength` is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    minlength: 1,
                    type: "text",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length less than `minlength`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    minlength: 6,
                    type: "text",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is empty and `maxlength` is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 0,
                    type: "text",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length which exceeds `maxlength`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 4,
                    type: "text",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` is shorter than `maxlength` and the element is `required`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    maxlength: 6,
                    required: true,
                    type: "text",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` matches `pattern`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    pattern: "value",
                    required: true,
                    type: "text",
                    value: "value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeFalsy();
        });

        test("should report invalid validity when `value` does not match `pattern`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    pattern: "value",
                    required: true,
                    type: "text",
                    value: "other value",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `email`", () => {
        test("should report valid validity when `value` is an empty string", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "email",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeFalsy();
        });

        test("should have invalid invalidity with a `typeMismatch` when `value` is not a valid email", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "email",
                    value: "not an email",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `url`", () => {
        test("should report valid validity when `value` is an empty string", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "url",
                    value: "",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeFalsy();
        });

        test("should have invalid invalidity with a `typeMismatch` when `value` is not a valid URL", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", {
                    required: true,
                    type: "url",
                    value: "not a URL",
                })
            );

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeTruthy();
        });
    });
});
