import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";
import { Schema } from "./schema.js";

test.describe("ObserverMap", async () => {
    let observerMap: ObserverMap;
    let schema: Schema = new Schema("test-class");
    class TestClass {}

    test.beforeEach(async () => {
        // Use TestClass.prototype so instances will have the observable properties
        observerMap = new ObserverMap(TestClass.prototype, schema);
    });

    test("should create new instances", async () => {
        const instance1 = new ObserverMap(TestClass.prototype, schema);
        const instance2 = new ObserverMap(TestClass.prototype, schema);
        expect(instance1).not.toBe(instance2);
    });
});
