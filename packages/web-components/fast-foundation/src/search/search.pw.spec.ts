import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSearch } from "./search.js";

test.describe("Search", () => {
    test("should set the `autofocus` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { autofocus: true }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        expect(await control.getAttribute("autofocus")).toBe("");
    });

    test("should set the `disabled` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { disabled: true }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        expect(await control.getAttribute("disabled")).toBe("");
    });

    test("should set the `list` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { list: "listId" }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("list", "listId");
    });

    test("should set the `maxlength` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { maxlength: 14 }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("maxlength", "14");
    });

    test("should set the `minlength` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { minlength: 14 }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("minlength", "14");
    });

    test("should set the `placeholder` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { placeholder: "placeholder" }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        await expect(control).toHaveAttribute("placeholder", "placeholder");
    });

    test("should set the `readonly` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { readonly: true }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        expect(await control.getAttribute("readonly")).toBe("");
    });

    test("should set the `required` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { required: true }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        expect(await control.getAttribute("required")).toBe("");
    });

    test("should set the `size` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { size: 8 }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        expect(await control.getAttribute("size")).toBe("8");
    });

    test("should set the `spellcheck` attribute on the internal control equal to the value provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { spellcheck: true }));

        const element = page.locator("fast-search");

        const control = element.locator(".control");

        expect(await control.getAttribute("spellcheck")).toBe("");
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search"));

        const element = page.locator("fast-search");

        await expect(element).toHaveJSProperty("value", "");
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-search");

        await page.evaluate(() => {
            const node = document.createElement("fast-search");
            node.setAttribute("value", "initial value");

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "initial value");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search"));

        const element = page.locator("fast-search");

        await element.evaluate(node => {
            node.setAttribute("value", "foobar");
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-search");

        await page.evaluate(() => {
            const node = document.createElement("fast-search") as FASTSearch;

            node.value = "foobar";

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should hide the label when no default slotted content is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { storyContent: "" }));

        const element = page.locator("fast-search");

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start or end content is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { storyContent: "" }));

        const element = page.locator("fast-search");

        await element.evaluate(node => {
            const svg = document.createElement("svg");
            svg.id = "start-end-content";
            svg.setAttribute("slot", "start");
            svg.setAttribute("height", "100px");
            svg.setAttribute("width", "100px");

            node.append(svg);
        });

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);

        const svg = element.locator("#start-end-content");

        await svg.evaluate(node => {
            node.setAttribute("slot", "end");
        });

        await expect(label).toHaveClass(/label__hidden/);

        await element.evaluate(node => {
            node.innerHTML = "label";
        });

        await expect(label).not.toHaveClass(/label__hidden/);
    });

    test("should hide the label when space-only text nodes are slotted", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search"));

        const element = page.locator("fast-search");

        const label = element.locator(".label");

        await expect(label).not.toHaveClass(/label__hidden/);

        await element.evaluate(node => {
            node.innerHTML = `    \r    `;
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test.describe("should set the ARIA attribute on the internal control", () => {
        const attributes = {
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
        Object.entries(attributes).forEach(([key, value]) => {
            test(key, async ({ page }) => {
                await page.goto(fixtureURL("search--search", { [key]: value }));

                const element = page.locator("fast-search");

                const control = element.locator(".control");

                await expect(control).toHaveAttribute(spinalCase(key), value);
            });
        });
    });

    test.describe("events", () => {
        test("should fire a change event when the internal control emits a change event", async ({
            page,
        }) => {
            await page.goto(fixtureURL("search--search"));

            const element = page.locator("fast-search");

            const control = element.locator(".control");

            const [wasChanged] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("change", () => resolve(true));
                        })
                ),
                control.evaluate(node => {
                    node.dispatchEvent(new KeyboardEvent("change"));
                }),
            ]);

            expect(wasChanged).toBeTruthy();
        });
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test("should reset its `value` property to an empty string when no value attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("search--search-in-form"));

            const element = page.locator("fast-search");

            const form = page.locator("form");

            await element.evaluate<any, FASTSearch>(node => {
                node.value = "test value";
            });

            await expect(element).toHaveJSProperty("value", "test value");

            expect(await element.getAttribute("value")).toBeNull();

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "");

            expect(await element.getAttribute("value")).toBeNull();
        });

        test("should reset its `value` property to the value of the value attribute if it is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("search--search-in-form", { value: "test value" })
            );

            const element = page.locator("fast-search");

            const form = page.locator("form");

            await element.evaluate<any, FASTSearch>(node => {
                node.value = "new value";
            });

            await expect(element).toHaveJSProperty("value", "new value");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "test value");
        });

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("search--search-in-form"));

            const element = page.locator("fast-search");

            const form = page.locator("form");

            await element.evaluate<void, FASTSearch>(node => {
                node.value = "test value";
            });

            await element.evaluate(node => {
                node.setAttribute("value", "attr value");
            });

            await expect(element).toHaveJSProperty("value", "test value");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "attr value");

            await element.evaluate(node => {
                node.setAttribute("value", "new attr value");
            });

            await expect(element).toHaveJSProperty("value", "new attr value");
        });
    });
});
