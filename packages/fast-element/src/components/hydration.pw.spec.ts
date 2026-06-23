import { expect, test } from "@playwright/test";

test.describe("The prerendered content optimization", () => {
    test("should set isPrerendered to false when no existing shadow root is present (CSR)", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                // @ts-expect-error: Client module.
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
            const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                // @ts-expect-error: Client module.
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
            const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                // @ts-expect-error: Client module.
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
            const {
                FASTElement,
                FASTElementDefinition,
                html,
                observable,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const name = uniqueElementName();

            class TestElement extends FASTElement {
                label: string = "default";
                static definition = {
                    name,
                    template: html<TestElement>`<span>${(x: { label: any }) => x.label}</span>`,
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
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                uniqueElementName,
                // @ts-expect-error: Client module.
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
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                StopHydration,
                uniqueElementName,
                // @ts-expect-error: Client module.
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

    test("should client render when render hydration boundaries are empty", async ({
        page,
    }) => {
        await page.goto("/");

        const element = await page.evaluateHandle(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                render,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration();
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                value = "client rendered";

                static definition = {
                    name,
                    template: html<TestElement>`
                        ${render((x: { value: any }) => x.value, html<string>`<span>${(x: any) => x}</span>`)}
                    `,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(
                `<${name}><template shadowrootmode="open"><!--fe:b--><!--fe:/b--></template></${name}>`,
            );

            return container.firstElementChild;
        });

        expect(await element.evaluate((x: any) => x.$fastController)).toEqual(
            expect.anything(),
        );

        const result = await element.evaluate(async (element: any) => {
            await element.$fastController.isHydrated;
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                isHydrated: await element.$fastController.isHydrated,
                text: element.shadowRoot?.textContent?.trim() ?? "",
                spanCount: element.shadowRoot?.querySelectorAll("span").length ?? 0,
            };
        });

        expect(result.isHydrated).toBe(true);
        expect(result.text).toBe("client rendered");
        expect(result.spanCount).toBe(1);
    });

    test("should create missing repeat views when SSR rendered fewer items", async ({
        page,
    }) => {
        await page.goto("/");

        const element = await page.evaluateHandle(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                repeat,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration();
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                items = ["one", "two", "three"];

                static definition = {
                    name,
                    template: html<TestElement>`
                        ${repeat((x: { items: any }) => x.items, html<string>`<span>${(x: any) => x}</span>`)}
                    `,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(
                `<${name}><template shadowrootmode="open"><!--fe:b--><!--fe:r--><span><!--fe:b-->server-one<!--fe:/b--></span><!--fe:/r--><!--fe:/b--></template></${name}>`,
            );

            return container.firstElementChild;
        });

        expect(await element.evaluate((x: any) => x.$fastController)).toEqual(
            expect.anything(),
        );

        const result = await element.evaluate(async (element: any) => {
            await element.$fastController.isHydrated;
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                text: element.shadowRoot?.textContent?.replace(/\s+/g, "") ?? "",
                spanCount: element.shadowRoot?.querySelectorAll("span").length ?? 0,
            };
        });

        expect(result.text).toBe("onetwothree");
        expect(result.spanCount).toBe(3);
    });

    test("should hydrate legacy indexed repeat markers", async ({ page }) => {
        await page.goto("/");

        const element = await page.evaluateHandle(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                repeat,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration();
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                items = ["one", "two"];

                static definition = {
                    name,
                    template: html<TestElement>`
                        ${repeat((x: { items: any }) => x.items, html<string>`<span>${(x: any) => x}</span>`)}
                    `,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(
                `<${name}><template shadowrootmode="open"><!--fe-b$$start$$0$$repeat-1$$fe-b--><!--fe-repeat$$start$$0$$fe-repeat--><span><!--fe-b$$start$$0$$item-1$$fe-b-->server-one<!--fe-b$$end$$0$$item-1$$fe-b--></span><!--fe-repeat$$end$$0$$fe-repeat--><!--fe-b$$end$$0$$repeat-1$$fe-b--></template></${name}>`,
            );

            return container.firstElementChild;
        });

        expect(await element.evaluate((x: any) => x.$fastController)).toEqual(
            expect.anything(),
        );

        const result = await element.evaluate(async (element: any) => {
            await element.$fastController.isHydrated;
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                text: element.shadowRoot?.textContent?.replace(/\s+/g, "") ?? "",
                spanCount: element.shadowRoot?.querySelectorAll("span").length ?? 0,
            };
        });

        expect(result.text).toBe("onetwo");
        expect(result.spanCount).toBe(2);
    });

    test("should hydrate legacy indexed attribute markers", async ({ page }) => {
        await page.goto("/");

        const element = await page.evaluateHandle(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                ref,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration();
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                count = 0;
                disabled = false;
                input!: HTMLInputElement;

                static definition = {
                    name,
                    template: html<TestElement>`
                        <input ${ref("input")}>
                        <button
                            ?disabled=${(x: TestElement) => x.disabled}
                            @click=${(x: TestElement) => x.count++}
                        >
                            Increment
                        </button>
                    `,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(
                `<${name}><template shadowrootmode="open"><input data-fe-b-0><button data-fe-c-1-2>Increment</button></template></${name}>`,
            );

            return container.firstElementChild;
        });

        expect(await element.evaluate((x: any) => x.$fastController)).toEqual(
            expect.anything(),
        );

        const result = await element.evaluate(async (element: any) => {
            await element.$fastController.isHydrated;
            await new Promise(resolve => requestAnimationFrame(resolve));
            element.shadowRoot!.querySelector("button")!.click();

            return {
                count: element.count,
                inputResolved:
                    element.input === element.shadowRoot!.querySelector("input"),
            };
        });

        expect(result.count).toBe(1);
        expect(result.inputResolved).toBe(true);
    });

    test("should remove extra repeat ranges when SSR rendered more items", async ({
        page,
    }) => {
        await page.goto("/");

        const element = await page.evaluateHandle(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                repeat,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration();
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                items = ["one"];

                static definition = {
                    name,
                    template: html<TestElement>`
                        ${repeat((x: { items: any }) => x.items, html<string>`<span>${(x: any) => x}</span>`)}
                    `,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(
                `<${name}><template shadowrootmode="open"><!--fe:b--><!--fe:r--><span><!--fe:b-->server-one<!--fe:/b--></span><!--fe:/r--><!--fe:r--><span><!--fe:b-->server-two<!--fe:/b--></span><!--fe:/r--><!--fe:/b--></template></${name}>`,
            );

            return container.firstElementChild;
        });

        expect(await element.evaluate((x: any) => x.$fastController)).toEqual(
            expect.anything(),
        );

        const result = await element.evaluate(async (element: any) => {
            await element.$fastController.isHydrated;
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                text: element.shadowRoot?.textContent?.replace(/\s+/g, "") ?? "",
                spanCount: element.shadowRoot?.querySelectorAll("span").length ?? 0,
            };
        });

        expect(result.text).toBe("one");
        expect(result.spanCount).toBe(1);
    });

    test("HydrationBindingError emits a minimal message when the debugger is not installed", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration();
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                value = "client";

                static definition = {
                    name,
                    template: html<TestElement>`<span>${(x: { value: any }) => x.value}</span>`,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const captured: {
                message?: string;
                expected?: unknown;
                received?: unknown;
            } = {};
            const handler = (event: ErrorEvent) => {
                event.preventDefault();
                const err = event.error as any;
                if (!err || captured.message) return;
                captured.message = err.message;
                captured.expected = err.expected;
                captured.received = err.received;
            };
            window.addEventListener("error", handler);

            try {
                const container = document.createElement("div");
                document.body.appendChild(container);
                (container as any).setHTMLUnsafe(
                    `<${name}><template shadowrootmode="open"><span>server</span></template></${name}>`,
                );

                await new Promise(resolve => setTimeout(resolve, 50));
            } finally {
                window.removeEventListener("error", handler);
            }

            return captured;
        });

        expect(result.message).toContain("Hydration mismatch");
        expect(result.message).toContain("hydrationDebugger()");
        expect(result.expected).toBeUndefined();
        expect(result.received).toBeUndefined();
    });

    test("HydrationBindingError reports expected aspect and received DOM snippet when hydrationDebugger is installed", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                hydrationDebugger,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration({ debugger: hydrationDebugger() });
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                value = "client";

                static definition = {
                    name,
                    template: html<TestElement>`<span>${(x: { value: any }) => x.value}</span>`,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const captured: {
                message?: string;
                expectedTagName?: string | null;
                expectedAspect?: string;
                receivedHtml?: string;
            } = {};
            const handler = (event: ErrorEvent) => {
                event.preventDefault();
                const err = event.error as any;
                if (!err || captured.message) return;
                captured.message = err.message;
                captured.expectedTagName = err.expected?.tagName;
                captured.expectedAspect = err.expected?.aspect;
                captured.receivedHtml = err.received?.html;
            };
            window.addEventListener("error", handler);

            try {
                const container = document.createElement("div");
                document.body.appendChild(container);
                // SSR rendered <span>server</span> with no hydration markers —
                // the client template's content binding has no marker to attach to.
                (container as any).setHTMLUnsafe(
                    `<${name}><template shadowrootmode="open"><span>server</span></template></${name}>`,
                );

                await new Promise(resolve => setTimeout(resolve, 50));
            } finally {
                window.removeEventListener("error", handler);
            }

            return captured;
        });

        expect(result.message).toContain("Hydration mismatch");
        expect(result.message).toContain("Expected: content binding");
        expect(result.message).toContain("Received:");
        expect(result.message).toContain("server");
        expect(result.expectedTagName).toBeNull();
        expect(result.expectedAspect).toBe("content");
        expect(result.receivedHtml).toContain("<span>");
        expect(result.receivedHtml).toContain("server");
    });

    test("HydrationTargetElementError reports excess attribute binding count and received element when hydrationDebugger is installed", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            const {
                enableHydration,
                FASTElement,
                FASTElementDefinition,
                html,
                hydrationDebugger,
                uniqueElementName,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            enableHydration({ debugger: hydrationDebugger() });
            const name = uniqueElementName();

            class TestElement extends FASTElement {
                cls = "active";

                static definition = {
                    name,
                    template: html<TestElement>`<span :className="${(x: { cls: any }) =>
                        x.cls}">text</span>`,
                };
            }

            await (await FASTElementDefinition.compose(TestElement)).define();

            const captured: {
                message?: string;
                expected?: string;
                receivedHtml?: string;
            } = {};
            const handler = (event: ErrorEvent) => {
                event.preventDefault();
                const err = event.error as any;
                if (!err || captured.message) return;
                captured.message = err.message;
                captured.expected =
                    typeof err.expected === "string"
                        ? err.expected
                        : err.expected?.aspect;
                captured.receivedHtml = err.received?.html;
            };
            window.addEventListener("error", handler);

            try {
                const container = document.createElement("div");
                document.body.appendChild(container);
                // SSR claims the span has 3 attribute bindings but the client
                // template only declares 1. Hydration walk runs out of factories.
                (container as any).setHTMLUnsafe(
                    `<${name}><template shadowrootmode="open"><span data-fe="3" class="x">text</span></template></${name}>`,
                );

                await new Promise(resolve => setTimeout(resolve, 50));
            } finally {
                window.removeEventListener("error", handler);
            }

            return captured;
        });

        expect(result.message).toContain("Hydration mismatch");
        expect(result.message).toContain("no more attribute bindings");
        expect(result.message).toContain("Received:");
        expect(result.expected).toContain("no more attribute bindings");
        expect(result.receivedHtml).toContain("<span");
        expect(result.receivedHtml).toContain('class="x"');
    });
});
