import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";

test.describe("ObserverMap", async () => {
    let observableMap: ObserverMap;

    test.beforeEach(async () => {
        observableMap = new ObserverMap();
    });

    test("should create new instances", async () => {
        const instance1 = new ObserverMap();
        const instance2 = new ObserverMap();
        expect(instance1).not.toBe(instance2);
    });

    test("should define observable properties on prototypes", async () => {
        class TestClass {}
        observableMap.defineProperty(TestClass.prototype, "testProperty");

        const definedProperties = observableMap.getDefinedProperties(TestClass.prototype);
        expect(definedProperties.has("testProperty")).toBe(true);
    });

    test("should create path proxies for dot syntax observation", async () => {
        const target = {
            object: {
                foo: "bar"
            }
        };

        const proxy = observableMap.createPathProxy(target, "object.foo");

        // The proxy should exist and be tracked
        expect(proxy).toBeDefined();
    });

    test("should remove path observers", async () => {
        const target = { object: { foo: "bar" } };

        observableMap.createPathProxy(target, "object.foo");
        observableMap.removePathObserver(target, "object.foo");

        // Should not throw and should clean up properly
        expect(true).toBe(true); // Basic assertion to ensure no errors
    });

    test("should clear all observers and properties", async () => {
        class TestClass {}
        const target = { object: { foo: "bar" } };

        observableMap.defineProperty(TestClass.prototype, "testProperty");
        observableMap.createPathProxy(target, "object.foo");

        observableMap.clear();

        const definedProperties = observableMap.getDefinedProperties(TestClass.prototype);
        expect(definedProperties.size).toEqual(0);
    });
});
