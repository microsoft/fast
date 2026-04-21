import { expect, test } from "@playwright/test";

test.describe("The fixture helper", () => {
    test("can create a fixture for an element by name", async ({ page }) => {
        await page.goto("/");

        const isCorrectInstance = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                attr,
                html,
                fixture,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();

            class MyElement extends FASTElement {}

            attr(MyElement.prototype, "value");

            (
                await FASTElementDefinition.compose(
                    class extends MyElement {
                        static definition = {
                            name,
                            template: html`
                            ${(x: any) => x.value}
                            <slot></slot>
                        `,
                        };
                    },
                )
            ).define();

            const { element } = await fixture(name);
            return element instanceof MyElement;
        });

        expect(isCorrectInstance).toBe(true);
    });

    test("can create a fixture for an element by template", async ({ page }) => {
        await page.goto("/");

        const { isCorrectInstance, innerText } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                attr,
                html,
                fixture,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();

            class MyElement extends FASTElement {}

            attr(MyElement.prototype, "value");

            (
                await FASTElementDefinition.compose(
                    class extends MyElement {
                        static definition = {
                            name,
                            template: html`
                            ${(x: any) => x.value}
                            <slot></slot>
                        `,
                        };
                    },
                )
            ).define();

            const tag = html.partial(name);
            const { element } = (await fixture(html`
                <${tag}>
                    Some content here.
                </${tag}>
            `)) as { element: any };

            return {
                isCorrectInstance: element instanceof MyElement,
                innerText: element.innerText.trim(),
            };
        });

        expect(isCorrectInstance).toBe(true);
        expect(innerText).toBe("Some content here.");
    });

    test("can connect an element", async ({ page }) => {
        await page.goto("/");

        const { beforeConnect, afterConnect } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                attr,
                html,
                fixture,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();

            class MyElement extends FASTElement {}

            attr(MyElement.prototype, "value");

            (
                await FASTElementDefinition.compose(
                    class extends MyElement {
                        static definition = {
                            name,
                            template: html`
                            ${(x: any) => x.value}
                            <slot></slot>
                        `,
                        };
                    },
                )
            ).define();

            const { element, connect } = await fixture(name);
            const beforeConnect = element.isConnected;

            await connect();
            const afterConnect = element.isConnected;

            document.body.removeChild(element.parentElement!);
            return { beforeConnect, afterConnect };
        });

        expect(beforeConnect).toBe(false);
        expect(afterConnect).toBe(true);
    });

    test("can disconnect an element", async ({ page }) => {
        await page.goto("/");

        const { beforeConnect, afterConnect, afterDisconnect } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    attr,
                    html,
                    fixture,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();

                class MyElement extends FASTElement {}

                attr(MyElement.prototype, "value");

                (
                    await FASTElementDefinition.compose(
                        class extends MyElement {
                            static definition = {
                                name,
                                template: html`
                                ${(x: any) => x.value}
                                <slot></slot>
                            `,
                            };
                        },
                    )
                ).define();

                const { element, connect, disconnect } = await fixture(name);
                const beforeConnect = element.isConnected;

                await connect();
                const afterConnect = element.isConnected;

                await disconnect();
                const afterDisconnect = element.isConnected;

                return { beforeConnect, afterConnect, afterDisconnect };
            },
        );

        expect(beforeConnect).toBe(false);
        expect(afterConnect).toBe(true);
        expect(afterDisconnect).toBe(false);
    });

    test("can bind an element to data", async ({ page }) => {
        await page.goto("/");

        const { initialMatch, afterChangeMatch } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                attr,
                Observable,
                html,
                fixture,
                Updates,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();

            class MyElement extends FASTElement {}

            attr(MyElement.prototype, "value");

            (
                await FASTElementDefinition.compose(
                    class extends MyElement {
                        static definition = {
                            name,
                            template: html`
                            ${(x: any) => x.value}
                            <slot></slot>
                        `,
                        };
                    },
                )
            ).define();

            class MyModel {
                value = "different value";
            }
            Observable.defineProperty(MyModel.prototype, "value");

            const source = new MyModel();
            const tag = html.partial(name);
            const { element, disconnect } = (await fixture(
                html`
                    <${tag} value=${(x: any) => x.value}></${tag}>
                `,
                { source },
            )) as { element: any; disconnect: () => Promise<void> };

            const initialMatch = element.value === source.value;

            source.value = "something else";
            await Updates.next();
            const afterChangeMatch = element.value === source.value;

            await disconnect();
            return { initialMatch, afterChangeMatch };
        });

        expect(initialMatch).toBe(true);
        expect(afterChangeMatch).toBe(true);
    });
});
