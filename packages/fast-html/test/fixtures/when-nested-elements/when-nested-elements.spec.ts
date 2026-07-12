import { expect, test } from "@playwright/test";

/**
 * A `defer-and-hydrate` child rendered inside a conditional content binding must
 * hydrate exactly as it does inside a repeat binding. Swapping the surrounding
 * control-flow directive should be the only difference between the two cases.
 *
 * See https://github.com/microsoft/fast/issues/7634.
 */
test.describe("When Nested Elements Hydration", () => {
    async function hydrate(page: import("@playwright/test").Page) {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/when-nested-elements/");
        await hydrationCompleted;
    }

    for (const parent of ["when-parent", "repeat-parent"]) {
        test.describe(parent, () => {
            test("should hydrate the deferred child", async ({ page }) => {
                await hydrate(page);

                const child = page.locator(`${parent} deferred-child`);

                await expect(child).toHaveCount(1);
                await expect(child).not.toHaveAttribute("defer-hydration");
                await expect(child).not.toHaveAttribute("needs-hydration");
            });

            test("should render the deferred child's bindings", async ({ page }) => {
                await hydrate(page);

                await expect(page.locator(`${parent} deferred-child .text`)).toHaveText(
                    "Hello",
                );
            });

            test("should keep the deferred child's bindings live after hydration", async ({
                page,
            }) => {
                await hydrate(page);

                await page.locator(`${parent} deferred-child`).evaluate(node => {
                    (node as any).text = "Updated";
                });

                await expect(page.locator(`${parent} deferred-child .text`)).toHaveText(
                    "Updated",
                );
            });
        });
    }

    /**
     * The pre-rendered DOM contains the child, but the value backing the binding has
     * not resolved by the time the element hydrates. Both directives must reconcile
     * the pre-rendered content away, and neither may leave it behind as an inert,
     * un-hydrated subtree.
     */
    for (const [parent, resolve] of [
        ["when-stale-parent", (node: any) => (node.show = true)],
        ["repeat-stale-parent", (node: any) => (node.items = [{ text: "Hello" }])],
    ] as const) {
        test.describe(parent, () => {
            test("should render exactly one hydrated child once the value resolves", async ({
                page,
            }) => {
                await hydrate(page);

                await page.locator(parent).evaluate(resolve);

                const child = page.locator(`${parent} deferred-child`);

                await expect(child).toHaveCount(1);
                await expect(child).not.toHaveAttribute("defer-hydration");
                await expect(child).not.toHaveAttribute("needs-hydration");
                await expect(page.locator(`${parent} deferred-child .text`)).toHaveText(
                    "Hello",
                );
            });
        });
    }

    test.describe("when-stale-parent", () => {
        test("should discard the prerendered content it cannot adopt", async ({
            page,
        }) => {
            await hydrate(page);

            // The conditional content binding cannot adopt the prerendered child, so it
            // must reconcile it away rather than leave it in the DOM owned by no view.
            await expect(page.locator("when-stale-parent deferred-child")).toHaveCount(0);
        });
    });
});
