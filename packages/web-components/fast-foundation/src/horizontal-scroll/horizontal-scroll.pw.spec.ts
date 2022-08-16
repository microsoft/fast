import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTHorizontalScroll } from "./horizontal-scroll.js";

test.describe("HorizontalScroll", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    let cards: Locator;
    let scrollNext: Locator;
    let scrollPrevious: Locator;
    let scrollView: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-horizontal-scroll");

        root = page.locator("#root");

        cards = element.locator("fast-card");

        scrollNext = element.locator(".scroll-next");

        scrollPrevious = element.locator(".scroll-previous");

        scrollView = element.locator(".scroll-view");

        await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

        await element.evaluate((node: FASTHorizontalScroll) => {
            node.speed = 0;
        });
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe("Flippers", () => {
        test.beforeEach(async () => {
            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPosition(0);
            });
        });

        test("should enable the next flipper element when content exceeds horizontal-scroll width", async () => {
            await expect(scrollNext).not.toHaveClass(/disabled/);
        });

        test("should start in the 0 position", async () => {
            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should scroll to the beginning of the last element in full view", async () => {
            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 379);
        });

        test("should not scroll past the beginning", async () => {
            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should not scroll past the last in view element", async () => {
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

        test('should set the "disabled" class on the previous flipper when the scroll position is at the beginning of the content', async () => {
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

        test('should set the "disabled" class on the next flipper when the scroll position is at the end of the content', async () => {
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
    });

    test("should hide the next flipper if content is less than horizontal-scroll width", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-horizontal-scroll style="width: 1000px;">
                    <fast-card style="width: 100px;"></fast-card>
                </fast-horizontal-scroll>
            `;
        });

        const element = page.locator("fast-horizontal-scroll");

        const scrollNext = element.locator(".scroll-next");

        await expect(scrollNext).toBeHidden();
    });

    test.describe("Scrolling", () => {
        test("should change scroll stop on resize", async () => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const flippers = element.locator("fast-flipper");

            const previousFlipper = flippers.nth(0);

            const nextFlipper = flippers.nth(1);

            const scrollView = element.locator(".scroll-view");

            await nextFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 379);

            await previousFlipper.click();

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.style.setProperty("max-width", "400px");
            });

            await nextFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 254);
        });

        test("should scroll to previous when only 2 items wide", async ({ page }) => {
            await page.setViewportSize({ width: 250, height: 250 });

            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 129);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should scroll item into view when the `scrollInView()` method is invoked", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            cards = element.locator("fast-card");

            const lastCard = cards.last();

            await element.evaluate((node: FASTHorizontalScroll, card) => {
                node.scrollInView(card as HTMLElement, 0);
            }, await lastCard.elementHandle());

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1383);

            await expect(lastCard).toHaveJSProperty("offsetLeft", 1875);

            await expect(lastCard).toHaveJSProperty("offsetWidth", 120);

            await expect(element).toHaveJSProperty("offsetWidth", 620);
        });

        test("Should scroll item into view with `scrollInView()` by index", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            const cards = element.locator("fast-card");

            const lastCard = cards.last();

            await element.evaluate((node: FASTHorizontalScroll, cardsCount) => {
                node.scrollInView(cardsCount - 1, 0);
            }, await cards.count());

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1383);

            await expect(lastCard).toHaveJSProperty("offsetLeft", 1875);

            await expect(lastCard).toHaveJSProperty("offsetWidth", 120);

            await expect(element).toHaveJSProperty("offsetWidth", 620);
        });

        test("Should scroll item into view respecting right and left padding", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            const cards = element.locator("fast-card");

            const thirdLastCard = cards.nth(-4);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(12, 0);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1129);

            await expect(thirdLastCard).toHaveJSProperty("offsetLeft", 1500);

            await expect(thirdLastCard).toHaveJSProperty("offsetWidth", 120);

            await expect(element).toHaveJSProperty("offsetWidth", 620);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(12, 80);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1129);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(12, 0, 200);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1254);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(2, 20);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 129);
        });

        test("Should not scroll with `scrollInView()` when the item is in view", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollInView(2);
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });
    });
});
