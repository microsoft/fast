import { expect, test } from "@playwright/test";
import {
    defsPropertyName,
    type JSONSchema,
    Schema,
    schemaRegistry,
} from "../components/schema.js";
import { ObserverMap } from "./observer-map.js";

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
        const schemaMap = schemaRegistry.get(testElementName) as Map<string, JSONSchema>;
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

    test.describe("properties config", () => {
        test("should skip root properties not listed in config.properties", () => {
            const testName = "test-skip-unlisted";
            const testSchema = new Schema(testName);
            class SkipTest {
                public included: any;
                public excluded: any;
            }

            const schemaMap = schemaRegistry.get(testName) as Map<string, JSONSchema>;
            schemaMap.set("included", {
                $schema: "https://json-schema.org/draft/2019-09/schema",
                $id: `https://fast.design/schemas/${testName}/included.json`,
                type: "object",
                properties: { val: { type: "string" } },
                [defsPropertyName]: {},
            });
            schemaMap.set("excluded", {
                $schema: "https://json-schema.org/draft/2019-09/schema",
                $id: `https://fast.design/schemas/${testName}/excluded.json`,
                type: "object",
                properties: { val: { type: "string" } },
                [defsPropertyName]: {},
            });

            const om = new ObserverMap(SkipTest.prototype, testSchema, {
                properties: { included: true },
            });
            om.defineProperties();

            const instance = new SkipTest();
            instance.included = null;
            instance.included = { val: "hello" };

            // included should be proxied
            expect(instance.included.$isProxy).toBeTruthy();

            // excluded should remain a plain object
            instance.excluded = { val: "world" };
            expect(instance.excluded.$isProxy).toBeUndefined();
        });

        test("should skip root properties set to false", () => {
            const testName = "test-skip-false";
            const testSchema = new Schema(testName);
            class FalseTest {
                public skipped: any;
            }

            const schemaMap = schemaRegistry.get(testName) as Map<string, JSONSchema>;
            schemaMap.set("skipped", {
                $schema: "https://json-schema.org/draft/2019-09/schema",
                $id: `https://fast.design/schemas/${testName}/skipped.json`,
                type: "object",
                properties: { val: { type: "string" } },
                [defsPropertyName]: {},
            });

            const om = new ObserverMap(FalseTest.prototype, testSchema, {
                properties: { skipped: false },
            });
            om.defineProperties();

            const instance = new FalseTest();
            instance.skipped = { val: "hello" };

            // skipped should remain a plain object
            expect(instance.skipped.$isProxy).toBeUndefined();
        });

        test("should observe all properties when config has no properties key", () => {
            const testName = "test-observe-all";
            const testSchema = new Schema(testName);
            class AllTest {
                public data: any;
            }

            const schemaMap = schemaRegistry.get(testName) as Map<string, JSONSchema>;
            schemaMap.set("data", {
                $schema: "https://json-schema.org/draft/2019-09/schema",
                $id: `https://fast.design/schemas/${testName}/data.json`,
                type: "object",
                properties: { val: { type: "string" } },
                [defsPropertyName]: {},
            });

            // Empty config object = observe all
            const om = new ObserverMap(AllTest.prototype, testSchema, {});
            om.defineProperties();

            const instance = new AllTest();
            instance.data = null;
            instance.data = { val: "hello" };

            expect(instance.data.$isProxy).toBeTruthy();
        });

        test("should observe nothing when properties is empty", () => {
            const testName = "test-observe-nothing";
            const testSchema = new Schema(testName);
            class NoneTest {
                public data: any;
            }

            const schemaMap = schemaRegistry.get(testName) as Map<string, JSONSchema>;
            schemaMap.set("data", {
                $schema: "https://json-schema.org/draft/2019-09/schema",
                $id: `https://fast.design/schemas/${testName}/data.json`,
                type: "object",
                properties: { val: { type: "string" } },
                [defsPropertyName]: {},
            });

            // properties: {} = observe nothing
            const om = new ObserverMap(NoneTest.prototype, testSchema, {
                properties: {},
            });
            om.defineProperties();

            const instance = new NoneTest();
            instance.data = { val: "hello" };

            expect(instance.data.$isProxy).toBeUndefined();
        });
    });
});
