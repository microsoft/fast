import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";

test.describe("ObserverMap", async () => {
    let observerMap: ObserverMap;
    class TestClass {}

    test.beforeEach(async () => {
        // Use TestClass.prototype so instances will have the observable properties
        observerMap = new ObserverMap(TestClass.prototype);
    });

    test("should create new instances", async () => {
        const instance1 = new ObserverMap(TestClass.prototype);
        const instance2 = new ObserverMap(TestClass.prototype);
        expect(instance1).not.toBe(instance2);
    });

    test("should define observable properties on prototypes", async () => {
        observerMap.defineProperty("testProperty");

        const definedProperties = observerMap.getDefinedProperties();
        expect(definedProperties.has("testProperty")).toBe(true);
    });

    test("should cache binding paths", async () => {
        // Cache various paths
        observerMap.cachePath("user.profile.name");
        observerMap.cachePath("user.settings.theme");
        observerMap.cachePath("config.version");

        // Verify paths are cached
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.has("user.profile.name")).toBe(true);
        expect(cachedPaths.has("user.settings.theme")).toBe(true);
        expect(cachedPaths.has("config.version")).toBe(true);
    });

    test("should extract root properties from cached paths", async () => {
        // Cache various paths with different root properties
        observerMap.cachePath("user.profile.name");
        observerMap.cachePath("user.settings.theme");
        observerMap.cachePath("config.version");
        observerMap.cachePath("app.modules.auth.enabled");
        observerMap.cachePath("data.items.title");
        observerMap.cachePath("singleProperty");

        // Get root properties
        const rootProperties = observerMap.getCachedRootProperties();

        // Should contain unique root properties only
        expect(rootProperties.size).toBe(5);
        expect(rootProperties.has("user")).toBe(true);
        expect(rootProperties.has("config")).toBe(true);
        expect(rootProperties.has("app")).toBe(true);
        expect(rootProperties.has("data")).toBe(true);
        expect(rootProperties.has("singleProperty")).toBe(true);

        // Should not contain duplicates even though "user" appears in multiple paths
        expect(Array.from(rootProperties)).toEqual(
            expect.arrayContaining(["user", "config", "app", "data", "singleProperty"])
        );
    });

    test("should define multiple observable properties", async () => {
        // Define several properties
        observerMap.defineProperty("property1");
        observerMap.defineProperty("property2");
        observerMap.defineProperty("property3");

        // Verify all properties are tracked
        const definedProperties = observerMap.getDefinedProperties();
        expect(definedProperties.size).toBe(3);
        expect(definedProperties.has("property1")).toBe(true);
        expect(definedProperties.has("property2")).toBe(true);
        expect(definedProperties.has("property3")).toBe(true);
    });

    test("should handle empty path cache", async () => {
        // Get root properties from empty cache
        const rootProperties = observerMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(0);

        // Get cached paths from empty cache
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.size).toBe(0);
    });

    test("should handle single-level paths (no dots)", async () => {
        // Cache single-level paths
        observerMap.cachePath("user");
        observerMap.cachePath("config");
        observerMap.cachePath("data");

        // Get root properties - should be the same as the paths
        const rootProperties = observerMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(3);
        expect(rootProperties.has("user")).toBe(true);
        expect(rootProperties.has("config")).toBe(true);
        expect(rootProperties.has("data")).toBe(true);

        // Cached paths should contain the original paths
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.has("user")).toBe(true);
        expect(cachedPaths.has("config")).toBe(true);
        expect(cachedPaths.has("data")).toBe(true);
    });

    test("should handle deeply nested paths", async () => {
        // Cache deeply nested paths
        observerMap.cachePath("level1.level2.level3.level4.value");
        observerMap.cachePath("another.deep.nested.property.path");

        // Get root properties
        const rootProperties = observerMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(2);
        expect(rootProperties.has("level1")).toBe(true);
        expect(rootProperties.has("another")).toBe(true);

        // Verify original paths are preserved
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.has("level1.level2.level3.level4.value")).toBe(true);
        expect(cachedPaths.has("another.deep.nested.property.path")).toBe(true);
    });

    test("should track defined properties separately from cached paths", async () => {
        // Cache some paths
        observerMap.cachePath("user.profile.name");
        observerMap.cachePath("config.settings.theme");

        // Define some properties (which may or may not match cached paths)
        observerMap.defineProperty("user");
        observerMap.defineProperty("app");

        // Verify cached paths
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.size).toBe(2);
        expect(cachedPaths.has("user.profile.name")).toBe(true);
        expect(cachedPaths.has("config.settings.theme")).toBe(true);

        // Verify defined properties
        const definedProperties = observerMap.getDefinedProperties();
        expect(definedProperties.size).toBe(2);
        expect(definedProperties.has("user")).toBe(true);
        expect(definedProperties.has("app")).toBe(true);

        // Verify root properties from cached paths
        const rootProperties = observerMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(2);
        expect(rootProperties.has("user")).toBe(true);
        expect(rootProperties.has("config")).toBe(true);
    });

    test("should handle duplicate path caching", async () => {
        // Cache the same path multiple times
        observerMap.cachePath("user.profile.name");
        observerMap.cachePath("user.profile.name");
        observerMap.cachePath("user.profile.name");

        // Should only be stored once
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.size).toBe(1);
        expect(cachedPaths.has("user.profile.name")).toBe(true);

        // Root properties should also only contain one entry
        const rootProperties = observerMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(1);
        expect(rootProperties.has("user")).toBe(true);
    });

    test("should handle duplicate property definition", async () => {
        // Define the same property multiple times
        observerMap.defineProperty("testProperty");
        observerMap.defineProperty("testProperty");
        observerMap.defineProperty("testProperty");

        // Should only be stored once
        const definedProperties = observerMap.getDefinedProperties();
        expect(definedProperties.size).toBe(1);
        expect(definedProperties.has("testProperty")).toBe(true);
    });
});
