import { expect, test } from "@playwright/test";

test.describe("CSSBindingDirective", () => {
    test("sets the model's value to the specified property on the host", async ({
        page,
    }) => {
        await page.goto("/");

        const { cssVar1Value, cssVar2Value } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                attr,
                css,
                fixture,
                uniqueElementName,
                Updates,
                Observable,
                CSSBindingDirective,
            } = await import("/main.js");

            const name = uniqueElementName();
            const styles = css`
                .foo {
                    color: ${(x: any) => x.color};
                }
                .bar {
                    height: ${(x: any) => x.size};
                }
            `;
            const cssVar1 = (styles.behaviors![0] as typeof CSSBindingDirective)
                .targetAspect;
            const cssVar2 = (styles.behaviors![1] as typeof CSSBindingDirective)
                .targetAspect;

            class TestComponent extends FASTElement {
                color!: string;
                size!: string;
            }

            Observable.defineProperty(TestComponent.prototype, "color");
            attr(TestComponent.prototype, "size");

            TestComponent.define({
                name,
                styles,
            });

            const { connect, disconnect, element } = await fixture(name);

            await connect();

            element.color = "red";
            element.size = "300px";

            await Updates.next();

            const cssVar1Value = element.style.getPropertyValue(cssVar1);
            const cssVar2Value = element.style.getPropertyValue(cssVar2);

            await disconnect();

            return { cssVar1Value, cssVar2Value };
        });

        expect(cssVar1Value).toBe("red");
        expect(cssVar2Value).toBe("300px");
    });

    test("updates the specified property on the host when the model value changes", async ({
        page,
    }) => {
        await page.goto("/");

        const {
            initialColor,
            initialSize,
            afterColorChange,
            afterColorChangeSize,
            afterSizeChange,
            afterSizeChangeColor,
            afterResetColor,
            afterResetSize,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                attr,
                css,
                fixture,
                uniqueElementName,
                Updates,
                Observable,
                CSSBindingDirective,
            } = await import("/main.js");

            const name = uniqueElementName();
            const styles = css`
                .foo {
                    color: ${(x: any) => x.color};
                }
                .bar {
                    height: ${(x: any) => x.size};
                }
            `;
            const cssVar1 = (styles.behaviors![0] as typeof CSSBindingDirective)
                .targetAspect;
            const cssVar2 = (styles.behaviors![1] as typeof CSSBindingDirective)
                .targetAspect;

            class TestComponent extends FASTElement {
                color!: string;
                size!: string;
            }

            Observable.defineProperty(TestComponent.prototype, "color");
            attr(TestComponent.prototype, "size");

            TestComponent.define({
                name,
                styles,
            });

            const { connect, disconnect, element } = await fixture(name);

            await connect();

            element.color = "red";
            element.size = "300px";

            await Updates.next();

            const initialColor = element.style.getPropertyValue(cssVar1);
            const initialSize = element.style.getPropertyValue(cssVar2);

            element.color = "blue";

            await Updates.next();

            const afterColorChange = element.style.getPropertyValue(cssVar1);
            const afterColorChangeSize = element.style.getPropertyValue(cssVar2);

            element.size = "400px";

            await Updates.next();

            const afterSizeChangeColor = element.style.getPropertyValue(cssVar1);
            const afterSizeChange = element.style.getPropertyValue(cssVar2);

            element.color = "red";
            element.size = "300px";

            await Updates.next();

            const afterResetColor = element.style.getPropertyValue(cssVar1);
            const afterResetSize = element.style.getPropertyValue(cssVar2);

            await disconnect();

            return {
                initialColor,
                initialSize,
                afterColorChange,
                afterColorChangeSize,
                afterSizeChange,
                afterSizeChangeColor,
                afterResetColor,
                afterResetSize,
            };
        });

        expect(initialColor).toBe("red");
        expect(initialSize).toBe("300px");
        expect(afterColorChange).toBe("blue");
        expect(afterColorChangeSize).toBe("300px");
        expect(afterSizeChangeColor).toBe("blue");
        expect(afterSizeChange).toBe("400px");
        expect(afterResetColor).toBe("red");
        expect(afterResetSize).toBe("300px");
    });

    test("updates the specified property on the host when the styles change via setAttribute", async ({
        page,
    }) => {
        await page.goto("/");

        const {
            afterChangeColor,
            afterChangeSize,
            afterSetAttrColor,
            afterSetAttrSize,
            afterSetAttrBackground,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                attr,
                css,
                fixture,
                uniqueElementName,
                Updates,
                Observable,
                CSSBindingDirective,
            } = await import("/main.js");

            const name = uniqueElementName();
            const styles = css`
                .foo {
                    color: ${(x: any) => x.color};
                }
                .bar {
                    height: ${(x: any) => x.size};
                }
            `;
            const cssVar1 = (styles.behaviors![0] as typeof CSSBindingDirective)
                .targetAspect;
            const cssVar2 = (styles.behaviors![1] as typeof CSSBindingDirective)
                .targetAspect;

            class TestComponent extends FASTElement {
                color!: string;
                size!: string;
            }

            Observable.defineProperty(TestComponent.prototype, "color");
            attr(TestComponent.prototype, "size");

            TestComponent.define({
                name,
                styles,
            });

            const { connect, disconnect, element } = await fixture(name);

            await connect();

            element.color = "red";
            element.size = "300px";

            await Updates.next();

            element.color = "blue";
            element.size = "400px";

            await Updates.next();

            const afterChangeColor = element.style.getPropertyValue(cssVar1);
            const afterChangeSize = element.style.getPropertyValue(cssVar2);

            element.setAttribute("style", "background: red");

            const afterSetAttrColor = element.style.getPropertyValue(cssVar1);
            const afterSetAttrSize = element.style.getPropertyValue(cssVar2);
            const afterSetAttrBackground = element.style.getPropertyValue("background");

            await disconnect();

            return {
                afterChangeColor,
                afterChangeSize,
                afterSetAttrColor,
                afterSetAttrSize,
                afterSetAttrBackground,
            };
        });

        expect(afterChangeColor).toBe("blue");
        expect(afterChangeSize).toBe("400px");
        expect(afterSetAttrColor).toBe("blue");
        expect(afterSetAttrSize).toBe("400px");
        expect(afterSetAttrBackground).toBe("red");
    });
});
