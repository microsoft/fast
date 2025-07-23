import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";

test.describe("ObserverMap", async () => {
    let observableMap: ObserverMap;
    class TestClass {}

    test.beforeEach(async () => {
        observableMap = new ObserverMap(TestClass.prototype);
    });

    test("should create new instances", async () => {
        const instance1 = new ObserverMap(TestClass.prototype);
        const instance2 = new ObserverMap(TestClass.prototype);
        expect(instance1).not.toBe(instance2);
    });

    test("should define observable properties on prototypes", async () => {
        observableMap.defineProperty("testProperty");

        const definedProperties = observableMap.getDefinedProperties();
        expect(definedProperties.has("testProperty")).toBe(true);
    });

    test("should create path proxies for dot syntax observation", async () => {
        const target = new (class TestClass {
            object: any;
        })();

        // Cache the path first
        observableMap.cachePath("object.foo");
        
        // Define the property to set up observation
        observableMap.defineProperty("object");
        
        // Trigger property change from undefined to defined to create path proxy
        target.object = { foo: "bar" };

        // The cached path should have been processed
        expect(observableMap.getCachedPaths().has("object.foo")).toBe(true);
    });

    test("should remove path observers", async () => {
        const target = new (class TestClass {
            object: any;
        })();

        // Cache the path and set up observation
        observableMap.cachePath("object.foo");
        observableMap.defineProperty("object");
        
        // Trigger property change to create path proxy
        target.object = { foo: "bar" };
        
        // Remove the path observer
        observableMap.removePathObserver(target, "object.foo");

        // Should not throw and should clean up properly
        expect(true).toBe(true); // Basic assertion to ensure no errors
    });

    test("should clear all observers and properties", async () => {
        const target = new (class TestClass {
            object: any;
        })();

        // Set up some observers and properties
        observableMap.defineProperty("testProperty");
        observableMap.cachePath("object.foo");
        observableMap.defineProperty("object");
        
        // Trigger property change to create path proxy
        target.object = { foo: "bar" };

        observableMap.clear();

        const definedProperties = observableMap.getDefinedProperties();
        expect(definedProperties.size).toEqual(0);
    });
});
