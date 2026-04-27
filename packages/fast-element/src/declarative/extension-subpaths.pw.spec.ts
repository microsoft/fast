import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { build } from "esbuild";

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

test.describe("extension subpaths", () => {
    test("exports attributeMap and observerMap from package subpaths", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { AttributeMap, Schema, attributeMap, observerMap } = await import(
                "/extension-subpaths-main.js"
            );

            return {
                hasAttributeMapClass: typeof AttributeMap === "function",
                hasAttributeMap: typeof attributeMap === "function",
                hasObserverMap: typeof observerMap === "function",
                hasSchema: typeof Schema === "function",
            };
        });

        expect(result.hasAttributeMapClass).toBe(true);
        expect(result.hasAttributeMap).toBe(true);
        expect(result.hasObserverMap).toBe(true);
        expect(result.hasSchema).toBe(true);
    });

    test("observerMap accepts a schema for non-declarative use", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { Schema, observerMap } = await import("/extension-subpaths-main.js");

            class ManualElement {
                public model: any;
            }

            const schema = new Schema("manual-observer-map");
            schema.addPath({
                rootPropertyName: "model",
                pathConfig: {
                    type: "default",
                    path: "model.value",
                    currentContext: null,
                    parentContext: null,
                },
                childrenMap: null,
            });

            observerMap({ schema })({ type: ManualElement } as any);

            const instance = new ManualElement();
            instance.model = null;
            const nextValue = { value: "before" };
            instance.model = nextValue;

            return {
                hasAccessor:
                    typeof Object.getOwnPropertyDescriptor(
                        ManualElement.prototype,
                        "model",
                    )?.get === "function",
                isProxy: instance.model.$isProxy === true,
                preservesValue: instance.model.value === "before",
                replacedOriginal: instance.model !== nextValue,
            };
        });

        expect(result.hasAccessor).toBe(true);
        expect(result.isProxy).toBe(true);
        expect(result.preservesValue).toBe(true);
        expect(result.replacedOriginal).toBe(true);
    });

    test("observerMap observes items spliced into nested $defs arrays", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver } = await import("/main.js");
            // @ts-expect-error: Client module.
            const { Schema, observerMap } = await import("/extension-subpaths-main.js");

            ArrayObserver.enable();

            class ManualElement {
                public someData: any;
            }

            const schema = new Schema("manual-defs-array");
            schema.addPath({
                rootPropertyName: "someData",
                pathConfig: {
                    type: "repeat",
                    path: "someData.items",
                    currentContext: "item",
                    parentContext: null,
                },
                childrenMap: null,
            });
            schema.addPath({
                rootPropertyName: "someData",
                pathConfig: {
                    type: "default",
                    path: "item.name",
                    currentContext: "item",
                    parentContext: null,
                },
                childrenMap: null,
            });

            observerMap({ schema })({ type: ManualElement } as any);

            const instance = new ManualElement();
            instance.someData = {
                items: [{ name: "first" }],
            };

            instance.someData.items.push({ name: "second" });
            await new Promise(resolve =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );

            return {
                hasObservableName:
                    typeof Object.getOwnPropertyDescriptor(
                        instance.someData.items[1],
                        "name",
                    )?.get === "function",
            };
        });

        expect(result.hasObservableName).toBe(true);
    });

    test("observerMap reports missing schemas for non-declarative definitions", async ({
        page,
    }) => {
        await page.goto("/");

        const message = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { observerMap } = await import("/extension-subpaths-main.js");

            class ManualElement {}

            try {
                observerMap()({ type: ManualElement } as any);
            } catch (error) {
                return (error as Error).message;
            }

            return "";
        });

        expect(message).toContain("observerMap requires a schema");
    });

    test("map entrypoints do not bundle declarative template runtime", async () => {
        const result = await build({
            stdin: {
                contents: `
                    import { attributeMap } from "./src/declarative/attribute-map.ts";
                    import { observerMap } from "./src/declarative/observer-map.ts";
                    export { attributeMap, observerMap };
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

        const declarativeInputs = Object.keys(result.metafile!.inputs).filter(input => {
            if (!input.includes("src/declarative/")) {
                return false;
            }

            return !(
                input.endsWith("src/declarative/attribute-map.ts") ||
                input.endsWith("src/declarative/observer-map.ts") ||
                input.endsWith("src/declarative/observer-map-utilities.ts")
            );
        });

        expect(declarativeInputs).toEqual([]);
    });
});
