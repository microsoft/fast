import { expect, test } from "@playwright/test";
import type { RtlScrollConverter as RtlScrollConverterType } from "./rtl-scroll-converter.js";

declare const RtlScrollConverter: typeof RtlScrollConverterType;
test.describe("RtlScrollConverter", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { RtlScrollConverter } from "/dist/rtl-scroll-converter.js";
                globalThis.RtlScrollConverter = RtlScrollConverter;
            `,
        });

        await page.setContent(/* html */ `
            <div
                dir="rtl"
                id="element"
                style="
                    overflow: scroll;
                    width: 100px;
                    height: 100px;
                    outline: 1px solid black;
                    background-color: blue;
                "
            ><div style="
                    width: 200px;
                    height: 200px;
                    background-color: red;
                ">test element</div>
            </div>
        `);

        await page.waitForFunction(() => "RtlScrollConverter" in globalThis);
    });

    test("should not throw on getter", async ({ page }) => {
        const element = page.locator("#element");
        await expect(
            element.evaluate(node => {
                RtlScrollConverter.getScrollLeft(node, "ltr");
            })
        ).resolves.not.toThrow();
    });

    test("should not throw on setter", async ({ page }) => {
        const element = page.locator("#element");

        await expect(
            element.evaluate(node => {
                RtlScrollConverter.setScrollLeft(node, 0, "ltr");
            })
        ).resolves.not.toThrow();
    });

    test("getter and setter start as referencing initial function", async ({ page }) => {
        await test.step("resolved and initial getter functions are the same", async () => {
            const getRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.getRtlScrollLeftConverter.toString()
            );

            const initialGetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.initialGetRtlScrollConverter.toString()
            );

            expect(getRtlScrollLeftConverterAsString).toBe(
                initialGetRtlScrollConverterAsString
            );
        });

        await test.step("resolved and initial setter functions are the same", async () => {
            const setRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.setRtlScrollLeftConverter.toString()
            );

            const initialSetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.initialSetRtlScrollConverter.toString()
            );

            expect(setRtlScrollLeftConverterAsString).toBe(
                initialSetRtlScrollConverterAsString
            );
        });
    });

    test("calling getter with inital function set applies converters", async ({
        page,
    }) => {
        await test.step("getter and setter start as referencing initial function", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter =
                    RtlScrollConverter.initialGetRtlScrollConverter;
            });

            const getRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.getRtlScrollLeftConverter.toString()
            );

            const initialGetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.initialGetRtlScrollConverter.toString()
            );

            expect(getRtlScrollLeftConverterAsString).toBe(
                initialGetRtlScrollConverterAsString
            );

            await page.evaluate(() => {
                RtlScrollConverter.setRtlScrollLeftConverter =
                    RtlScrollConverter.initialSetRtlScrollConverter;
            });

            const setRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.setRtlScrollLeftConverter.toString()
            );

            const initialSetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.initialSetRtlScrollConverter.toString()
            );

            expect(setRtlScrollLeftConverterAsString).toBe(
                initialSetRtlScrollConverterAsString
            );
        });

        await test.step("getter and setter are set to direct converters", async () => {
            const element = page.locator("#element");

            await element.evaluate(node => {
                RtlScrollConverter.getScrollLeft(node, "rtl");
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.directGetRtlScrollConverter.toString()
                )
            );
        });
    });

    test("calling setter with inital function set applies converters", async ({
        page,
    }) => {
        await test.step("getter and setter start as referencing initial function", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter =
                    RtlScrollConverter.initialGetRtlScrollConverter;
            });

            const getRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.getRtlScrollLeftConverter.toString()
            );

            const initialGetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.initialGetRtlScrollConverter.toString()
            );

            expect(getRtlScrollLeftConverterAsString).toBe(
                initialGetRtlScrollConverterAsString
            );

            await page.evaluate(() => {
                RtlScrollConverter.setRtlScrollLeftConverter =
                    RtlScrollConverter.initialSetRtlScrollConverter;
            });

            const setRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.setRtlScrollLeftConverter.toString()
            );

            const initialSetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.initialSetRtlScrollConverter.toString()
            );

            expect(setRtlScrollLeftConverterAsString).toBe(
                initialSetRtlScrollConverterAsString
            );
        });

        await test.step("setter is set to direct converters", async () => {
            const element = page.locator("#element");

            await element.evaluate(node => {
                RtlScrollConverter.setScrollLeft(node, -1, "rtl");
            });

            const setRtlScrollLeftConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.setRtlScrollLeftConverter.toString()
            );

            const directSetRtlScrollConverterAsString = await page.evaluate(() =>
                RtlScrollConverter.directSetRtlScrollConverter.toString()
            );

            expect(setRtlScrollLeftConverterAsString).toBe(
                directSetRtlScrollConverterAsString
            );
        });
    });

    test("`directGetRtlScrollConverter` returns correct value", async ({ page }) => {
        const element = page.locator("#element");

        await expect(element).toHaveAttribute("dir", "rtl");

        await element.evaluate(node => {
            node.scrollLeft = -1;
        });

        expect(
            await element.evaluate(node =>
                RtlScrollConverter.directGetRtlScrollConverter(node)
            )
        ).toBe(-1);
    });

    test("`invertedGetRtlScrollConverter` returns a value <= 0", async ({ page }) => {
        const element = page.locator("#element");

        await expect(element).toHaveAttribute("dir", "rtl");

        await element.evaluate(node => {
            node.scrollLeft = 1;
        });

        expect(
            await element.evaluate(node =>
                RtlScrollConverter.invertedGetRtlScrollConverter(node)
            )
        ).toBeLessThanOrEqual(0);
    });

    test("`reverseGetRtlScrollConverter` returns correct value", async ({ page }) => {
        const element = page.locator("#element");

        await test.step("element is scrolled to 0", async () => {
            const result = await element.evaluate(node =>
                RtlScrollConverter.reverseGetRtlScrollConverter(node)
            );

            const expected = await element.evaluate(
                node => node.scrollLeft - (node.scrollWidth - node.clientWidth)
            );

            expect(result).toBe(expected);
        });

        await test.step("element is scrolled to -1", async () => {
            await element.evaluate(node => {
                node.scrollLeft = -1;
            });

            const result = await element.evaluate(node =>
                RtlScrollConverter.reverseGetRtlScrollConverter(node)
            );

            const expected = await element.evaluate(
                node => -1 - (node.scrollWidth - node.clientWidth)
            );

            expect(result).toBe(expected);
        });
    });

    test("`directSetRtlScrollConverter` applies correct value", async ({ page }) => {
        const element = page.locator("#element");

        await expect(element).toHaveAttribute("dir", "rtl");

        await element.evaluate(node => {
            RtlScrollConverter.directSetRtlScrollConverter(node, -100);
        });

        expect(await element.evaluate(node => node.scrollLeft)).toBe(-100);
    });

    test("`invertedSetRtlScrollConverter` applies correct value", async ({ page }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            node.setAttribute("dir", "ltr");
        });

        await element.evaluate(node => {
            RtlScrollConverter.invertedSetRtlScrollConverter(node, -100);
        });

        expect(await element.evaluate(node => node.scrollLeft)).toBe(100);
    });

    test("`reverseSetRtlScrollConverter` applies correct value", async ({ page }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            RtlScrollConverter.reverseSetRtlScrollConverter(node, -100);
        });

        expect(await element.evaluate(node => node.scrollLeft)).toBe(0);
    });

    test("getter should not adjust value in ltr mode", async ({ page }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            node.scrollLeft = -100;
        });

        await expect(element).toHaveJSProperty("scrollLeft", -100);

        expect(
            await element.evaluate(node => RtlScrollConverter.getScrollLeft(node, "ltr"))
        ).toBe(-100);
    });

    test("setter should not adjust value in ltr mode", async ({ page }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            RtlScrollConverter.setScrollLeft(node, -100, "ltr");
        });

        expect(await element.evaluate(node => node.scrollLeft)).toBe(-100);
    });

    test("generated test element has correct attributes", async ({ page }) => {
        const testElement = page.locator("#test-element");

        await page.evaluate(() => {
            const dummy = RtlScrollConverter.getTestElement();
            dummy.id = "test-element";
            document.body.appendChild(dummy);
        });

        await expect(testElement).toBeAttached();

        await expect(testElement).toHaveAttribute("dir", "rtl");
        await expect(testElement).toHaveCSS("font-size", "14px");
        await expect(testElement).toHaveCSS("width", "4px");
        await expect(testElement).toHaveCSS("height", "1px");
        await expect(testElement).toHaveCSS("position", "absolute");
        await expect(testElement).toHaveCSS("top", "-1000px");
        await expect(testElement).toHaveCSS("overflow", "scroll");
    });

    test("`applyDirectScrollConverters` applies correct converters", async ({ page }) => {
        await test.step("getter and setter start as null", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter = null as any;
                RtlScrollConverter.setRtlScrollLeftConverter = null as any;
            });

            expect(
                await page.evaluate(() => RtlScrollConverter.getRtlScrollLeftConverter)
            ).toBeNull();

            expect(
                await page.evaluate(() => RtlScrollConverter.setRtlScrollLeftConverter)
            ).toBeNull();
        });

        await test.step("`applyDirectScrollConverters` applies correct converters", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.applyDirectScrollConverters();
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).not.toBeNull();

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).not.toBeNull();

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.directGetRtlScrollConverter.toString()
                )
            );

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.directSetRtlScrollConverter.toString()
                )
            );
        });
    });

    test("`applyInvertedScrollConverters` applies correct converters", async ({
        page,
    }) => {
        await test.step("getter and setter start as null", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter = null as any;
                RtlScrollConverter.setRtlScrollLeftConverter = null as any;
            });

            expect(
                await page.evaluate(() => RtlScrollConverter.getRtlScrollLeftConverter)
            ).toBeNull();

            expect(
                await page.evaluate(() => RtlScrollConverter.setRtlScrollLeftConverter)
            ).toBeNull();
        });

        await test.step("`applyInvertedScrollConverters` applies correct converters", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.applyInvertedScrollConverters();
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).not.toBeNull();

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).not.toBeNull();

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.invertedGetRtlScrollConverter.toString()
                )
            );

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.invertedSetRtlScrollConverter.toString()
                )
            );
        });
    });

    test("`applyReverseScrollConverters` applies correct converters", async ({
        page,
    }) => {
        await test.step("getter and setter start as null", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter = null as any;
                RtlScrollConverter.setRtlScrollLeftConverter = null as any;
            });

            expect(
                await page.evaluate(() => RtlScrollConverter.getRtlScrollLeftConverter)
            ).toBeNull();

            expect(
                await page.evaluate(() => RtlScrollConverter.setRtlScrollLeftConverter)
            ).toBeNull();
        });

        await test.step("`applyReverseScrollConverters` applies correct converters", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.applyReverseScrollConverters();
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).not.toBeNull();

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).not.toBeNull();

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.reverseGetRtlScrollConverter.toString()
                )
            );

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.reverseSetRtlScrollConverter.toString()
                )
            );
        });
    });

    test("`isReverse` returns true when provided with an element with a positive scroll value", async ({
        page,
    }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            node.setAttribute("dir", "ltr");
            node.scrollLeft = 1;
        });

        expect(
            await element.evaluate(node =>
                RtlScrollConverter.isReverse(node as HTMLDivElement)
            )
        ).toBe(true);
    });

    test("`isReverse` returns false when provided with an element with a 0 scroll value", async ({
        page,
    }) => {
        const element = page.locator("#element");

        expect(
            await element.evaluate(node =>
                RtlScrollConverter.isReverse(node as HTMLDivElement)
            )
        ).toBe(false);
    });

    test("`isReverse` returns false when provided with an element with a negative scroll value", async ({
        page,
    }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            node.scrollLeft = -1;
        });

        expect(
            await element.evaluate(node =>
                RtlScrollConverter.isReverse(node as HTMLDivElement)
            )
        ).toBe(false);
    });

    test("`isDirect` returns true when provided with an element that accepts a negative scroll value", async ({
        page,
    }) => {
        const element = page.locator("#element");

        expect(
            await element.evaluate(node =>
                RtlScrollConverter.isDirect(node as HTMLDivElement)
            )
        ).toBe(true);
    });

    test("`checkForScrollType` applies reverse converters when provided with an element with a positive scroll value", async ({
        page,
    }) => {
        const element = page.locator("#element");

        await element.evaluate((node: HTMLElement) => {
            node.setAttribute("dir", "ltr");
            node.scrollLeft = 1;
        });

        await test.step("converters are set to null", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter = null as any;
                RtlScrollConverter.setRtlScrollLeftConverter = null as any;
            });

            expect(
                await page.evaluate(() => RtlScrollConverter.getRtlScrollLeftConverter)
            ).toBeNull();

            expect(
                await page.evaluate(() => RtlScrollConverter.setRtlScrollLeftConverter)
            ).toBeNull();
        });

        await test.step("`checkForScrollType` applies reverse converters", async () => {
            await element.evaluate((node: HTMLElement) => {
                RtlScrollConverter.checkForScrollType(node);
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.reverseGetRtlScrollConverter.toString()
                )
            );

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.reverseSetRtlScrollConverter.toString()
                )
            );
        });
    });

    test("`checkForScrollType` applies direct converters when provided with an element with a scroll value of 0 that uses negative values", async ({
        page,
    }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            node.scrollLeft = -1;
        });

        await test.step("converters are set to null", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter = null as any;
                RtlScrollConverter.setRtlScrollLeftConverter = null as any;
            });

            expect(
                await page.evaluate(() => RtlScrollConverter.getRtlScrollLeftConverter)
            ).toBeNull();

            expect(
                await page.evaluate(() => RtlScrollConverter.setRtlScrollLeftConverter)
            ).toBeNull();
        });

        await test.step("`checkForScrollType` applies direct converters", async () => {
            await element.evaluate((node: HTMLElement) => {
                RtlScrollConverter.checkForScrollType(node);
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.directGetRtlScrollConverter.toString()
                )
            );

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.directSetRtlScrollConverter.toString()
                )
            );
        });
    });

    test("`checkForScrollType` applies inverted converters when provided with a scroll value of 0 that uses positive values", async ({
        page,
    }) => {
        const element = page.locator("#element");

        await element.evaluate(node => {
            // node.setAttribute("dir", "ltr");
            node.scrollLeft = 1;

            Object.defineProperty(node, "scrollLeft", {
                get(): number {
                    return this._value;
                },
                set(newValue: number): void {
                    this._value = Math.abs(newValue);
                },
            });
        });

        await test.step("converters are set to null", async () => {
            await page.evaluate(() => {
                RtlScrollConverter.getRtlScrollLeftConverter = null as any;
                RtlScrollConverter.setRtlScrollLeftConverter = null as any;
            });

            expect(
                await page.evaluate(() => RtlScrollConverter.getRtlScrollLeftConverter)
            ).toBeNull();

            expect(
                await page.evaluate(() => RtlScrollConverter.setRtlScrollLeftConverter)
            ).toBeNull();
        });

        await test.step("`checkForScrollType` applies inverted converters", async () => {
            await element.evaluate((node: HTMLElement) => {
                RtlScrollConverter.checkForScrollType(node);
            });

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.getRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.invertedGetRtlScrollConverter.toString()
                )
            );

            expect(
                await page.evaluate(() =>
                    RtlScrollConverter.setRtlScrollLeftConverter.toString()
                )
            ).toBe(
                await page.evaluate(() =>
                    RtlScrollConverter.invertedSetRtlScrollConverter.toString()
                )
            );
        });
    });
});
