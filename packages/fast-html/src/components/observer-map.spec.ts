import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";
import { Schema, defsPropertyName, type JSONSchema } from "./schema.js";

const testElementName = "test-class";

test.describe("ObserverMap", async () => {
    let observerMap: ObserverMap;
    let schema: Schema;
    class TestClass {
        public someData: any;
    }

    test.beforeEach(async () => {
        schema = new Schema(testElementName);
        // Use TestClass.prototype so instances will have the observable properties
        observerMap = new ObserverMap(TestClass.prototype, schema);
    });

    test("should create new instances", async () => {
        const instance1 = new ObserverMap(TestClass.prototype, schema);
        const instance2 = new ObserverMap(TestClass.prototype, schema);
        expect(instance1).not.toBe(instance2);
    });

    test("proxies direct object assignments", async () => {
        const schemaMap = Schema.jsonSchemaMap.get(testElementName) as Map<
            string,
            JSONSchema
        >;
        schemaMap.set("someData", {
            $schema: "https://json-schema.org/draft/2019-09/schema",
            $id: `https://fast.design/schemas/${testElementName}/someData.json`,
            type: "object",
            properties: {
                foo: { type: "string" },
            },
            [defsPropertyName]: {},
        });

        observerMap.defineProperties();

        const instance = new TestClass();
        instance.someData = null;

        const nextValue = { foo: "bar" };
        instance.someData = nextValue;

        expect(instance.someData).not.toBe(nextValue);
        expect(instance.someData.$isProxy).toBeTruthy();
    });
});
