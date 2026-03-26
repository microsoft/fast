import { expect, test } from "@playwright/test";

const FIXTURE_URL = "/fixtures/template-modules/";

/**
 * Waits for the element with the given name to be defined and rendered.
 * Elements defined via defineAsync are upgraded only after their template is
 * assigned, so we wait for the elementDidDefine lifecycle callback to fire.
 */
async function waitForElement(page: any, name: string) {
    await page.waitForFunction(
        (n: string) => (window as any).definedElements?.[n] === true,
        name,
    );
}

test.describe("template-modules: multi-element <f-template>", () => {
    test("renders two simple element templates from a single <f-template>", async ({
        page,
    }) => {
        await page.goto(FIXTURE_URL);

        await waitForElement(page, "tm-simple-a");
        await waitForElement(page, "tm-simple-b");

        const elA = page.locator("tm-simple-a");
        const elB = page.locator("tm-simple-b");

        await expect(elA).toHaveText("Hello from A");
        await expect(elB).toHaveText("Hello from B");
    });

    test("updates binding when attribute changes on simple element", async ({ page }) => {
        await page.goto(FIXTURE_URL);

        await waitForElement(page, "tm-simple-a");

        const elA = page.locator("tm-simple-a");
        await expect(elA).toHaveText("Hello from A");

        await page.evaluate(() => {
            document.querySelector("tm-simple-a")?.setAttribute("text", "Updated value");
        });

        await expect(elA).toHaveText("Updated value");
    });

    test("inlines a shared partial template into the element template", async ({
        page,
    }) => {
        await page.goto(FIXTURE_URL);

        await waitForElement(page, "tm-with-partial");

        const el = page.locator("tm-with-partial");

        // Both the inlined partial content (h2 with title) and the element's own
        // content (p with description) should be visible.
        await expect(el).toContainText("Shared Title");
        await expect(el).toContainText("Partial Description");
    });

    test("partial title binding updates when attribute changes", async ({ page }) => {
        await page.goto(FIXTURE_URL);

        await waitForElement(page, "tm-with-partial");

        const el = page.locator("tm-with-partial");
        await expect(el).toContainText("Shared Title");

        await page.evaluate(() => {
            document.querySelector("tm-with-partial")?.setAttribute("title", "New Title");
        });

        await expect(el).toContainText("New Title");
    });

    test("two sibling elements share the same partial without interfering", async ({
        page,
    }) => {
        await page.goto(FIXTURE_URL);

        await waitForElement(page, "tm-sibling-a");
        await waitForElement(page, "tm-sibling-b");

        const elA = page.locator("tm-sibling-a");
        const elB = page.locator("tm-sibling-b");

        // Each element has its own title (from the inlined partial) and note.
        await expect(elA).toContainText("Sibling A");
        await expect(elA).toContainText("Note from A");

        await expect(elB).toContainText("Sibling B");
        await expect(elB).toContainText("Note from B");
    });

    test("sibling elements update independently after attribute changes", async ({
        page,
    }) => {
        await page.goto(FIXTURE_URL);

        await waitForElement(page, "tm-sibling-a");
        await waitForElement(page, "tm-sibling-b");

        await page.evaluate(() => {
            document.querySelector("tm-sibling-a")?.setAttribute("title", "Updated A");
            document.querySelector("tm-sibling-b")?.setAttribute("title", "Updated B");
        });

        const elA = page.locator("tm-sibling-a");
        const elB = page.locator("tm-sibling-b");

        // Changing one element's attribute must not affect the other.
        await expect(elA).toContainText("Updated A");
        await expect(elA).toContainText("Note from A");

        await expect(elB).toContainText("Updated B");
        await expect(elB).toContainText("Note from B");
    });
});
