import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTHorizontalScroll } from "./horizontal-scroll.js";

test.describe("HorizontalScroll", () => {
    test.describe("Flippers", () => {
        test("should enable the next flipper when content exceeds horizontal-scroll width", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            expect(
                await scrollNext.evaluate(node => node.classList.contains("disabled"))
            ).toBeFalsy();
        });

        test("should hide the next flipper if content is less than horizontal-scroll width", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.querySelectorAll("fast-card:nth-child(n + 5)").forEach(card =>
                    card.remove()
                );
            });

            await expect(scrollNext).toBeHidden();
        });

        test("should disable the previous flipper by default", async ({ page }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollPrevious = element.locator(".scroll-prev");

            expect(
                await scrollPrevious.evaluate(node => node.classList.contains("disabled"))
            ).toBeTruthy();
        });

        test("should enable the previous flipper when content is scrolled", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollPrevious = element.locator(".scroll-prev");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.speed = 0;
                node.scrollToNext();
            });

            expect(
                await scrollPrevious.evaluate(node => node.classList.contains("disabled"))
            ).toBeFalsy();
        });

        test("should disable the previous flipper when scrolled back to the beginning", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollPrevious = element.locator(".scroll-prev");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.speed = 0;
                node.scrollToNext();
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            expect(
                await scrollPrevious.evaluate(node => node.classList.contains("disabled"))
            ).toBeTruthy();
        });

        test("should disable the next flipper when it reaches the end of the content", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.speed = 0;
                node.scrollToNext();
                node.scrollToNext();
                node.scrollToNext();
                node.scrollToNext();
            });

            expect(
                await scrollNext.evaluate(node => node.classList.contains("disabled"))
            ).toBeTruthy();
        });

        test("should re-enable the next flipper when its scrolled back from the end", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.speed = 0;
                node.scrollToNext();
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
                node.scrollToNext();
                node.scrollToNext();
                node.scrollToPrevious();
            });

            expect(
                await scrollNext.evaluate(node => node.classList.contains("disabled"))
            ).toBeFalsy();
        });

        test("should disable the next flipper when it's scrolled back from the end and scrolled forward", async ({
            page,
        }) => {
            await page.goto(fixtureURL("horizontal-scroll--horizontal-scroll"));

            const element = page.locator("fast-horizontal-scroll");

            const scrollNext = element.locator(".scroll-next");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.speed = 0;
                node.scrollToNext();
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            expect(
                await scrollNext.evaluate(node => node.classList.contains("disabled"))
            ).toBeTruthy();

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            expect(
                await scrollNext.evaluate(node => node.classList.contains("disabled"))
            ).toBeFalsy();

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            expect(
                await scrollNext.evaluate(node => node.classList.contains("disabled"))
            ).toBeTruthy();
        });
    });

    test.describe("Scrolling", () => {
        test("should start in the 0 position", async ({ page }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            expect(
                await element.locator(".scroll-view").evaluate(node => node.scrollLeft)
            ).toBe(0);
        });

        test("should scroll to the beginning of the last element in full view", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 375);
        });

        test("should not scroll past the beginning", async ({ page }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should not scroll past the last in view element", async ({ page }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const cards = element.locator("fast-card");

            const scrollView = element.locator(".scroll-view");

            await element.evaluate((node: FASTHorizontalScroll) => {
                const scrollView = (node.shadowRoot as ShadowRoot).querySelector(
                    ".scroll-view"
                ) as HTMLElement;

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

        test("should change scroll stop on resize", async ({ page }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const flippers = element.locator("fast-flipper");

            const previousFlipper = flippers.nth(0);

            const nextFlipper = flippers.nth(1);

            const scrollView = element.locator(".scroll-view");

            await nextFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 375);

            await previousFlipper.click();

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.style.setProperty("max-width", "400px");
            });

            await nextFlipper.click();

            await expect(scrollView).toHaveJSProperty("scrollLeft", 250);
        });

        test("should scroll to previous when only 2 items wide", async ({ page }) => {
            test.slow();
            await page.setViewportSize({ width: 250, height: 250 });

            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToNext();
            });

            await expect(await scrollView.evaluate(node => node.scrollLeft)).toBe(125);

            await element.evaluate((node: FASTHorizontalScroll) => {
                node.scrollToPrevious();
            });

            await expect(scrollView).toHaveJSProperty("scrollLeft", 0);
        });

        test("should scroll item into view when using `scrollInView()`", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("horizontal-scroll--horizontal-scroll", { speed: 0 })
            );

            const element = page.locator("fast-horizontal-scroll");

            const scrollView = element.locator(".scroll-view");

            const cards = element.locator("fast-card");

            const lastCard = cards.last();

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

            await expect(scrollView).toHaveJSProperty("scrollLeft", 1375);

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
