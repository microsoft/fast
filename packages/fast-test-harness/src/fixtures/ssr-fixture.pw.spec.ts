import { expect, test } from "@microsoft/fast-test-harness";

test.describe("SSR: setTemplate", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should navigate to the SSR fixture page", async ({ fastPage, page }) => {
        await fastPage.setTemplate();

        const url = new URL(page.url());
        expect(url.pathname).toMatch(/^\/ssr-.*\.html$/);
        expect(url.pathname).toContain("should_navigate_to_the_ssr_fixture_page");
    });

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

test.describe("SSR: updateTemplate", () => {
    test.use({ tagName: "test-widget", ssr: true });

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

test.describe("SSR: applyTokens", () => {
    test.use({ tagName: "test-widget", ssr: true });

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

test.describe("SSR: waitForCustomElement", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should resolve for a registered element", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await fastPage.waitForCustomElement("test-widget");
    });
});

test.describe("SSR: toHaveCustomState", () => {
    test.use({ tagName: "test-widget", ssr: true });

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

test.describe("SSR: element locator", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should locate the element by tag name", async ({ fastPage }) => {
        await fastPage.setTemplate();

        await expect(fastPage.element).toHaveCount(1);
    });
});

test.describe("SSR: declarative shadow DOM", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should have a shadow root after SSR render", async ({ fastPage }) => {
        await fastPage.setTemplate({ attributes: { label: "DSD" } });

        const hasShadow = await fastPage.element.evaluate(el => el.shadowRoot !== null);
        expect(hasShadow).toBe(true);
    });
});

test.describe("SSR: template placeholder replacement", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should replace the fixture placeholder with rendered component HTML", async ({
        fastPage,
        page,
    }) => {
        await fastPage.setTemplate({ attributes: { label: "test" } });

        const bodyHtml = await page.locator("body").innerHTML();
        expect(bodyHtml).not.toContain("<!--fixture-->");
        expect(bodyHtml).toContain("<test-widget");
    });

    test("should replace the title placeholder with the test title", async ({
        fastPage,
        page,
    }) => {
        await fastPage.setTemplate();

        const title = await page.title();
        expect(title).not.toBe("<!--fixturetitle-->");
        expect(title.length).toBeGreaterThan(0);
    });

    test("should replace the templates placeholder with template content", async ({
        fastPage,
        page,
    }) => {
        await fastPage.setTemplate();

        const bodyHtml = await page.locator("body").innerHTML();
        expect(bodyHtml).not.toContain("<!--templates-->");
    });

    test("should replace the stylespreload placeholder with preload links", async ({
        fastPage,
        page,
    }) => {
        await fastPage.setTemplate();

        const headHtml = await page.locator("head").innerHTML();
        expect(headHtml).not.toContain("<!--stylespreload-->");
        expect(headHtml).toContain("/test-theme.css");
    });

    test("should not contain any unreplaced placeholder comments", async ({
        fastPage,
        page,
    }) => {
        await fastPage.setTemplate();

        const fullHtml = await page.content();
        expect(fullHtml).not.toContain("<!--fixture-->");
        expect(fullHtml).not.toContain("<!--fixturetitle-->");
        expect(fullHtml).not.toContain("<!--templates-->");
        expect(fullHtml).not.toContain("<!--stylespreload-->");
    });
});

test.describe("SSR: addStyleTag buffering", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should include buffered styles in the SSR page", async ({ fastPage, page }) => {
        await fastPage.addStyleTag({
            content: "test-widget { outline: 3px solid blue; }",
        });

        await fastPage.setTemplate();

        const hasStyle = await page.evaluate(() => {
            const styles = document.querySelectorAll("style");
            return Array.from(styles).some(s =>
                s.textContent?.includes("outline: 3px solid blue"),
            );
        });

        expect(hasStyle).toBe(true);
    });

    test("should pass through addStyleTag calls after setTemplate", async ({
        fastPage,
        page,
    }) => {
        await fastPage.setTemplate();

        await fastPage.addStyleTag({
            content: "test-widget { margin: 99px; }",
        });

        const hasStyle = await page.evaluate(() => {
            const styles = document.querySelectorAll("style");
            return Array.from(styles).some(s => s.textContent?.includes("margin: 99px"));
        });

        expect(hasStyle).toBe(true);
    });
});

test.describe("SSR: multiple elements", () => {
    test.use({ tagName: "test-widget", ssr: true });

    test("should handle templates with multiple instances", async ({ fastPage }) => {
        await fastPage.setTemplate(`
            <test-widget label="first">one</test-widget>
            <test-widget label="second">two</test-widget>
        `);

        await expect(fastPage.element).toHaveCount(2);
    });
});
