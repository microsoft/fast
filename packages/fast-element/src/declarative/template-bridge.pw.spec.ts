import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { build } from "esbuild";
import { DeclarativeTemplateBridge } from "./template-bridge.js";

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
const pureDeclarativeEntrypointUrl = `/@fs${
    new URL("../../test/pure-declarative-main.ts", import.meta.url).pathname
}`;

test.describe("DeclarativeTemplateBridge", () => {
    test("keys pending requests by registry and element name", async () => {
        const bridge = new DeclarativeTemplateBridge();
        const registryA = {
            define() {},
            get() {
                return void 0;
            },
        } as unknown as CustomElementRegistry;
        const registryB = {
            define() {},
            get() {
                return void 0;
            },
        } as unknown as CustomElementRegistry;
        const templateA = { id: "a" } as any;
        const templateB = { id: "b" } as any;

        const requestA = bridge.requestTemplate({
            name: "test-element",
            registry: registryA,
        } as any);
        const requestB = bridge.requestTemplate({
            name: "test-element",
            registry: registryB,
        } as any);

        bridge.registerPublisher(registryA, "test-element", {
            publishTemplate: async () => templateA,
        });

        expect(await requestA).toBe(templateA);

        let requestBResolved = false;
        void requestB.then(() => {
            requestBResolved = true;
        });

        await Promise.resolve();
        expect(requestBResolved).toBe(false);

        bridge.registerPublisher(registryB, "test-element", {
            publishTemplate: async () => templateB,
        });

        expect(await requestB).toBe(templateB);
    });

    test("requeues active requests when a publisher disconnects", async () => {
        const bridge = new DeclarativeTemplateBridge();
        const registry = {
            define() {},
            get() {
                return void 0;
            },
        } as unknown as CustomElementRegistry;
        const firstTemplate = { id: "first" } as any;
        const secondTemplate = { id: "second" } as any;

        let resolveFirst!: (template: any) => void;

        const firstPublisher = {
            publishTemplate: async () =>
                new Promise<any>(resolve => {
                    resolveFirst = resolve;
                }),
        };
        const secondPublisher = {
            publishTemplate: async () => secondTemplate,
        };

        const request = bridge.requestTemplate({
            name: "test-element",
            registry,
        } as any);

        bridge.registerPublisher(registry, "test-element", firstPublisher);

        await Promise.resolve();

        bridge.unregisterPublisher(registry, "test-element", firstPublisher);

        let requestResolved = false;
        void request.then(() => {
            requestResolved = true;
        });

        resolveFirst(firstTemplate);
        await Promise.resolve();

        expect(requestResolved).toBe(false);

        bridge.registerPublisher(registry, "test-element", secondPublisher);

        expect(await request).toBe(secondTemplate);
    });

    test("moves pending requests when a publisher changes names", async () => {
        const bridge = new DeclarativeTemplateBridge();
        const registry = {
            define() {},
            get() {
                return void 0;
            },
        } as unknown as CustomElementRegistry;
        const template = { id: "moved" } as any;
        const publisher = {
            publishTemplate: async () => template,
        };

        const request = bridge.requestTemplate({
            name: "new-name",
            registry,
        } as any);

        bridge.registerPublisher(registry, "old-name", publisher);

        let resolved = false;
        void request.then(() => {
            resolved = true;
        });

        await Promise.resolve();
        expect(resolved).toBe(false);

        bridge.movePublisher(registry, "old-name", "new-name", publisher);

        expect(await request).toBe(template);
    });
});

