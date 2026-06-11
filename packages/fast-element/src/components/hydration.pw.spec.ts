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

    test("should skip hydrating subsequent batches by default after hydration completes", async ({
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

            async function appendPrerenderedElement(includeServerMarker = false) {
                const container = document.createElement("div");
                document.body.appendChild(container);
                (container as any).setHTMLUnsafe(
                    `<${name}><template shadowrootmode="open"><span${
                        includeServerMarker ? ' data-server-marker="true"' : ""
                    }>hydrated</span></template></${name}>`,
                );

                const element = container.firstElementChild as any;
                customElements.upgrade(container);
                for (let i = 0; element.$fastController === void 0 && i < 10; i++) {
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                const isHydrated = await element.$fastController.isHydrated;
                const serverMarker = element.shadowRoot
                    ?.querySelector("span")
                    ?.getAttribute("data-server-marker");
                await new Promise(resolve => setTimeout(resolve, 0));

                return { isHydrated, serverMarker };
            }

            const first = await appendPrerenderedElement();
            const second = await appendPrerenderedElement(true);

            return { events, first, second };
        });

        expect(result.events).toEqual(["start", "complete"]);
        expect(result.first.isHydrated).toBe(true);
        expect(result.second.isHydrated).toBe(false);
        expect(result.second.serverMarker).toBeNull();
    });

    test("should keep hydration active for subsequent batches when configured", async ({
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
                StopHydration,
                uniqueElementName,
            } = await import("/main.js");

            const events: string[] = [];
            const name = uniqueElementName();

            enableHydration({
                stopHydration: StopHydration.never,
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
                customElements.upgrade(container);
                for (let i = 0; element.$fastController === void 0 && i < 10; i++) {
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                const isHydrated = await element.$fastController.isHydrated;
                await new Promise(resolve => setTimeout(resolve, 0));

                return isHydrated;
            }

            const first = await appendPrerenderedElement();
            const second = await appendPrerenderedElement();

            return {
                events,
                first,
                second,
                stopHydrationValues: {
                    hydrationComplete: StopHydration.hydrationComplete,
                    never: StopHydration.never,
                },
            };
        });

        expect(result.events).toEqual(["start", "complete", "start", "complete"]);
        expect(result.first).toBe(true);
        expect(result.second).toBe(true);
        expect(result.stopHydrationValues).toEqual({
            hydrationComplete: "hydration-complete",
            never: "never",
        });
    });
});
