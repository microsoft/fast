import { expect, test } from "@playwright/test";
import { devNull } from "os";
import { type AccessCachedPath, type DefaultCachedPath, ObserverMap, RepeatCachedPath } from "./observer-map.js";

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

    test("should cache binding paths", async () => {
        // Cache various paths
        observerMap.cachePath("user.profile.name", false, null, null, "access");
        observerMap.cachePath("user.settings.theme", false, null, null, "access");
        observerMap.cachePath("config.version", false, null, null, "access");

        // Verify paths are cached
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.has("user.profile.name")).toBe(true);
        expect(cachedPaths.has("user.settings.theme")).toBe(true);
        expect(cachedPaths.has("config.version")).toBe(true);
    });

    test("should extract root properties from cached paths", async () => {
        // Cache various paths with different root properties
        observerMap.cachePath("user.profile.name", false, null, null, "access");
        observerMap.cachePath("user.settings.theme", false, null, null, "access");
        observerMap.cachePath("config.version", false, null, null, "access");
        observerMap.cachePath("app.modules.auth.enabled", false, null, null, "access");
        observerMap.cachePath("data.items.title", false, null, null, "access");
        observerMap.cachePath("singleProperty", false, null, null, "access");

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
        observerMap.cachePath("user", false, null, null, "access");
        observerMap.cachePath("config", false, null, null, "access");
        observerMap.cachePath("data", false, null, null, "access");

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
        observerMap.cachePath("level1.level2.level3.level4.value", false, null, null, "access");
        observerMap.cachePath("another.deep.nested.property.path", false, null, null, "access");

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

    test("should handle duplicate path caching", async () => {
        // Cache the same path multiple times
        observerMap.cachePath("user.profile.name", false, null, null, "access");
        observerMap.cachePath("user.profile.name", false, null, null, "access");
        observerMap.cachePath("user.profile.name", false, null, null, "access");

        // Should only be stored once
        const cachedPaths = observerMap.getCachedPaths();
        expect(cachedPaths.size).toBe(1);
        expect(cachedPaths.has("user.profile.name")).toBe(true);

        // Root properties should also only contain one entry
        const rootProperties = observerMap.getCachedRootProperties();
        expect(rootProperties.size).toBe(1);
        expect(rootProperties.has("user")).toBe(true);
    });

    test.describe.only("should calculate an absolute path", async () => {
        test("when the level is 0 and no context path is provided", async () => {
            expect(observerMap.getAbsolutePath("a", false, 0, null, null, "access")).toEqual("a");
        });
        test("when the level is at 2 and the path is 2 levels up and no context path is provided", async () => {
            expect(observerMap.getAbsolutePath("../../a", false, 2, null, null, "access")).toEqual("a");
        });
        test("when the level is at 2 and the path is 1 level up with a multi-level of context path", async () => {
            expect(observerMap.getAbsolutePath("../a", false, 2, null, "b.c.d", "access")).toEqual("b.c.a");
        });
        test("when the level is at 2 and the path is 0 levels up with a multi-level context path", async () => {
            expect(observerMap.getAbsolutePath("a", false, 2, null, "b.c.d", "access")).toEqual("b.a");
        });
        test("when the level is at 2 and the path is 1 level up with a single level context path", async () => {
            expect(observerMap.getAbsolutePath("../a", false, 2, null, "b", "access")).toEqual("a");
        });
        test("when the level is 0 and the path is 0 a context has been provided and a repeat type", async () => {
            expect(observerMap.getAbsolutePath("items", false, 0, null, "item", "repeat")).toEqual("items");
        });
        test("when the item refers to itself", async () => {
            expect(observerMap.getAbsolutePath("item.a", true, 1, null, "items", "access")).toEqual("items.__index__.a");
        });
        test("when a parent context is given", async () => {
            /**
             * This should create a "users" context, which in turn should create an "items" context,
             * these should have Symbol references to each other
             */
            observerMap.cachePathWithContext("users", false, null, "user", "repeat", 0);
            observerMap.cachePathWithContext("items", true, "user", "item", "repeat", 1);
            observerMap.cachePathWithContext("item.a", true, "item", null, "access", 2);

            expect(observerMap.getAbsolutePath("item.a", true, 1, "user", "items", "access")).toEqual("users.__index__.items.__index__.a");
        });
    });

    test.describe.only("should cache paths with contexts", async () => {
        test("should cache a path", async () => {
            observerMap.cachePathWithContext("a", false, null, null, "access", 0);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();
            expect(cachedPathsWithContext["a"]).toBeDefined();
            expect(cachedPathsWithContext["a"].type).toEqual("default");
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"]).toBeDefined();
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"].type).toEqual("access");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"] as AccessCachedPath).relativePath).toEqual("a");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"] as AccessCachedPath).absolutePath).toEqual("a");
        });
        test("should cache a nested path", async () => {
            observerMap.cachePathWithContext("a.b.c", false, null, null, "access", 0);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();
            expect(cachedPathsWithContext["a"]).toBeDefined();
            expect(cachedPathsWithContext["a"].type).toEqual("default");
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"]).toBeDefined();
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"].type).toEqual("access");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"] as AccessCachedPath).relativePath).toEqual("a.b.c");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"] as AccessCachedPath).absolutePath).toEqual("a.b.c");
        });
        test("should cache multiple paths", async () => {
            observerMap.cachePathWithContext("a.b.c", false, null, null, "access", 0);
            observerMap.cachePathWithContext("a.b.d", false, null, null, "access", 0);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();
            expect(cachedPathsWithContext["a"]).toBeDefined();
            expect(cachedPathsWithContext["a"].type).toEqual("default");
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"]).toBeDefined();
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"].type).toEqual("access");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"] as AccessCachedPath).relativePath).toEqual("a.b.c");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"] as AccessCachedPath).absolutePath).toEqual("a.b.c");
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.d"]).toBeDefined();
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.d"].type).toEqual("access");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.d"] as AccessCachedPath).relativePath).toEqual("a.b.d");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.d"] as AccessCachedPath).absolutePath).toEqual("a.b.d");
        });
        test("should cache a path with context", async () => {
            /**
             * Example:
             * <f-repeat value="{{item in items}}">
             *     {{item.a}}
             * </f-repeat>
             */
            observerMap.cachePathWithContext("items", false, null, "item", "repeat", 0);
            observerMap.cachePathWithContext("item.a", true, "item", null, "access", 1);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();

            expect(cachedPathsWithContext["items"]).toBeDefined();
            expect(cachedPathsWithContext["items"].type).toEqual("repeat");
            expect((cachedPathsWithContext["items"] as RepeatCachedPath).context).toEqual("item");
            expect((cachedPathsWithContext["items"] as RepeatCachedPath).paths["item.a"]).toBeDefined();
            expect((cachedPathsWithContext["items"] as DefaultCachedPath).paths["item.a"].type).toEqual("access");
            expect(((cachedPathsWithContext["items"] as DefaultCachedPath).paths["item.a"] as AccessCachedPath).relativePath).toEqual("item.a");
            expect(((cachedPathsWithContext["items"] as DefaultCachedPath).paths["item.a"] as AccessCachedPath).absolutePath).toEqual("items.__index__.a");
        });
        test("should cache a nested path with context", async () => {
            /**
             * Example:
             * <f-repeat value="{{item in root.items}}">
             *     {{item.a}}
             * </f-repeat>
             */
            observerMap.cachePathWithContext("root.items", false, null, "item", "repeat", 0);
            observerMap.cachePathWithContext("item.a", true, "item", null, "access", 1);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();

            expect(cachedPathsWithContext["root"]).toBeDefined();
            expect(cachedPathsWithContext["root"].type).toEqual("default");

            const root = cachedPathsWithContext["root"] as DefaultCachedPath;

            expect(root.paths["items"]).toBeDefined();

            const items = root.paths["items"] as RepeatCachedPath;
            expect(items.type).toEqual("repeat");
            expect(items.context).toEqual("item");
            expect(items.paths["item.a"]).toBeDefined();

            const itemA = items.paths["item.a"];

            expect((itemA as AccessCachedPath).type).toEqual("access");
            expect((itemA as AccessCachedPath).relativePath).toEqual("item.a");
            expect((itemA as AccessCachedPath).absolutePath).toEqual("root.items.__index__.a");
        });
        test("should cache a nested repeat with nested path with context", async () => {
            /**
             * Example:
             * <f-repeat value="{{item in root.items}}">
             *     {{item.a}}
             *     <f-repeat value="{{subitem in item.subitems}}">
             *         {{subitem.title}}
             *     </f-repeat>
             * </f-repeat>
             */
            observerMap.cachePathWithContext("root.items", false, null, "item", "repeat", 0);
            observerMap.cachePathWithContext("item.a", true, "item", null, "access", 1);
            observerMap.cachePathWithContext("item.subitems", true, "item", "subitem", "repeat", 1);
            observerMap.cachePathWithContext("subitem.title", true, "subitem", null, "access", 2);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();

            expect(cachedPathsWithContext["root"]).toBeDefined();
            expect(cachedPathsWithContext["root"].type).toEqual("default");

            const root = cachedPathsWithContext["root"] as DefaultCachedPath;

            expect(root.paths["items"]).toBeDefined();

            const items = root.paths["items"] as RepeatCachedPath;
            expect(items.type).toEqual("repeat");
            expect(items.context).toEqual("item");
            expect(items.paths["item.a"]).toBeDefined();

            const itemA = items.paths["item.a"];

            expect((itemA as AccessCachedPath).type).toEqual("access");
            expect((itemA as AccessCachedPath).relativePath).toEqual("item.a");
            expect((itemA as AccessCachedPath).absolutePath).toEqual("root.items.__index__.a");

            expect(items.paths["subitems"]).toBeDefined();
            const subItems = items.paths["subitems"];

            expect((subItems as RepeatCachedPath).type).toEqual("repeat");
            expect((subItems as RepeatCachedPath).context).toEqual("subitem");
            expect((subItems as RepeatCachedPath).paths["subitem.title"]).toBeDefined();

            const subItemTitle = (subItems as RepeatCachedPath).paths["subitem.title"];

            expect((subItemTitle as AccessCachedPath).type).toEqual("access");
            expect((subItemTitle as AccessCachedPath).relativePath).toEqual("subitem.title");
            expect((subItemTitle as AccessCachedPath).absolutePath).toEqual("root.items.__index__.subitems.__index__.title");
        });
        test("should cache a multiple nested repeat with nested path with context", async () => {
            /**
             * Example:
             * <f-repeat value="{{item in root.items}}">
             *     {{item.a}}
             *     <f-repeat value="{{user in item.users}}">
             *         {{user.name}}
             *         <f-repeat value="{{badge in user.badges}}">
             *             {{badge}}
             *         </f-repeat>
             *     </f-repeat>
             *     <f-repeat value="{{setting in item.settings}}">
             *         {{setting.visibility}}
             *     </f-repeat>
             * </f-repeat>
             */
            observerMap.cachePathWithContext("root.items", false, null, "item", "repeat", 0);
            observerMap.cachePathWithContext("item.a", true, "item", null, "access", 1);
            observerMap.cachePathWithContext("item.users", true, "item", "user", "repeat", 1);
            observerMap.cachePathWithContext("user.name", true, "user", null, "access", 2);
            observerMap.cachePathWithContext("user.badges", true, "user", "badge", "repeat", 2);
            observerMap.cachePathWithContext("badge", true, "badge", null, "access", 3);
            observerMap.cachePathWithContext("item.settings", true, "item", "setting", "repeat", 1);
            observerMap.cachePathWithContext("setting.visibility", true, "setting", null, "access", 2);

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();

            // Verify root structure
            expect(cachedPathsWithContext["root"]).toBeDefined();
            expect(cachedPathsWithContext["root"].type).toEqual("default");

            const root = cachedPathsWithContext["root"] as DefaultCachedPath;

            // Verify items repeat structure
            expect(root.paths["items"]).toBeDefined();
            const items = root.paths["items"] as RepeatCachedPath;
            expect(items.type).toEqual("repeat");
            expect(items.context).toEqual("item");

            // Verify item.a access path
            expect(items.paths["item.a"]).toBeDefined();
            const itemA = items.paths["item.a"] as AccessCachedPath;
            expect(itemA.type).toEqual("access");
            expect(itemA.relativePath).toEqual("item.a");
            expect(itemA.absolutePath).toEqual("root.items.__index__.a");

            // Verify users repeat structure under items
            expect(items.paths["users"]).toBeDefined();
            const users = items.paths["users"] as RepeatCachedPath;
            expect(users.type).toEqual("repeat");
            expect(users.context).toEqual("user");

            // Verify user.name access path
            expect(users.paths["user.name"]).toBeDefined();
            const userName = users.paths["user.name"] as AccessCachedPath;
            expect(userName.type).toEqual("access");
            expect(userName.relativePath).toEqual("user.name");
            expect(userName.absolutePath).toEqual("root.items.__index__.users.__index__.name");

            // Verify badges repeat structure under users
            expect(users.paths["badges"]).toBeDefined();
            const badges = users.paths["badges"] as RepeatCachedPath;
            expect(badges.type).toEqual("repeat");
            expect(badges.context).toEqual("badge");

            // Verify badge access path
            expect(badges.paths["badge"]).toBeDefined();
            const badge = badges.paths["badge"] as AccessCachedPath;
            expect(badge.type).toEqual("access");
            expect(badge.relativePath).toEqual("badge");
            expect(badge.absolutePath).toEqual("root.items.__index__.users.__index__.badges.__index__");

            // Verify settings repeat structure under items (sibling to users)
            expect(items.paths["settings"]).toBeDefined();
            const settings = items.paths["settings"] as RepeatCachedPath;
            expect(settings.type).toEqual("repeat");
            expect(settings.context).toEqual("setting");

            // Verify setting.visibility access path
            expect(settings.paths["setting.visibility"]).toBeDefined();
            const settingVisibility = settings.paths["setting.visibility"] as AccessCachedPath;
            expect(settingVisibility.type).toEqual("access");
            expect(settingVisibility.relativePath).toEqual("setting.visibility");
            expect(settingVisibility.absolutePath).toEqual("root.items.__index__.settings.__index__.visibility");
        });
    })
});
