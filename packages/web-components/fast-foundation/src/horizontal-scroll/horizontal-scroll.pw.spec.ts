import { expect, test } from "@playwright/test";
import type { FASTHorizontalScroll } from "./horizontal-scroll.js";

test.describe("HorizontalScroll", () => {
    test.describe("Flippers", () => {
        test("should enable the next flipper element when content exceeds horizontal-scroll width", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll style="width: 1000px;">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await expect(scrollNext).not.toHaveClass(/disabled/);
        });

        test("should start in the 0 position", async ({ page }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should scroll to the beginning of the last element in full view", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const cards = element.locator("fast-card");

            const scrollNext = element.locator(".scroll-next");

            const scrollPrevious = element.locator(".scroll-prev");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 375);
        });

        test("should not scroll past the beginning", async ({ page }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should not scroll past the last in view element", async ({ page }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const cards = element.locator("fast-card");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await (await element.elementHandle())?.waitForElementState("stable");

            await element.evaluate((node: FASTHorizontalScroll) => {
                const scrollView = node.shadowRoot?.querySelector(".scroll-view");

                if (!scrollView) {
                    test.fail();
                    return;
                }

                while (
                    scrollView.scrollLeft + scrollView.clientWidth <
                    scrollView.scrollWidth
                ) {
                    node.scrollToNext();
                }

                node.scrollToNext();
            });

            const scrollViewLeft = await scrollView.evaluate(node => node.scrollLeft);

            expect(scrollViewLeft).toBeLessThan(
                await cards.last().evaluate((node: HTMLElement) => node.offsetLeft)
            );
        });

        test('should set the "disabled" class on the previous flipper when the scroll position is at the beginning of the content', async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const cards = element.locator("fast-card");

            const scrollNext = element.locator(".scroll-next");

            const scrollPrevious = element.locator(".scroll-prev");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await expect(scrollPrevious).toHaveClass(/disabled/);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(scrollPrevious).not.toHaveClass(/disabled/);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPosition(0);
            });

            await expect(scrollPrevious).toHaveClass(/disabled/);
        });

        test('should set the "disabled" class on the next flipper when the scroll position is at the end of the content', async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const cards = element.locator("fast-card");

            const scrollNext = element.locator(".scroll-next");

            const scrollPrevious = element.locator(".scroll-prev");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await expect(scrollNext).not.toHaveClass(/disabled/);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPosition(node.scrollContainer.scrollWidth);
            });

            await expect(scrollNext).toHaveClass(/disabled/);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollNext).not.toHaveClass(/disabled/);
        });

        test("should hide the next flipper if content is less than horizontal-scroll width", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll style="width: 1000px;">
                        <fast-card style="width: 100px;"></fast-card>
                    </fast-horizontal-scroll>
                `;
            });

            await expect(scrollNext).toBeHidden();
        });
    });

    test.describe("Scrolling", () => {
        test("should change scroll stop on resize", async ({ page }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            const flippers = element.locator("fast-flipper");

            const previousFlipper = flippers.nth(0);

            const nextFlipper = flippers.nth(1);

            await nextFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 375);

            await previousFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.style.setProperty("max-width", "400px");
            });

            await nextFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 250);
        });

        test("should scroll to previous when only 2 items wide", async ({ page }) => {
            await page.setViewportSize({ width: 250, height: 250 });

            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 125);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should scroll item into view when the `scrollInView()` method is invoked", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            const cards = element.locator("fast-card");

            const lastCard = cards.last();

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await element.evaluate((node: FASTHorizontalScroll, card) => {
                node.scrollInView(card as HTMLElement, 0);
            }, await lastCard.elementHandle());

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1375);

            await expect(lastCard).toHaveJSProperty("offsetLeft", 1875);

            await expect(lastCard).toHaveJSProperty("offsetWidth", 120);

            await expect(element).toHaveJSProperty("offsetWidth", 620);
        });

        test("Should scroll item into view with `scrollInView()` by index", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            const cards = element.locator("fast-card");

            const lastCard = cards.last();

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await element.evaluate((node: FASTHorizontalScroll, cardsCount) => {
                node.scrollInView(cardsCount - 1, 0);
            }, await cards.count());

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1375);

            await expect(lastCard).toHaveJSProperty("offsetLeft", 1875);

            await expect(lastCard).toHaveJSProperty("offsetWidth", 120);

            await expect(element).toHaveJSProperty("offsetWidth", 620);
        });

        test("Should scroll item into view respecting right and left padding", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            const cards = element.locator("fast-card");

            const thirdLastCard = cards.nth(-4);

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(12, 0);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1125);

            await expect(thirdLastCard).toHaveJSProperty("offsetLeft", 1500);

            await expect(thirdLastCard).toHaveJSProperty("offsetWidth", 120);

            await expect(element).toHaveJSProperty("offsetWidth", 620);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(12, 80);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1125);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(12, 0, 200);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1250);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(2, 20);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 125);
        });

        test("Should not scroll with `scrollInView()` when the item is in view", async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-horizontal-scroll speed="0">
                    ${[...Array(16)]
                        .map((_, i) => /* html */ `<fast-card>card ${i + 1}</fast-card>`)
                        .join("")}
                    </fast-horizontal-scroll>
                `;
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(2);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });
    });
});
