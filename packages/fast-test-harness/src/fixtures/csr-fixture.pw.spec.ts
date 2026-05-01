import { expect, test } from "@microsoft/fast-test-harness";

test.describe("CSR: setTemplate", () => {
    test.use({ tagName: "test-widget" });

    test("should render the element with default options", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await expect(fastPage.element).toHaveCount(1);
    });

    test("should render with innerHTML", async ({ fastPage }) => {
        await fastPage.setTemplate({ innerHTML: "<span>child</span>" });

        await expect(fastPage.element).toHaveCount(1);
        await expect(fastPage.element).toContainText("child");
    });

    test("should render with attributes", async ({ fastPage }) => {
        await fastPage.setTemplate({
            attributes: { label: "Hello", size: "large" },
        });

        await expect(fastPage.element).toHaveAttribute("label", "Hello");
        await expect(fastPage.element).toHaveAttribute("size", "large");
    });

    test("should render with boolean attribute", async ({ fastPage }) => {
        await fastPage.setTemplate({ attributes: { disabled: true } });

        await expect(fastPage.element).toHaveAttribute("disabled");
    });

    test("should render with a raw HTML string", async ({ fastPage }) => {
        await fastPage.setTemplate(`<test-widget label="raw">raw content</test-widget>`);

        await expect(fastPage.element).toHaveAttribute("label", "raw");
        await expect(fastPage.element).toContainText("raw content");
    });

    test("should replace the previous template on subsequent calls", async ({
        fastPage,
    }) => {
        await fastPage.setTemplate({ attributes: { label: "first" } });
        await expect(fastPage.element).toHaveAttribute("label", "first");

        await fastPage.setTemplate({ attributes: { label: "second" } });
        await expect(fastPage.element).toHaveAttribute("label", "second");
        await expect(fastPage.element).toHaveCount(1);
    });
});

test.describe("CSR: updateTemplate", () => {
    test.use({ tagName: "test-widget" });

    test("should update attributes on an existing element", async ({ fastPage }) => {
        await fastPage.setTemplate({ attributes: { label: "before" } });
        await expect(fastPage.element).toHaveAttribute("label", "before");

        await fastPage.updateTemplate("test-widget", {
            attributes: { label: "after" },
        });

        await expect(fastPage.element).toHaveAttribute("label", "after");
    });

    test("should remove an attribute when set to false", async ({ fastPage }) => {
        await fastPage.setTemplate({ attributes: { disabled: true } });
        await expect(fastPage.element).toHaveAttribute("disabled");

        await fastPage.updateTemplate("test-widget", {
            attributes: { disabled: false },
        });

        await expect(fastPage.element).not.toHaveAttribute("disabled");
    });

    test("should update innerHTML", async ({ fastPage }) => {
        await fastPage.setTemplate({ innerHTML: "original" });

        await fastPage.updateTemplate("test-widget", {
            innerHTML: "updated",
        });

        await expect(fastPage.element).toContainText("updated");
    });

    test("should accept a Locator", async ({ fastPage }) => {
        await fastPage.setTemplate({ attributes: { label: "loc" } });

        await fastPage.updateTemplate(fastPage.element, {
            attributes: { label: "via-locator" },
        });

        await expect(fastPage.element).toHaveAttribute("label", "via-locator");
    });
});

test.describe("CSR: applyTokens", () => {
    test.use({ tagName: "test-widget" });

    test("should set CSS custom properties on the body", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await fastPage.applyTokens({
            "color-primary": "#0078d4",
            "spacing-m": "8px",
        });

        const value = await fastPage.page.evaluate(() =>
            document.body.style.getPropertyValue("--color-primary"),
        );

        expect(value).toBe("#0078d4");
    });
});

test.describe("CSR: waitForCustomElement", () => {
    test.use({ tagName: "test-widget" });

    test("should resolve for a registered element", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await fastPage.waitForCustomElement("test-widget");
    });
});

test.describe("CSR: toHaveCustomState", () => {
    test.use({ tagName: "test-widget" });

    test("should pass when element has the custom state", async ({ fastPage }) => {
        await fastPage.setTemplate({ attributes: { disabled: true } });

        await expect(fastPage.element).toHaveCustomState("disabled");
    });

    test("should fail (negated) when element does not have the state", async ({
        fastPage,
    }) => {
        await fastPage.setTemplate();

        await expect(fastPage.element).not.toHaveCustomState("disabled");
    });
});

test.describe("CSR: element locator", () => {
    test.use({ tagName: "test-widget" });

    test("should locate the element by tag name", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await expect(fastPage.element).toHaveCount(1);
    });
});

test.describe("CSR: addStyleTag", () => {
    test.use({ tagName: "test-widget" });

    test("should add a style tag with content", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await fastPage.addStyleTag({
            content: "test-widget { border: 1px solid red; }",
        });

        const hasBorder = await fastPage.page.evaluate(() => {
            const styles = document.querySelectorAll("style");
            return Array.from(styles).some(s =>
                s.textContent?.includes("border: 1px solid red"),
            );
        });

        expect(hasBorder).toBe(true);
    });
});

test.describe("CSR: multiple elements", () => {
    test.use({ tagName: "test-widget" });

    test("should handle templates with multiple instances", async ({ fastPage }) => {
        await fastPage.setTemplate(`
            <test-widget label="first">one</test-widget>
            <test-widget label="second">two</test-widget>
        `);

        await expect(fastPage.element).toHaveCount(2);
    });
});

test.describe("CSR: waitFor", () => {
    test.use({ tagName: "test-widget", waitFor: ["test-widget"] });

    test("should wait for additional elements specified in waitFor", async ({
        fastPage,
    }) => {
        await fastPage.setTemplate();

        await expect(fastPage.element).toHaveCount(1);
    });
});
