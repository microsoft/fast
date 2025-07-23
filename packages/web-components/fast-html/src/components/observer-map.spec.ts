import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";

test.describe("ObserverMap", async () => {
    let observableMap: ObserverMap;
    class TestClass {}

    test.beforeEach(async () => {
        // Use TestClass.prototype so instances will have the observable properties
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

    test("should extract root properties from cached paths", async () => {
        // Cache various paths with different root properties
        observableMap.cachePath("user.profile.name");
        observableMap.cachePath("user.settings.theme");
        observableMap.cachePath("config.version");
        observableMap.cachePath("app.modules.auth.enabled");
        observableMap.cachePath("data.items.title");
        observableMap.cachePath("singleProperty");

        // Get root properties
        const rootProperties = observableMap.getCachedRootProperties();

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

    test("should create path proxies for dot syntax observation", async () => {
        // Create an instance that extends from the class we're observing
        const target = new TestClass() as any;

        // Cache the path first
        observableMap.cachePath("object.foo");

        // Define the property to set up observation
        observableMap.defineProperty("object");

        // Trigger property change from undefined to defined to create path proxy
        target.object = { foo: "bar" };

        // Manually process cached paths (simulating the reactive system)
        observableMap.processCachedPaths(target, "object");

        // The cached path should have been processed
        expect(observableMap.getCachedPaths().has("object.foo")).toBe(true);

        // Verify that a proxy was actually created for this path
        expect(observableMap.hasPathProxy(target, "object.foo")).toBe(true);
    });

    test("should handle deeply nested property paths", async () => {
        const target = new TestClass() as any;

        // Cache deeply nested paths
        observableMap.cachePath("level1.level2.level3.value");
        observableMap.cachePath("level1.level2.otherValue");

        // Define the root property
        observableMap.defineProperty("level1");

        // Create nested structure - this should trigger path proxy creation
        target.level1 = {
            level2: {
                level3: {
                    value: "deep value"
                },
                otherValue: "other value"
            }
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "level1");

        // Verify the cached paths are still there
        expect(observableMap.getCachedPaths().has("level1.level2.level3.value")).toBe(true);
        expect(observableMap.getCachedPaths().has("level1.level2.otherValue")).toBe(true);

        // Verify that proxies were created for the nested paths
        expect(observableMap.hasPathProxy(target, "level1.level2.level3.value")).toBe(true);
        expect(observableMap.hasPathProxy(target, "level1.level2.otherValue")).toBe(true);
    });

    test("should create proxies when intermediate nested properties are added", async () => {
        const target = new TestClass() as any;

        // Cache paths for properties that don't exist yet
        observableMap.cachePath("root.intermediate.leaf");
        observableMap.cachePath("root.other.property");

        // Define the root property
        observableMap.defineProperty("root");

        // First, create root object without nested properties
        target.root = {};

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "root");

        // Then add intermediate object - this should trigger proxy creation for matching paths
        target.root.intermediate = { leaf: "leaf value" };

        // Add another intermediate object
        target.root.other = { property: "property value" };

        // Verify all cached paths are still tracked
        expect(observableMap.getCachedPaths().has("root.intermediate.leaf")).toBe(true);
        expect(observableMap.getCachedPaths().has("root.other.property")).toBe(true);

        // Verify that proxies were created for the nested paths
        expect(observableMap.hasPathProxy(target, "root.intermediate.leaf")).toBe(true);
        expect(observableMap.hasPathProxy(target, "root.other.property")).toBe(true);

        // Verify we can access the values through the structure
        expect(target.root.intermediate.leaf).toBe("leaf value");
        expect(target.root.other.property).toBe("property value");
    });

    test("should handle multiple levels of dynamic property creation", async () => {
        const target = new TestClass() as any;

        // Cache paths for a complex nested structure
        observableMap.cachePath("app.user.profile.name");
        observableMap.cachePath("app.user.profile.email");
        observableMap.cachePath("app.user.settings.theme");
        observableMap.cachePath("app.config.version");

        // Verify that all paths have the same root property
        const rootProperties = observableMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(1);
        expect(rootProperties.has("app")).toBe(true);

        // Define the root property
        observableMap.defineProperty("app");        // Start with empty app object
        target.app = {};

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "app");

        // Dynamically create nested structure step by step
        target.app.user = {};
        target.app.user.profile = {
            name: "John Doe",
            email: "john@example.com"
        };
        target.app.user.settings = {
            theme: "dark"
        };
        target.app.config = {
            version: "1.0.0"
        };

        // Verify all paths are cached and accessible
        expect(observableMap.getCachedPaths().has("app.user.profile.name")).toBe(true);
        expect(observableMap.getCachedPaths().has("app.user.profile.email")).toBe(true);
        expect(observableMap.getCachedPaths().has("app.user.settings.theme")).toBe(true);
        expect(observableMap.getCachedPaths().has("app.config.version")).toBe(true);

        // Verify that proxies were created for all nested paths
        expect(observableMap.hasPathProxy(target, "app.user.profile.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.user.profile.email")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.user.settings.theme")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.config.version")).toBe(true);

        // Test that values are accessible
        expect(target.app.user.profile.name).toBe("John Doe");
        expect(target.app.user.profile.email).toBe("john@example.com");
        expect(target.app.user.settings.theme).toBe("dark");
        expect(target.app.config.version).toBe("1.0.0");
    });

    test("should handle property updates at different nesting levels", async () => {
        const target = new TestClass() as any;

        // Cache paths for nested properties
        observableMap.cachePath("data.items.firstItem.title");
        observableMap.cachePath("data.items.secondItem.title");
        observableMap.cachePath("data.metadata.count");

        // Define the root property
        observableMap.defineProperty("data");

        // Create initial structure
        target.data = {
            items: {
                firstItem: { title: "First Item" },
                secondItem: { title: "Second Item" }
            },
            metadata: {
                count: 2
            }
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "data");

        // Verify initial values
        expect(target.data.items.firstItem.title).toBe("First Item");
        expect(target.data.items.secondItem.title).toBe("Second Item");
        expect(target.data.metadata.count).toBe(2);

        // Verify that proxies were created for the nested paths
        expect(observableMap.hasPathProxy(target, "data.items.firstItem.title")).toBe(true);
        expect(observableMap.hasPathProxy(target, "data.items.secondItem.title")).toBe(true);
        expect(observableMap.hasPathProxy(target, "data.metadata.count")).toBe(true);

        // Update values at different levels
        target.data.items.firstItem.title = "Updated First Item";
        target.data.metadata.count = 3;

        // Add new item
        target.data.items.thirdItem = { title: "Third Item" };

        // Verify updates
        expect(target.data.items.firstItem.title).toBe("Updated First Item");
        expect(target.data.metadata.count).toBe(3);
        expect(target.data.items.thirdItem.title).toBe("Third Item");
    });

    test("should handle object-like paths and nested properties", async () => {
        const target = new TestClass() as any;

        // Cache paths with nested object properties
        observableMap.cachePath("collection.firstItem.name");
        observableMap.cachePath("collection.secondItem.name");
        observableMap.cachePath("collection.count");

        // Define the root property
        observableMap.defineProperty("collection");

        // Create object-like structure
        target.collection = {
            firstItem: { name: "Item 1" },
            secondItem: { name: "Item 2" },
            count: 2
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "collection");

        // Verify object access works
        expect(target.collection.firstItem.name).toBe("Item 1");
        expect(target.collection.secondItem.name).toBe("Item 2");
        expect(target.collection.count).toBe(2);

        // Verify that proxies were created for the object paths
        expect(observableMap.hasPathProxy(target, "collection.firstItem.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "collection.secondItem.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "collection.count")).toBe(true);

        // Update object properties
        target.collection.firstItem.name = "Updated Item 1";
        target.collection.thirdItem = { name: "Item 3" };
        target.collection.count = 3;

        // Verify updates
        expect(target.collection.firstItem.name).toBe("Updated Item 1");
        expect(target.collection.thirdItem.name).toBe("Item 3");
        expect(target.collection.count).toBe(3);
    });

    test("should return false for hasPathProxy when data does not exist on path", async () => {
        const target = new TestClass() as any;

        // Cache paths for properties that don't exist yet
        observableMap.cachePath("nonexistent.property");
        observableMap.cachePath("root.missing.deeply.nested");
        observableMap.cachePath("partial.exists.but.missing");

        // Verify we have the expected root properties
        const rootProperties = observableMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(3);
        expect(rootProperties.has("nonexistent")).toBe(true);
        expect(rootProperties.has("root")).toBe(true);
        expect(rootProperties.has("partial")).toBe(true);

        // Define some root properties
        observableMap.defineProperty("nonexistent");
        observableMap.defineProperty("root");
        observableMap.defineProperty("partial");        // Verify hasPathProxy returns false for paths that don't have data
        expect(observableMap.hasPathProxy(target, "nonexistent.property")).toBe(false);
        expect(observableMap.hasPathProxy(target, "root.missing.deeply.nested")).toBe(false);
        expect(observableMap.hasPathProxy(target, "partial.exists.but.missing")).toBe(false);

        // Create some data but not all paths
        target.root = { something: "exists" }; // but not 'missing'
        target.partial = { exists: {} }; // but not 'exists.but.missing'

        // Process cached paths to create proxies where possible
        observableMap.processCachedPaths(target, "root");
        observableMap.processCachedPaths(target, "partial");

        // Verify hasPathProxy still returns false for incomplete paths
        expect(observableMap.hasPathProxy(target, "nonexistent.property")).toBe(false);
        expect(observableMap.hasPathProxy(target, "root.missing.deeply.nested")).toBe(false);
        expect(observableMap.hasPathProxy(target, "partial.exists.but.missing")).toBe(false);

        // Now create the complete paths and verify proxies are created
        target.nonexistent = { property: "now exists" };
        target.root.missing = { deeply: { nested: "value" } };
        target.partial.exists.but = { missing: "now present" };

        // Process again to create proxies for newly complete paths
        observableMap.processCachedPaths(target, "nonexistent");
        observableMap.processCachedPaths(target, "root");
        observableMap.processCachedPaths(target, "partial");

        // Now hasPathProxy should return true
        expect(observableMap.hasPathProxy(target, "nonexistent.property")).toBe(true);
        expect(observableMap.hasPathProxy(target, "root.missing.deeply.nested")).toBe(true);
        expect(observableMap.hasPathProxy(target, "partial.exists.but.missing")).toBe(true);
    });

    test("should return false for hasPathProxy on object properties that don't exist", async () => {
        const target = new TestClass() as any;

        // Cache paths for object properties that may not exist
        observableMap.cachePath("items.firstItem.name");
        observableMap.cachePath("items.secondItem.name");
        observableMap.cachePath("items.thirdItem.name");
        observableMap.cachePath("items.nonexistentItem.name");

        // Define the root property
        observableMap.defineProperty("items");

        // Verify hasPathProxy returns false when no object exists
        expect(observableMap.hasPathProxy(target, "items.firstItem.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "items.secondItem.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "items.thirdItem.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "items.nonexistentItem.name")).toBe(false);

        // Create object with only 2 properties
        target.items = {
            firstItem: { name: "Item 0" },
            secondItem: { name: "Item 1" }
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "items");

        // Verify hasPathProxy returns true only for existing properties
        expect(observableMap.hasPathProxy(target, "items.firstItem.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "items.secondItem.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "items.thirdItem.name")).toBe(false); // Property doesn't exist
        expect(observableMap.hasPathProxy(target, "items.nonexistentItem.name")).toBe(false); // Property doesn't exist

        // Add another property
        target.items.thirdItem = { name: "Item 2" };

        // Process cached paths again to create proxy for new property
        observableMap.processCachedPaths(target, "items");

        // Now thirdItem should have a proxy
        expect(observableMap.hasPathProxy(target, "items.thirdItem.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "items.nonexistentItem.name")).toBe(false); // Still doesn't exist
    });

    test("should return false for hasPathProxy when intermediate objects are null or undefined", async () => {
        const target = new TestClass() as any;

        // Cache paths with potential null/undefined intermediate objects
        observableMap.cachePath("data.user.profile.name");
        observableMap.cachePath("config.settings.theme");
        observableMap.cachePath("app.modules.auth.enabled");

        // Define root properties
        observableMap.defineProperty("data");
        observableMap.defineProperty("config");
        observableMap.defineProperty("app");

        // Create structures with null/undefined intermediate objects
        target.data = { user: null };
        target.config = { settings: undefined };
        target.app = {}; // missing 'modules' property entirely

        // Process cached paths
        observableMap.processCachedPaths(target, "data");
        observableMap.processCachedPaths(target, "config");
        observableMap.processCachedPaths(target, "app");

        // Verify hasPathProxy returns false for paths with null/undefined intermediates
        expect(observableMap.hasPathProxy(target, "data.user.profile.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "config.settings.theme")).toBe(false);
        expect(observableMap.hasPathProxy(target, "app.modules.auth.enabled")).toBe(false);

        // Fix the intermediate objects
        target.data.user = { profile: { name: "John" } };
        target.config.settings = { theme: "dark" };
        target.app.modules = { auth: { enabled: true } };

        // Process cached paths again
        observableMap.processCachedPaths(target, "data");
        observableMap.processCachedPaths(target, "config");
        observableMap.processCachedPaths(target, "app");

        // Now hasPathProxy should return true
        expect(observableMap.hasPathProxy(target, "data.user.profile.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "config.settings.theme")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.modules.auth.enabled")).toBe(true);
    });

    test("should remove observer entries when properties are set to undefined", async () => {
        const target = new TestClass() as any;

        // Cache paths for nested properties
        observableMap.cachePath("user.profile.name");
        observableMap.cachePath("user.profile.email");
        observableMap.cachePath("user.settings.theme");
        observableMap.cachePath("data.items.title");

        // Define root properties
        observableMap.defineProperty("user");
        observableMap.defineProperty("data");

        // Create initial structure
        target.user = {
            profile: { name: "John", email: "john@example.com" },
            settings: { theme: "dark" }
        };
        target.data = { items: { title: "Test Item" } };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "user");
        observableMap.processCachedPaths(target, "data");

        // Verify all proxies exist initially
        expect(observableMap.hasPathProxy(target, "user.profile.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "user.profile.email")).toBe(true);
        expect(observableMap.hasPathProxy(target, "user.settings.theme")).toBe(true);
        expect(observableMap.hasPathProxy(target, "data.items.title")).toBe(true);

        // Set user.profile to undefined - should clean up related entries
        target.user.profile = undefined;

        // Paths related to user.profile should now return false
        expect(observableMap.hasPathProxy(target, "user.profile.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "user.profile.email")).toBe(false);

        // Other paths should still work
        expect(observableMap.hasPathProxy(target, "user.settings.theme")).toBe(true);
        expect(observableMap.hasPathProxy(target, "data.items.title")).toBe(true);

        // Set entire user object to undefined - should clean up all user-related entries
        target.user = undefined;

        // All user-related paths should now return false
        expect(observableMap.hasPathProxy(target, "user.profile.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "user.profile.email")).toBe(false);
        expect(observableMap.hasPathProxy(target, "user.settings.theme")).toBe(false);

        // Data paths should still work
        expect(observableMap.hasPathProxy(target, "data.items.title")).toBe(true);
    });

    test("should remove observer entries when properties are set to null", async () => {
        const target = new TestClass() as any;

        // Cache paths for nested properties
        observableMap.cachePath("config.database.host");
        observableMap.cachePath("config.database.port");
        observableMap.cachePath("config.api.key");

        // Define root property
        observableMap.defineProperty("config");

        // Create initial structure
        target.config = {
            database: { host: "localhost", port: 5432 },
            api: { key: "secret-key" }
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "config");

        // Verify all proxies exist initially
        expect(observableMap.hasPathProxy(target, "config.database.host")).toBe(true);
        expect(observableMap.hasPathProxy(target, "config.database.port")).toBe(true);
        expect(observableMap.hasPathProxy(target, "config.api.key")).toBe(true);

        // Set config.database to null - should clean up related entries
        target.config.database = null;

        // Paths related to config.database should now return false
        expect(observableMap.hasPathProxy(target, "config.database.host")).toBe(false);
        expect(observableMap.hasPathProxy(target, "config.database.port")).toBe(false);

        // Other paths should still work
        expect(observableMap.hasPathProxy(target, "config.api.key")).toBe(true);
    });

    test("should remove observer entries when properties are deleted", async () => {
        const target = new TestClass() as any;

        // Cache paths for nested properties
        observableMap.cachePath("app.modules.auth.enabled");
        observableMap.cachePath("app.modules.auth.provider");
        observableMap.cachePath("app.modules.logging.level");
        observableMap.cachePath("app.version");

        // Define root property
        observableMap.defineProperty("app");

        // Create initial structure
        target.app = {
            modules: {
                auth: { enabled: true, provider: "oauth" },
                logging: { level: "info" }
            },
            version: "1.0.0"
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "app");

        // Verify all proxies exist initially
        expect(observableMap.hasPathProxy(target, "app.modules.auth.enabled")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.modules.auth.provider")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.modules.logging.level")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.version")).toBe(true);

        // Delete app.modules.auth - should clean up related entries
        delete target.app.modules.auth;

        // Paths related to app.modules.auth should now return false
        expect(observableMap.hasPathProxy(target, "app.modules.auth.enabled")).toBe(false);
        expect(observableMap.hasPathProxy(target, "app.modules.auth.provider")).toBe(false);

        // Other paths should still work
        expect(observableMap.hasPathProxy(target, "app.modules.logging.level")).toBe(true);
        expect(observableMap.hasPathProxy(target, "app.version")).toBe(true);

        // Delete entire modules object - should clean up remaining module entries
        delete target.app.modules;

        // All module-related paths should now return false
        expect(observableMap.hasPathProxy(target, "app.modules.auth.enabled")).toBe(false);
        expect(observableMap.hasPathProxy(target, "app.modules.auth.provider")).toBe(false);
        expect(observableMap.hasPathProxy(target, "app.modules.logging.level")).toBe(false);

        // Top-level paths should still work
        expect(observableMap.hasPathProxy(target, "app.version")).toBe(true);
    });

    test("should handle recreation of properties after they were set to undefined", async () => {
        const target = new TestClass() as any;

        // Cache paths for nested properties
        observableMap.cachePath("user.profile.name");
        observableMap.cachePath("user.profile.email");

        // Define root property
        observableMap.defineProperty("user");

        // Create initial structure
        target.user = {
            profile: { name: "John", email: "john@example.com" }
        };

        // Process cached paths to create proxies
        observableMap.processCachedPaths(target, "user");

        // Verify proxies exist initially
        expect(observableMap.hasPathProxy(target, "user.profile.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "user.profile.email")).toBe(true);

        // Set user.profile to undefined
        target.user.profile = undefined;

        // Proxies should be cleaned up
        expect(observableMap.hasPathProxy(target, "user.profile.name")).toBe(false);
        expect(observableMap.hasPathProxy(target, "user.profile.email")).toBe(false);

        // Recreate the profile object
        target.user.profile = { name: "Jane", email: "jane@example.com" };

        // Process cached paths again to recreate proxies
        observableMap.processCachedPaths(target, "user");

        // Proxies should be recreated and work again
        expect(observableMap.hasPathProxy(target, "user.profile.name")).toBe(true);
        expect(observableMap.hasPathProxy(target, "user.profile.email")).toBe(true);

        // Values should be accessible
        expect(target.user.profile.name).toBe("Jane");
        expect(target.user.profile.email).toBe("jane@example.com");
    });
});
