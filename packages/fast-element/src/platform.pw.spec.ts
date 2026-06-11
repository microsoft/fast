import { expect, test } from "@playwright/test";
import { createTypeRegistry, FAST, type TypeDefinition } from "./platform.js";

test.describe("The FAST module", () => {
    test.describe("messaging API", () => {
        test("can create errors with codes", async () => {
            const code = 42;
            FAST.addMessages({ [code]: `Error ${code}` });

            const error = FAST.error(code);
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toContain(`${code}`);
        });
    });
});

test.describe("TypeRegistry", () => {
    test("returns undefined when getting the definition for null", async () => {
        const reg = createTypeRegistry<TypeDefinition>();
        const value = reg.getForInstance(null);

        expect(value).toBeUndefined();
    });

    test("returns undefined when getting the definition for undefined", async () => {
        const reg = createTypeRegistry<TypeDefinition>();
        const value = reg.getForInstance(undefined);

        expect(value).toBeUndefined();
    });
});
