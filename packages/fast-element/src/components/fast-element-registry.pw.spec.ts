import { expect, test } from "@playwright/test";

test.describe("fastElementRegistry", () => {
    test("returns registered definitions by type and instance", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElementDefinition, fastElementRegistry, uniqueElementName } =
                await import("/main.js");

            class RegistryLookupElement extends HTMLElement {}

            const definition = await FASTElementDefinition.compose(
                RegistryLookupElement,
                { name: uniqueElementName() },
            );
            definition.define();
            const instance = document.createElement(definition.name);

            return {
                getByTypeReturnsDefinition:
                    fastElementRegistry.getByType(RegistryLookupElement) === definition,
                getForInstanceReturnsDefinition:
                    fastElementRegistry.getForInstance(instance) === definition,
            };
        });

        expect(result.getByTypeReturnsDefinition).toBe(true);
        expect(result.getForInstanceReturnsDefinition).toBe(true);
    });

    test("resolves whenRegistered with the matching definition", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElementDefinition, fastElementRegistry, uniqueElementName } =
                await import("/main.js");

            class PendingRegistryElement extends HTMLElement {}

            const name = uniqueElementName();
            const pendingDefinition = fastElementRegistry.whenRegistered(name);
            const definition = await FASTElementDefinition.compose(
                PendingRegistryElement,
                {
                    name,
                },
            );
            const resolvedDefinition = await pendingDefinition;

            return {
                resolvesDefinition: resolvedDefinition === definition,
                getByTypeReturnsDefinition:
                    fastElementRegistry.getByType(PendingRegistryElement) === definition,
            };
        });

        expect(result.resolvesDefinition).toBe(true);
        expect(result.getByTypeReturnsDefinition).toBe(true);
    });

    test("resolves whenRegistered immediately when the definition already exists", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElementDefinition, fastElementRegistry, uniqueElementName } =
                await import("/main.js");

            class ExistingRegistryElement extends HTMLElement {}

            const definition = await FASTElementDefinition.compose(
                ExistingRegistryElement,
                {
                    name: uniqueElementName(),
                },
            );
            const resolvedDefinition = await fastElementRegistry.whenRegistered(
                definition.name,
            );

            return resolvedDefinition === definition;
        });

        expect(result).toBe(true);
    });
});
