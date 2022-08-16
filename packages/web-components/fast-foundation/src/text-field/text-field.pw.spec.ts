import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTextField } from "./text-field.js";

test.describe("TextField", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let control: Locator;
    let label: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-text-field");

        root = page.locator("#root");

        control = element.locator(".field");

        label = element.locator(".label");

        await page.goto(fixtureURL("debug--blank"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should set the `autofocus` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field autofocus></fast-text-field>
            `;
        });

        await expect(control).toHaveBooleanAttribute("autofocus");
    });

    test("should set the `disabled` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field disabled></fast-text-field>
            `;
        });

        await expect(control).toHaveBooleanAttribute("disabled");
    });

    test("should set the `readonly` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field readonly></fast-text-field>
            `;
        });

        await expect(control).toHaveBooleanAttribute("readonly");
    });

    test("should set the `required` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field required></fast-text-field>
            `;
        });

        await expect(control).toHaveBooleanAttribute("required");
    });

    test("should set the `spellcheck` attribute on the internal control", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field spellcheck></fast-text-field>
            `;
        });

        await expect(control).toHaveBooleanAttribute("spellcheck");
    });

    test.describe("should set the attribute on the internal control", () => {
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

        for (const [attribute, value] of Object.entries(attributes)) {
            const attrToken = spinalCase(attribute);

            test(`should set the \`${attrToken}\` attribute on the internal control`, async () => {
                await root.evaluate(
                    (node, { attrToken, value }) => {
                        node.innerHTML = /* html */ `
                            <fast-text-field ${attrToken}="${value}"></fast-text-field>
                        `;
                    },
                    { attrToken, value }
                );

                await expect(control).toHaveAttribute(attrToken, `${value}`);
            });
        }
    });

    test("should initialize to the `initialValue` property if no value property is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field></fast-text-field>
            `;
        });

        const initialValue = await element.evaluate<string, FASTTextField>(
            node => node.initialValue
        );

        await expect(element).toHaveJSProperty("value", initialValue);
    });

    test("should initialize to the provided `value` attribute if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field value="foo"></fast-text-field>
            `;
        });

        const element = page.locator("fast-text-field");

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided `value` property if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ ``;

            const textField = document.createElement("fast-text-field") as FASTTextField;

            textField.value = "foo";

            node.appendChild(textField);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided `value` attribute if set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field></fast-text-field>
            `;
        });

        await element.evaluate(node => {
            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should hide the label when no default slotted content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = "<fast-text-field></fast-text-field>";
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field>
                    <div slot="start"></div>
                </fast-text-field>
            `;
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when end content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field>
                    <div slot="end"></div>
                </fast-text-field>
            `;
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start and end content are provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field>
                    <div slot="start"></div>
                    <div slot="end"></div>
                </fast-text-field>
            `;
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when space-only text nodes are slotted", async () => {
        await root.evaluate(node => {
            node.innerHTML = `<fast-text-field>\n \n</fast-text-field>`;
        });

        await expect(element).toHaveText(/\n\s\n/);

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should fire a `change` event when the internal control emits a `change` event", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-field></fast-text-field>
            `;
        });

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
        test("should report invalid validity when the `value` property is an empty string and `required` is true", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" required></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeTruthy();
        });

        test("should report valid validity when the `value` property is a string that is non-empty and `required` is true", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" required value="some-value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is empty and `minlength` is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" minlength="1"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length less than `minlength`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" minlength="10" value="123456789"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is empty and `maxlength` is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" maxlength="10"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length which exceeds the `maxlength`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" maxlength="10" value="12345678901"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` is shorter than `maxlength` and the element is `required`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" maxlength="10" required value="123456789"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` property matches the `pattern` property", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" pattern="\\d+" value="123456789"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeFalsy();
        });

        test("should report invalid validity when `value` does not match `pattern`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="password" pattern="value" value="other value"></fast-text-field>
                `;
            });

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `tel`", () => {
        test("should report invalid validity when the `value` property is an empty string and `required` is true", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" required></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeTruthy();
        });

        test("should report valid validity when the `value` property is not empty and `required` is true", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" required value="some-value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `minlength` is set and `value` is an empty string", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" minlength="1"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the length of `value` is less than `minlength`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" minlength="10" value="123456789"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is an empty string", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" maxlength="10"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length which exceeds `maxlength`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" maxlength="10" value="12345678901"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` is shorter than `maxlength` and the element is `required`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" maxlength="10" required value="123456789"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` matches `pattern`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" pattern="\\d+" value="123456789"></fast-text-field>
                `;
            });

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeFalsy();
        });

        test("should report invalid validity when `value` does not match `pattern`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="tel" pattern="value" required value="other value"></fast-text-field>
                `;
            });

            const element = page.locator("fast-text-field");

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `text`", () => {
        test("should report invalid validity when the `value` property is an empty string and `required` is true", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" required></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeTruthy();
        });

        test("should report valid validity when the `value` property is not empty and `required` is true", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" required value="some value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.valueMissing
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is an empty string and `minlength` is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" minlength="1"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length less than `minlength`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" minlength="6" value="value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooShort
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` is empty and `maxlength` is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" maxlength="0"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when `value` has a length which exceeds `maxlength`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" maxlength="4" value="value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` is shorter than `maxlength` and the element is `required`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" maxlength="6" required value="value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.tooLong
                )
            ).toBeFalsy();
        });

        test("should report valid validity when the `value` matches `pattern`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" pattern="value" required value="value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeFalsy();
        });

        test("should report invalid validity when `value` does not match `pattern`", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="text" pattern="value" required value="other value"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.patternMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `email`", () => {
        test("should report valid validity when `value` is an empty string", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="email"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeFalsy();
        });

        test("should have invalid invalidity with a `typeMismatch` when `value` is not a valid email", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="email" value="not an email"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeTruthy();
        });
    });

    test.describe("with a type of `url`", () => {
        test("should report valid validity when `value` is an empty string", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="url"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeFalsy();
        });

        test("should have invalid invalidity with a `typeMismatch` when `value` is not a valid URL", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-text-field type="url" value="not a url"></fast-text-field>
                `;
            });

            expect(
                await element.evaluate<boolean, FASTTextField>(
                    node => node.validity.typeMismatch
                )
            ).toBeTruthy();
        });
    });
});
