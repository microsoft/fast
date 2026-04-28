import { expect, test } from "@playwright/test";

test.describe("The prerendered content optimization", () => {
    test("should set isPrerendered to false when no existing shadow root is present (CSR)", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                await import("/main.js");

            const name = uniqueElementName();
            (
                await FASTElementDefinition.compose(
                    class TestElement extends FASTElement {
                        static definition = {
                            name,
                            template: html`<span>hello</span>`,
                        };
                    },
                )
            ).define();

            const element = document.createElement(name) as any;
            document.body.appendChild(element);

            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                isPrerendered: await element.$fastController.isPrerendered,
                isHydrated: await element.$fastController.isHydrated,
                shadowContent: element.shadowRoot?.innerHTML ?? "",
            };
        });

        expect(result.isPrerendered).toBe(false);
        expect(result.isHydrated).toBe(false);
        expect(result.shadowContent).toContain("hello");
    });

    test("should detect DSD but not hydrate when hydration is not enabled", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                await import("/main.js");

            const name = uniqueElementName();

            // Create element with DSD via setHTMLUnsafe BEFORE defining
            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(
                `<${name}><template shadowrootmode="open"><span>prerendered</span></template></${name}>`,
            );
            const element = container.firstElementChild as any;
            const hasShadowRootBefore = !!element.shadowRoot;

            // Define without enabling hydration — falls back to client-side render
            (
                await FASTElementDefinition.compose(
                    class TestElement extends FASTElement {
                        static definition = {
                            name,
                            template: html`<span>hello</span>`,
                        };
                    },
                )
            ).define();

            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                hasShadowRootBefore,
                isPrerendered: await element.$fastController.isPrerendered,
                isHydrated: await element.$fastController.isHydrated,
            };
        });

        expect(result.hasShadowRootBefore).toBe(true);
        // DSD exists, so isPrerendered is true
        expect(result.isPrerendered).toBe(true);
        // Without enableHydration(), content is not hydrated
        expect(result.isHydrated).toBe(false);
    });

    test("should connect immediately when a template is assigned later", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                await import("/main.js");

            const name = uniqueElementName();

            class TestElement extends FASTElement {
                static definition = {
                    name,
                };
            }

            const definition = await FASTElementDefinition.compose(TestElement);
            definition.define();

            const element = document.createElement(name) as any;
            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            const isConnectedBefore = element.$fastController.isConnected;

            definition.template = html`<span>hello</span>`;
            await new Promise(resolve => requestAnimationFrame(resolve));

            const isConnectedAfter = element.$fastController.isConnected;

            return {
                isConnectedBefore,
                isConnectedAfter,
            };
        });

        expect(result.isConnectedBefore).toBe(true);
        expect(result.isConnectedAfter).toBe(true);
    });

    test("should render normally when no existing shadow root is present", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                html,
                observable,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();

            class TestElement extends FASTElement {
                label: string = "default";
                static definition = {
                    name,
                    template: html<TestElement>`<span>${x => x.label}</span>`,
                };
            }
            (TestElement as any).label = undefined;
            (observable as any)(TestElement.prototype, "label");

            (await FASTElementDefinition.compose(TestElement)).define();

            const element = document.createElement(name) as any;
            element.label = "CSR rendered";
            document.body.appendChild(element);

            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                isPrerendered: await element.$fastController.isPrerendered,
                shadowContent: element.shadowRoot?.textContent ?? "",
            };
        });

        expect(result.isPrerendered).toBe(false);
        expect(result.shadowContent).toContain("CSR rendered");
    });

    test("should fire global hydration callbacks for subsequent batches", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                uniqueElementName,
            } = await import("/main.js");

            const events: string[] = [];
            const name = uniqueElementName();

            enableHydration({
                hydrationStarted() {
                    events.push("start");
                },
                hydrationComplete() {
                    events.push("complete");
                },
            });

            (
                await FASTElementDefinition.compose(
                    class TestElement extends FASTElement {
                        static definition = {
                            name,
                            template: html`<span>hydrated</span>`,
                        };
                    },
                )
            ).define();

            async function appendPrerenderedElement() {
                const container = document.createElement("div");
                document.body.appendChild(container);
                (container as any).setHTMLUnsafe(
                    `<${name}><template shadowrootmode="open"><span>hydrated</span></template></${name}>`,
                );

                const element = container.firstElementChild as any;
                await element.$fastController.isHydrated;
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            await appendPrerenderedElement();
            await appendPrerenderedElement();

            return events;
        });

        expect(result).toEqual(["start", "complete", "start", "complete"]);
    });
});
