import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTextField } from "./text-field.js";

test.describe("TextField", () => {
    test("should set the `autofocus` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { autofocus: true }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("autofocus");
    });

    test("should set the `disabled` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { disabled: true }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("disabled");
    });

    test("should set the `list` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { list: "foo" }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("list", "foo");
    });

    test("should set the `maxlength` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { maxlength: "10" }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("maxlength", "10");
    });

    test("should set the `minlength` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { minlength: 8 }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("minlength", "8");
    });

    test("should set the `placeholder` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("text-field--text-field", { placeholder: "placeholder" })
        );

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("placeholder", "placeholder");
    });

    test("should set the `readonly` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { readOnly: true }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("readonly");
    });

    test("should set the `required` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { required: true }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("required");
    });

    test("should set the `size` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { size: 8 }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("size", "8");
    });

    test("should set the `spellcheck` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-field--text-field", { spellcheck: true }));

        const element = page.locator("fast-text-field");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("spellcheck");
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

    test.describe("Delegates ARIA textbox", () => {
        test("should set the `aria-atomic` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-field--text-field", { ariaAtomic: "true" }));

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-atomic",
                "true"
            );
        });

        test("should set the `aria-busy` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-field--text-field", { ariaBusy: "false" }));

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-busy",
                "false"
            );
        });

        test("should set the `aria-controls` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaControls: "testId" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-controls",
                "testId"
            );
        });

        test("should set the `aria-current` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaCurrent: "page" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-current",
                "page"
            );
        });

        test("should set the `aria-describedby` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaDescribedby: "testId" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-describedby",
                "testId"
            );
        });

        test("should set the `aria-details` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaDetails: "testId" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-details",
                "testId"
            );
        });

        test("should set the `aria-disabled` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaDisabled: "true" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-disabled",
                "true"
            );
        });

        test("should set the `aria-errormessage` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaErrormessage: "test" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-errormessage",
                "test"
            );
        });

        test("should set the `aria-flowto` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaFlowto: "testId" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-flowto",
                "testId"
            );
        });

        test("should set the `aria-haspopup` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaHaspopup: "true" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-haspopup",
                "true"
            );
        });

        test("should set the `aria-hidden` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-field--text-field", { ariaHidden: "true" }));

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-hidden",
                "true"
            );
        });

        test("should set the `aria-invalid` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaInvalid: "spelling" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-invalid",
                "spelling"
            );
        });

        test("should set the `aria-keyshortcuts` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaKeyshortcuts: "F4" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-keyshortcuts",
                "F4"
            );
        });

        test("should set the `aria-label` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-field--text-field", { ariaLabel: "foo" }));

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-label",
                "foo"
            );
        });

        test("should set the `aria-labelledby` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaLabelledby: "testId" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-labelledby",
                "testId"
            );
        });

        test("should set the `aria-live` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-field--text-field", { ariaLive: "polite" }));

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-live",
                "polite"
            );
        });

        test("should set the `aria-owns` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-field--text-field", { ariaOwns: "testId" }));

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-owns",
                "testId"
            );
        });

        test("should set the `aria-relevant` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaRelevant: "removals" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-relevant",
                "removals"
            );
        });

        test("should set the `aria-roledescription` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-field--text-field", { ariaRoledescription: "slide" })
            );

            await expect(page.locator("fast-text-field .control")).toHaveAttribute(
                "aria-roledescription",
                "slide"
            );
        });
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
