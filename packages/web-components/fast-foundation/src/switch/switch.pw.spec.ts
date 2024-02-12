import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSwitch } from "./switch.js";

test.describe("Switch", () => {
    let page: Page;
    let root: Locator;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-switch");

        root = page.locator("#root");

        await page.goto(fixtureURL("switch--switch"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have a role of `switch`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await expect(element).toHaveAttribute("role", "switch");
    });

    test("should set a tabindex of 0 on the element", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should set a default `aria-checked` value when `checked` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await expect(element).not.toHaveAttribute("aria-readonly");
    });

    test("should set the `aria-checked` attribute equal to the `checked` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await element.evaluate((node: FASTSwitch) => {
            node.checked = true;
        });

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.evaluate((node: FASTSwitch) => {
            node.checked = false;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await element.evaluate((node: FASTSwitch) => {
            node.readOnly = true;
        });

        await expect(element).toHaveAttribute("aria-readonly", "true");

        await element.evaluate((node: FASTSwitch) => {
            node.readOnly = false;
        });

        await expect(element).toHaveAttribute("aria-readonly", "false");
    });

    test("should initialize to the initial value if no value property is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        const initialValue = await element.evaluate<string, FASTSwitch>(
            node => node.initialValue
        );

        await expect(element).toHaveJSProperty("value", initialValue);
    });

    test("should add a class of `label` to the internal label when default slotted content exists", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });
        const label = element.locator(".label");

        await element.evaluate(node => {
            node.innerHTML = "Label";
        });

        await expect(label).toHaveClass(/label/);

        await expect(label).not.toHaveClass(/label__hidden/);
    });

    test("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch>Switch</fast-switch>
            `;
        });

        const label = element.locator(".label");

        await element.evaluate(node => {
            node.innerHTML = "";
        });

        await expect(label).toHaveClass(/label/);

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await element.evaluate((node: FASTSwitch) => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTSwitch) => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should NOT set a tabindex when disabled is `true`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch disabled></fast-switch>
            `;
        });

        await expect(element).not.toHaveAttribute("tabindex");

        await element.evaluate((node: FASTSwitch) => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should initialize to the provided value attribute if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch value="foo"></fast-switch>
            `;
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        await element.evaluate((node: FASTSwitch) => {
            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const switchElement = document.createElement("fast-switch") as FASTSwitch;
            switchElement.value = "foobar";
            node.appendChild(switchElement);
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should emit an event when clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        const [wasClicked] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("click", () => resolve(true));
                    })
            ),
            element.evaluate(node => {
                node.dispatchEvent(new MouseEvent("click"));
            }),
        ]);

        expect(wasClicked).toBe(true);
    });

    test("should fire an event when spacebar is invoked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        const [wasEmitted] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("keydown", () => resolve(true));
                    })
            ),
            element.evaluate(node => {
                node.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
            }),
        ]);

        expect(wasEmitted).toBe(true);
    });

    test("should fire an event when enter is invoked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-switch></fast-switch>
            `;
        });

        const [wasEmitted] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("keydown", () => resolve(true));
                    })
            ),
            element.evaluate(node => {
                node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
            }),
        ]);

        expect(wasEmitted).toBe(true);
    });

    test("should be invalid when required and unchecked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-switch required></fast-switch>
                </form>
            `;
        });

        expect(
            await element.evaluate<boolean, FASTSwitch>(
                node => node.validity.valueMissing
            )
        ).toBe(true);
    });

    test("should be valid when required and checked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-switch required checked></fast-switch>
                </form>
            `;
        });

        expect(
            await element.evaluate<boolean, FASTSwitch>(
                node => node.validity.valueMissing
            )
        ).toBe(false);
    });

    test.describe("who's parent form has it's reset() method invoked", () => {
        test("should set its checked property to false if the checked attribute is unset", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-switch></fast-switch>
                    </form>
                `;
            });

            const form = page.locator("form");

            await expect(element).not.toHaveAttribute("checked");

            await element.evaluate((node: FASTSwitch) => {
                node.checked = true;
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);
        });

        test("should set its checked property to true if the checked attribute is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-switch checked></fast-switch>
                    </form>
                `;
            });

            const form = page.locator("form");

            await expect(element).toHaveAttribute("checked");

            await element.evaluate((node: FASTSwitch) => {
                node.checked = false;
            });

            await expect(element).toHaveJSProperty("checked", false);

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", true);
        });

        test("should put the control into a clean state, where `checked` attribute modifications update the `checked` property prior to user or programmatic interaction", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-switch></fast-switch>
                    </form>
                `;
            });

            const form = page.locator("form");

            await element.evaluate((node: FASTSwitch) => {
                node.checked = true;
                node.removeAttribute("checked");
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate((node: FASTSwitch) => {
                node.setAttribute("checked", "");
            });

            await expect(element).toHaveJSProperty("checked", true);
        });
    });
});
