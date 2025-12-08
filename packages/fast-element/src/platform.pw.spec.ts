import { expect, test } from "@playwright/test";
import type { FASTGlobal } from "./interfaces.js";
import { createTypeRegistry, type TypeDefinition } from "./platform.js";

declare const FAST: FASTGlobal;

test.describe("The FAST global", () => {
    test.describe("kernel API", () => {
        test("can get a lazily defined service by id", () => {
            const id = "test-id";
            const service = {};
            const found = FAST.getById(id, () => service);

            expect(found).toBe(service);
        });

        test("returns the first service defined for an id", () => {
            const id = "test-id-2";
            const service1 = {};
            const service2 = {};
            const found1 = FAST.getById(id, () => service1);
            const found2 = FAST.getById(id, () => service2);

            expect(found1).toBe(service1);
            expect(found2).toBe(service1);
        });

        test("returns null for optional services", () => {
            const id = "test-id-3";
            const found = FAST.getById(id);

            expect(found).toBeNull();
        });
    });
});

test.describe("TypeRegistry", () => {
    test("returns undefined when getting the definition for null", () => {
        const reg = createTypeRegistry<TypeDefinition>();
        const value = reg.getForInstance(null);

        expect(value).toBeUndefined();
    });

    test("returns undefined when getting the definition for undefined", () => {
        const reg = createTypeRegistry<TypeDefinition>();
        const value = reg.getForInstance(undefined);

        expect(value).toBeUndefined();
    });
});
