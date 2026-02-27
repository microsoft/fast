import { expect, test } from "@playwright/test";

test.describe("FASTElement", () => {
    test("instanceof checks should provide TypeScript support for HTMLElement and FASTElement methods and properties", async ({
        page,
    }) => {
        await page.goto("/");

        const hasProperties = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement } = await import("/main.js");

            // This test is designed to test TypeScript support and runtime behavior.
            // A 'failure' will prevent the test from compiling or running correctly.
            const myElement: unknown = undefined;

            if (myElement instanceof FASTElement) {
                // These property accesses should be valid at compile time
                // and the properties should exist at runtime
                return "$fastController" in myElement && "querySelectorAll" in myElement;
            }

            return true; // Test passes if the element is not an instance
        });

        expect(hasProperties).toBe(true);
    });
});
