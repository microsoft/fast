import { expect, test } from "@playwright/test";
import type {
    ConverterBindingElement,
    ConverterUnescapedElement,
    ConverterAttrReflectElement,
    ConverterRepeatElement,
    ConverterRepeatEventElement,
    ConverterWhenEventElement,
    ConverterSlottedElement,
    ConverterSlottedFilteredElement,
} from "./main.js";

test.describe("ViewTemplateConverter", () => {
    // ─── Basic (slot) ──────────────────────────────────────────────────────────

    test.describe("basic", () => {
        test("renders slotted light-DOM content", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#basic");
            await expect(element.locator("span")).toHaveText("slotted");
        });
    });

    // ─── Content binding ───────────────────────────────────────────────────────

    test.describe("content binding", () => {
        test("renders initial bound text value", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#binding");
            await expect(element).toHaveText("Hello world");
        });

        test("updates text reactively when attribute changes", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#binding");
            await expect(element).toHaveText("Hello world");

            await element.evaluate((node: ConverterBindingElement) => {
                node.text = "Updated";
            });

            await expect(element).toHaveText("Updated");
        });
    });

    // ─── Unescaped HTML ────────────────────────────────────────────────────────

    test.describe("unescaped-html", () => {
        test("injects raw HTML into a wrapper div", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#unescaped");
            await element.evaluate((node: ConverterUnescapedElement) => {
                node.html = "<strong>bold</strong>";
            });

            await expect(element.locator("strong")).toHaveCount(1);
            await expect(element.locator("strong")).toHaveText("bold");
        });

        test("clears injected HTML when property is reset", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#unescaped");
            await element.evaluate((node: ConverterUnescapedElement) => {
                node.html = "<em>italic</em>";
            });
            await expect(element.locator("em")).toHaveCount(1);

            await element.evaluate((node: ConverterUnescapedElement) => {
                node.html = "";
            });
            await expect(element.locator("em")).toHaveCount(0);
        });
    });

    // ─── Attribute reflect ─────────────────────────────────────────────────────

    test.describe("attr-reflect", () => {
        test("sets bound attribute from component property", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const span = page.locator("#attr-reflect span");
            await expect(span).toHaveAttribute("data-label", "Title");
        });

        test("applies static attribute class", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const span = page.locator("#attr-reflect span");
            await expect(span).toHaveClass("item");
        });

        test("renders multiple bound values in text content", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const span = page.locator("#attr-reflect span");
            await expect(span).toHaveText("Title (42)");
        });

        test("updates bound attribute reactively", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#attr-reflect");
            const span = element.locator("span");

            await element.evaluate((node: ConverterAttrReflectElement) => {
                node.label = "Changed";
            });

            await expect(span).toHaveAttribute("data-label", "Changed");
            await expect(span).toHaveText("Changed (42)");
        });
    });

    // ─── Events ────────────────────────────────────────────────────────────────

    test.describe("event", () => {
        test("no-args handler fires without arguments", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            let message: string | undefined;
            page.on("console", msg => (message = msg.text()));

            await page.locator("#event button").nth(0).click();

            expect(message).toBe("no args");
        });

        test("event-arg handler receives DOM event", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            let message: string | undefined;
            page.on("console", msg => (message = msg.text()));

            await page.locator("#event button").nth(1).click();

            expect(message).toBe("click");
        });

        test("attribute-arg handler receives property value", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            let message: string | undefined;
            page.on("console", msg => (message = msg.text()));

            await page.locator("#event button").nth(2).click();

            expect(message).toBe("bar");
        });

        test("handler correctly binds `this` to modify component property", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#event");
            await expect(element).toHaveJSProperty("foo", "bar");

            await element.locator("button").nth(3).click();

            await expect(element).toHaveJSProperty("foo", "modified-by-click");
        });
    });

    // ─── When directives ───────────────────────────────────────────────────────

    test.describe("when: boolean", () => {
        test("renders content when expression is true", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-boolean-show")).toHaveText(
                "Hello world"
            );
            await expect(page.locator("#when-boolean-hide")).not.toHaveText(
                "Hello world"
            );
        });

        test("updates reactively when boolean attribute is toggled", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const show = page.locator("#when-boolean-show");
            const hide = page.locator("#when-boolean-hide");

            await expect(show).toHaveText("Hello world");
            await expect(hide).not.toHaveText("Hello world");

            await page.evaluate(() => {
                document
                    .getElementById("when-boolean-show")
                    ?.removeAttribute("show");
                document
                    .getElementById("when-boolean-hide")
                    ?.setAttribute("show", "");
            });

            await expect(show).not.toHaveText("Hello world");
            await expect(hide).toHaveText("Hello world");
        });
    });

    test.describe("when: negation (!)", () => {
        test("renders content when negated expression is true", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-not-show")).toHaveText(
                "Hello world"
            );
            await expect(page.locator("#when-not-hide")).not.toHaveText(
                "Hello world"
            );
        });
    });

    test.describe("when: equals (==)", () => {
        test("renders content when values are equal", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-eq-true")).toHaveText("Equals 3");
            await expect(page.locator("#when-eq-false")).not.toHaveText(
                "Equals 3"
            );
        });
    });

    test.describe("when: not equals (!=)", () => {
        test("renders content when values are not equal", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-neq-true")).toHaveText(
                "Not equals 3"
            );
            await expect(page.locator("#when-neq-false")).not.toHaveText(
                "Not equals 3"
            );
        });
    });

    test.describe("when: greater than or equal (>=)", () => {
        test("renders content when left operand >= right operand", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-ge-true")).toHaveText(
                "Two and Over"
            );
            await expect(page.locator("#when-ge-false")).not.toHaveText(
                "Two and Over"
            );
        });
    });

    test.describe("when: greater than (>)", () => {
        test("renders content when left operand > right operand", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-gt-true")).toHaveText("Over two");
            await expect(page.locator("#when-gt-false")).not.toHaveText(
                "Over two"
            );
        });
    });

    test.describe("when: less than or equal (<=)", () => {
        test("renders content when left operand <= right operand", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-le-true")).toHaveText(
                "Two and Under"
            );
            await expect(page.locator("#when-le-false")).not.toHaveText(
                "Two and Under"
            );
        });
    });

    test.describe("when: less than (<)", () => {
        test("renders content when left operand < right operand", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-lt-true")).toHaveText("Under two");
            await expect(page.locator("#when-lt-false")).not.toHaveText(
                "Under two"
            );
        });
    });

    test.describe("when: logical OR (||)", () => {
        test("renders content when either operand is truthy", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-or-true")).toHaveText(
                "This or That"
            );
            await expect(page.locator("#when-or-false")).not.toHaveText(
                "This or That"
            );
        });
    });

    test.describe("when: logical AND (&&)", () => {
        test("renders content only when both operands are truthy", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            await expect(page.locator("#when-and-true")).toHaveText(
                "This and That"
            );
            await expect(page.locator("#when-and-false")).not.toHaveText(
                "This and That"
            );
        });
    });

    test.describe("when: event inside when block", () => {
        test("fires event handler when content is visible", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#when-event-show");
            const button = element.locator("button");

            await button.click();
            await expect(element).toHaveJSProperty("clickCount", 1);
        });

        test("hides content when condition is false", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            await expect(
                page.locator("#when-event-hide").locator("button")
            ).toHaveCount(0);
        });

        test("re-renders and fires events after condition toggles", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#when-event-show");
            const button = element.locator("button");

            await button.click();
            await expect(element).toHaveJSProperty("clickCount", 1);

            await page.evaluate(() => {
                document
                    .getElementById("when-event-show")
                    ?.removeAttribute("show");
            });
            await expect(button).toHaveCount(0);

            await page.evaluate(() => {
                document
                    .getElementById("when-event-show")
                    ?.setAttribute("show", "");
            });
            await expect(button).toHaveCount(1);

            await button.click();
            await expect(element).toHaveJSProperty("clickCount", 2);
        });
    });

    // ─── Repeat ────────────────────────────────────────────────────────────────

    test.describe("repeat", () => {
        test("renders correct number of items", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const items = page.locator("#repeat li");
            await expect(items).toHaveCount(2);
        });

        test("renders item bindings and parent context ($c.parent)", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const items = page.locator("#repeat li");
            await expect(items).toContainText(["Foo - Bat", "Bar - Bat"]);
        });

        test("updates list reactively when observable changes", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const items = page.locator("#repeat li");
            await expect(items).toHaveCount(2);

            await page.locator("#repeat").evaluate((node: ConverterRepeatElement) => {
                node.list = ["A", "B", "C"];
            });

            await expect(items).toHaveCount(3);
            await expect(items).toContainText(["A - Bat", "B - Bat", "C - Bat"]);
        });
    });

    // ─── Repeat event via $c.parent ────────────────────────────────────────────

    test.describe("repeat event via $c.parent", () => {
        test("fires parent handler from initial repeat item", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#repeat-event");
            const buttons = element.locator("button");

            await expect(buttons).toHaveCount(1);
            await buttons.nth(0).click();
            await expect(element).toHaveJSProperty("clickCount", 1);
        });

        test("fires parent handler from newly added repeat item", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#repeat-event");
            const buttons = element.locator("button");

            await element.evaluate((node: ConverterRepeatEventElement) => {
                node.list = ["A", "B"];
            });

            await expect(buttons).toHaveCount(2);
            await buttons.nth(1).click();
            await expect(element).toHaveJSProperty("clickCount", 1);
        });
    });

    // ─── Dot syntax ────────────────────────────────────────────────────────────

    test.describe("dot-syntax", () => {
        test("renders nested property (user.name)", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#dot-syntax");
            await expect(element).toContainText("Alice");
        });

        test("renders deeply nested property (user.address.city)", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#dot-syntax");
            await expect(element).toContainText("Seattle");
        });

        test("renders full interpolated text", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#dot-syntax");
            await expect(element).toHaveText("Alice from Seattle");
        });
    });

    // ─── Ref directive ─────────────────────────────────────────────────────────

    test.describe("ref", () => {
        test("assigns referenced element to component property", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#ref");
            await expect(element).toHaveJSProperty("heading.nodeName", "H1");
        });
    });

    // ─── Slotted directive ─────────────────────────────────────────────────────

    test.describe("slotted", () => {
        test("captures all slotted nodes without filter", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#slotted");
            await expect(element).toHaveJSProperty("slottedNodes.length", 2);
        });

        test("updates slotted nodes when new content is added", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#slotted");
            await expect(element).toHaveJSProperty("slottedNodes.length", 2);

            await element.evaluate((node: ConverterSlottedElement) => {
                const p = document.createElement("p");
                node.appendChild(p);
            });

            await expect(element).toHaveJSProperty("slottedNodes.length", 3);
        });

        test("filters slotted nodes to elements only with elements()", async ({
            page,
        }) => {
            await page.goto("/fixtures/converter/");

            const element = page.locator("#slotted-filtered");
            await expect(element).toHaveJSProperty("filteredNodes.length", 2);
        });

        test("elements() filter excludes text nodes", async ({ page }) => {
            await page.goto("/fixtures/converter/");

            const unfiltered = page.locator("#slotted");
            const filtered = page.locator("#slotted-filtered");

            // slotted-filtered has whitespace text nodes in HTML source,
            // but elements() filter returns only element nodes
            await expect(filtered).toHaveJSProperty("filteredNodes.length", 2);

            // raw slotted (no whitespace in source) also returns 2
            await expect(unfiltered).toHaveJSProperty(
                "slottedNodes.length",
                2
            );
        });
    });
});