test.describe("declarativeTemplate", () => {
    test("does not install hydration until enableHydration is called", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async pureEntrypointUrl => {
            // @ts-expect-error: Client module.
            const { enableHydration, html, isHydratable } = await import("/main.js");

            const beforeRuntimeTemplate = html`<span>before</span>`;
            const beforeImport = isHydratable(beforeRuntimeTemplate);

            // @ts-expect-error: Client module.
            const { Schema, TemplateParser } = await import(pureEntrypointUrl);

            const afterImport = isHydratable(html`<span>after import</span>`);
            const parser = new TemplateParser();
            const schema = new Schema("lazy-template");
            const { strings, values } = parser.parse("<span>after create</span>", schema);
            const declarativeTemplate = parser.createTemplate(strings, values);
            const declarativeTemplateBeforeHydration = isHydratable(declarativeTemplate);

            enableHydration();

            return {
                beforeImport,
                afterImport,
                beforeRuntimeTemplateAfterCreate: isHydratable(beforeRuntimeTemplate),
                declarativeTemplateBeforeHydration,
                declarativeTemplateAfterHydration: isHydratable(declarativeTemplate),
            };
        }, pureDeclarativeEntrypointUrl);

        expect(result.beforeImport).toBe(false);
        expect(result.afterImport).toBe(false);
        expect(result.declarativeTemplateBeforeHydration).toBe(false);
        expect(result.beforeRuntimeTemplateAfterCreate).toBe(true);
        expect(result.declarativeTemplateAfterHydration).toBe(true);
    });

    test("does not export map helpers from declarative entrypoint", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async pureEntrypointUrl => {
            // @ts-expect-error: Client module.
            const declarative = await import(pureEntrypointUrl);

            return {
                hasAttributeMap: "attributeMap" in declarative,
                hasObserverMap: "observerMap" in declarative,
            };
        }, pureDeclarativeEntrypointUrl);

        expect(result).toEqual({
            hasAttributeMap: false,
            hasObserverMap: false,
        });
    });

    test("does not bundle map modules for plain declarativeTemplate", async () => {
        const result = await build({
            stdin: {
                contents: `
                    import { declarativeTemplate } from "./src/declarative/index.ts";
                    export { declarativeTemplate };
                `,
                loader: "ts",
                resolveDir: packageRoot,
            },
            bundle: true,
            format: "esm",
            metafile: true,
            minify: true,
            treeShaking: true,
            write: false,
        });

        const mapBytes = Object.values(result.metafile!.outputs).reduce(
            (total, output) => {
                return (
                    total +
                    Object.entries(output.inputs).reduce((outputTotal, [input, data]) => {
                        if (
                            input.endsWith("src/declarative/attribute-map.ts") ||
                            input.endsWith("src/declarative/observer-map.ts") ||
                            input.endsWith("src/declarative/observer-map-utilities.ts")
                        ) {
                            return outputTotal + data.bytesInOutput;
                        }

                        return outputTotal;
                    }, 0)
                );
            },
            0,
        );

        expect(mapBytes).toBe(0);
    });

    test("resolves template-first markup, auto-defines <f-template>, and applies maps", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                declarativeTemplate,
                uniqueElementName,
            } = await import("/declarative-main.js");
            // @ts-expect-error: Client module.
            const { attributeMap, observerMap } = await import(
                "/extension-subpaths-main.js"
            );

            const elementName = uniqueElementName();

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="${elementName}"><template><span class="label">{{label}}</span><span class="nested">{{data.value}}</span></template></f-template>`,
            );

            class TestElement extends FASTElement {
                public data = {
                    value: "before",
                };

                public updateValue() {
                    this.data.value = "after";
                }
            }

            const definePromise = TestElement.define(
                {
                    name: elementName,
                    template: declarativeTemplate(),
                },
                [observerMap(), attributeMap()],
            );

            await definePromise;

            const definition = FASTElementDefinition.getByType(TestElement) as any;
            const element = document.createElement(elementName) as any;

            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            element.setAttribute("label", "hello");
            element.updateValue();

            await new Promise(resolve =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );

            const labelDescriptor = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(element),
                "label",
            );

            return {
                definitionHasConcreteTemplate:
                    definition.template !== undefined &&
                    typeof definition.template !== "function",
                hasLabelAccessor: typeof labelDescriptor?.get === "function",
                labelText: element.shadowRoot?.querySelector(".label")?.textContent ?? "",
                nestedText:
                    element.shadowRoot?.querySelector(".nested")?.textContent ?? "",
                schemaRootProperties: Array.from(
                    definition.schema?.getRootProperties() ?? [],
                ),
                templateElementDefined: customElements.get("f-template") !== undefined,
            };
        });

        expect(result.templateElementDefined).toBe(true);
        expect(result.definitionHasConcreteTemplate).toBe(true);
        expect(result.hasLabelAccessor).toBe(true);
        expect(result.labelText).toBe("hello");
        expect(result.nestedText).toBe("after");
        expect(result.schemaRootProperties).toEqual(
            expect.arrayContaining(["label", "data"]),
        );
    });

    test("preserves and augments an explicit schema before applying maps", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                Schema,
                declarativeTemplate,
                uniqueElementName,
            } = await import("/declarative-main.js");
            // @ts-expect-error: Client module.
            const { attributeMap, observerMap } = await import(
                "/extension-subpaths-main.js"
            );

            const elementName = uniqueElementName();
            const schema = new Schema(elementName);

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="${elementName}"><template><span class="label">{{label}}</span><span class="nested">{{data.value}}</span></template></f-template>`,
            );

            class TestElement extends FASTElement {
                public data = {
                    value: "before",
                };

                public updateValue() {
                    this.data.value = "after";
                }
            }

            await TestElement.define(
                {
                    name: elementName,
                    schema,
                    template: declarativeTemplate(),
                },
                [observerMap(), attributeMap()],
            );

            const definition = FASTElementDefinition.getByType(TestElement) as any;
            const element = document.createElement(elementName) as any;

            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            element.setAttribute("label", "hello");
            element.updateValue();

            await new Promise(resolve =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );

            const labelDescriptor = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(element),
                "label",
            );

            return {
                hasLabelAccessor: typeof labelDescriptor?.get === "function",
                labelText: element.shadowRoot?.querySelector(".label")?.textContent ?? "",
                nestedText:
                    element.shadowRoot?.querySelector(".nested")?.textContent ?? "",
                sameSchema: definition.schema === schema,
                schemaRootProperties: Array.from(schema.getRootProperties()),
            };
        });

        expect(result.hasLabelAccessor).toBe(true);
        expect(result.labelText).toBe("hello");
        expect(result.nestedText).toBe("after");
        expect(result.sameSchema).toBe(true);
        expect(result.schemaRootProperties).toEqual(
            expect.arrayContaining(["label", "data"]),
        );
    });

    test("uses a native <f-template> publisher instead of a FASTElement", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                declarativeTemplate,
                uniqueElementName,
            } = await import("/declarative-main.js");

            const elementName = uniqueElementName();

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="${elementName}"><template><span>native</span></template></f-template>`,
            );

            class TestElement extends FASTElement {}

            await TestElement.define({
                name: elementName,
                template: declarativeTemplate(),
            });

            const templateElement = document.querySelector("f-template")!;

            return {
                hasFastController: "$fastController" in templateElement,
                hasFastDefinition:
                    FASTElementDefinition.getForInstance(templateElement) !== void 0,
                isHTMLElement: templateElement instanceof HTMLElement,
            };
        });

        expect(result.isHTMLElement).toBe(true);
        expect(result.hasFastController).toBe(false);
        expect(result.hasFastDefinition).toBe(false);
    });

    test("allows nested templates inside the authored template", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, declarativeTemplate, uniqueElementName } = await import(
                "/declarative-main.js"
            );

            const elementName = uniqueElementName();

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="${elementName}"><template><section><template id="nested"><span>nested</span></template><span class="label">{{label}}</span></section></template></f-template>`,
            );

            class TestElement extends FASTElement {
                public label = "outer";
            }

            await TestElement.define({
                name: elementName,
                template: declarativeTemplate(),
            });

            const element = document.createElement(elementName);
            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                hasNestedTemplate:
                    element.shadowRoot?.querySelector("#nested") instanceof
                    HTMLTemplateElement,
                labelText: element.shadowRoot?.querySelector(".label")?.textContent ?? "",
            };
        });

        expect(result.hasNestedTemplate).toBe(true);
        expect(result.labelText).toBe("outer");
    });

    test("waits for definition-first markup inserted later", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                declarativeTemplate,
                uniqueElementName,
            } = await import("/declarative-main.js");

            const elementName = uniqueElementName();

            class TestElement extends FASTElement {}

            let resolved = false;

            const definePromise = TestElement.define({
                name: elementName,
                template: declarativeTemplate(),
            }).then(() => {
                resolved = true;
            });

            await Promise.resolve();
            await Promise.resolve();

            const resolvedBeforeInsert = resolved;
            const templateElementDefinedBeforeInsert =
                customElements.get("f-template") !== undefined;

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="${elementName}"><template><span class="late">late</span></template></f-template>`,
            );

            await definePromise;

            const definition = FASTElementDefinition.getByType(TestElement) as any;
            const element = document.createElement(elementName) as any;

            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                definitionHasConcreteTemplate:
                    definition.template !== undefined &&
                    typeof definition.template !== "function",
                resolvedBeforeInsert,
                shadowText: element.shadowRoot?.textContent ?? "",
                templateElementDefinedBeforeInsert,
            };
        });

        expect(result.resolvedBeforeInsert).toBe(false);
        expect(result.templateElementDefinedBeforeInsert).toBe(true);
        expect(result.definitionHasConcreteTemplate).toBe(true);
        expect(result.shadowText).toContain("late");
    });

    test("resolves when a connected <f-template> changes its name", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, declarativeTemplate, uniqueElementName } = await import(
                "/declarative-main.js"
            );

            const elementName = uniqueElementName();

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="old-${elementName}"><template><span>renamed</span></template></f-template>`,
            );

            class TestElement extends FASTElement {}

            let resolved = false;
            const definePromise = TestElement.define({
                name: elementName,
                template: declarativeTemplate(),
            }).then(() => {
                resolved = true;
            });

            await Promise.resolve();
            await Promise.resolve();

            const resolvedBeforeRename = resolved;
            const templateElement = document.querySelector("f-template") as any;
            templateElement.name = elementName;

            await definePromise;

            const element = document.createElement(elementName);
            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                resolvedBeforeRename,
                shadowText: element.shadowRoot?.textContent ?? "",
            };
        });

        expect(result.resolvedBeforeRename).toBe(false);
        expect(result.shadowText).toContain("renamed");
    });

    test("ignores disconnected <f-template> publishers until they reconnect", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, declarativeTemplate, uniqueElementName } = await import(
                "/declarative-main.js"
            );

            const elementName = uniqueElementName();
            const templateElement = document.createElement("f-template");

            templateElement.setAttribute("name", elementName);
            templateElement.innerHTML = "<template><span>reconnected</span></template>";
            document.body.appendChild(templateElement);
            templateElement.remove();

            class TestElement extends FASTElement {}

            let resolved = false;
            const definePromise = TestElement.define({
                name: elementName,
                template: declarativeTemplate(),
            }).then(() => {
                resolved = true;
            });

            await Promise.resolve();
            await Promise.resolve();

            const resolvedBeforeReconnect = resolved;
            document.body.appendChild(templateElement);

            await definePromise;

            const element = document.createElement(elementName);
            document.body.appendChild(element);
            await new Promise(resolve => requestAnimationFrame(resolve));

            return {
                resolvedBeforeReconnect,
                shadowText: element.shadowRoot?.textContent ?? "",
            };
        });

        expect(result.resolvedBeforeReconnect).toBe(false);
        expect(result.shadowText).toContain("reconnected");
    });

    test("rejects duplicate matching templates with a clear error", async ({ page }) => {
        await page.goto("/");

        const message = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, declarativeTemplate, uniqueElementName } = await import(
                "/declarative-main.js"
            );

            const elementName = uniqueElementName();

            document.body.insertAdjacentHTML(
                "beforeend",
                `<f-template name="${elementName}"><template><span>first</span></template></f-template><f-template name="${elementName}"><template><span>second</span></template></f-template>`,
            );

            class TestElement extends FASTElement {}

            try {
                await TestElement.define({
                    name: elementName,
                    template: declarativeTemplate(),
                });
                return "";
            } catch (error) {
                return (error as Error).message;
            }
        });

        expect(message).toContain("There can only be one connected <f-template");
    });
});
