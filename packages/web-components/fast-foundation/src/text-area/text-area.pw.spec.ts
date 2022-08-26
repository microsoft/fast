import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTextArea } from "./text-area.js";

test.describe("TextArea", () => {
    test("should set the `autofocus` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("text-area--text-area", {
                autofocus: true,
            })
        );

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("autofocus");
    });

    test("should set the `disabled` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { disabled: true }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("disabled");
    });

    test("should set the `cols` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { cols: 4 }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("cols", "4");
    });

    test("should set the `list` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { list: "listId" }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("list", "listId");
    });

    test("should set the `maxlength` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { maxlength: 14 }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("maxlength", "14");
    });

    test("should set the `minlength` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { minlength: 8 }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("minlength", "8");
    });

    test("should set the `name` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { name: "foo" }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("name", "foo");
    });

    test("should set the `placeholder` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { placeholder: "foo" }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("placeholder", "foo");
    });

    test("should set the `readonly` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { readOnly: true }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("readonly");
    });

    test("should set the `required` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { required: true }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("required");
    });

    test("should set the `rows` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { rows: 4 }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("rows", "4");
    });

    test("should set the `spellcheck` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area", { spellcheck: true }));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

        await expect(control).toHaveBooleanAttribute("spellcheck");
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area"));

        const element = page.locator("fast-text-area");

        await expect(element).toHaveJSProperty("value", "");
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-area");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-area");

            node.setAttribute("value", "foo");

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-area");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-area");

            document.getElementById("root")?.append(node);

            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-area");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-area") as FASTTextArea;

            node.value = "foo";

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test.describe("Delegates ARIA textbox", () => {
        test("should set the `aria-atomic` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaAtomic: "true",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-atomic", "true");
        });

        test("should set the `aria-busy` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaBusy: "false",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-busy", "false");
        });

        test("should set the `aria-controls` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaControls: "testId",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-controls", "testId");
        });

        test("should set the `aria-current` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaCurrent: "page",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-current", "page");
        });

        test("should set the `aria-describedby` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaDescribedby: "testId",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-describedby", "testId");
        });

        test("should set the `aria-details` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaDetails: "testId",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-details", "testId");
        });

        test("should set the `aria-disabled` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaDisabled: "true",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-disabled", "true");
        });

        test("should set the `aria-errormessage` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaErrormessage: "test",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-errormessage", "test");
        });

        test("should set the `aria-flowto` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaFlowto: "testId",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-flowto", "testId");
        });

        test("should set the `aria-haspopup` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaHaspopup: "true",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-haspopup", "true");
        });

        test("should set the `aria-hidden` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaHidden: "true",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-hidden", "true");
        });

        test("should set the `aria-invalid` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaInvalid: "spelling",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-invalid", "spelling");
        });

        test("should set the `aria-keyshortcuts` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaKeyshortcuts: "F4",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-keyshortcuts", "F4");
        });

        test("should set the `aria-label` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaLabel: "Foo label",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-label", "Foo label");
        });

        test("should set the `aria-labelledby` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaLabelledby: "testId",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-labelledby", "testId");
        });

        test("should set the `aria-live` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaLive: "polite",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-live", "polite");
        });

        test("should set the `aria-owns` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaOwns: "testId",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-owns", "testId");
        });

        test("should set the `aria-relevant` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaRelevant: "removals",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-relevant", "removals");
        });

        test("should set the `aria-roledescription` attribute on the internal control when provided", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("text-area--text-area", {
                    ariaRoledescription: "slide",
                })
            );

            const element = page.locator("fast-text-area");

            const control = element.locator(".control");

            await expect(control).toHaveAttribute("aria-roledescription", "slide");
        });
    });

    test("should fire a `change` event when the internal control emits a `change` event", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area"));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

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

    test.describe("when the owning form's reset() method is invoked", () => {
        test("should reset the `value` property to an empty string when no `value` attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-area--text-area-in-form"));

            const element = page.locator("fast-text-area");

            const form = page.locator("form");

            await element.evaluate<void, FASTTextArea>(node => {
                node.value = "foo";
            });

            await expect(element).not.hasAttribute("value");

            await expect(element).toHaveJSProperty("value", "foo");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).not.hasAttribute("value");

            await expect(element).toHaveJSProperty("value", "");
        });

        test("should reset the `value` property to match the `value` attribute", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-area--text-area-in-form", { value: "foo" }));

            const element = page.locator("fast-text-area");

            const form = page.locator("form");

            await element.evaluate((node: FASTTextArea) => {
                node.value = "bar";
            });

            await expect(element).toHaveAttribute("value", "foo");

            await expect(element).toHaveJSProperty("value", "bar");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveAttribute("value", "foo");

            await expect(element).toHaveJSProperty("value", "foo");
        });

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-area--text-area-in-form"));

            const element = page.locator("fast-text-area");

            const form = page.locator("form");

            await element.evaluate((node: FASTTextArea) => {
                node.value = "prop-value";
                node.setAttribute("value", "attr-value");
            });

            await expect(element).toHaveJSProperty("value", "prop-value");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "attr-value");

            await element.evaluate((node: FASTTextArea) => {
                node.setAttribute("value", "new-attr-value");
            });

            await expect(element).toHaveJSProperty("value", "new-attr-value");
        });
    });
});
