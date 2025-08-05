import { expect, test } from "@playwright/test";
import { ObserverMap } from "./observer-map.js";
import type {
    AccessCachedPath,
    DefaultCachedPath,
    RepeatCachedPath,
} from "./utilities.js";

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

    test.describe("should calculate an absolute path", async () => {
        test("when the level is 0 and no context path is provided", async () => {
            expect(observerMap.getAbsolutePath({
                path: "a",
                self: false,
                level: 0,
                parentContext: null,
                contextPath: null,
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("a");
        });
        test("when the level is at 2 and the path is 2 levels up and no context path is provided", async () => {
            expect(observerMap.getAbsolutePath({
                path: "../../a",
                self: false,
                level: 2,
                parentContext: null,
                contextPath: null,
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("a");
        });
        test("when the level is at 2 and the path is 1 level up with a multi-level of context path", async () => {
            expect(observerMap.getAbsolutePath({
                path: "../a",
                self: false,
                level: 2,
                parentContext: null,
                contextPath: "b.c.d",
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("b.c.a");
        });
        test("when the level is at 2 and the path is 0 levels up with a multi-level context path", async () => {
            expect(observerMap.getAbsolutePath({
                path: "a",
                self: false,
                level: 2,
                parentContext: null,
                contextPath: "b.c.d",
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("b.a");
        });
        test("when the level is at 2 and the path is 1 level up with a single level context path", async () => {
            expect(observerMap.getAbsolutePath({
                path: "../a",
                self: false,
                level: 2,
                parentContext: null,
                contextPath: "b",
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("a");
        });
        test("when the level is 0 and the path is 0 a context has been provided and a repeat type", async () => {
            expect(observerMap.getAbsolutePath({
                path: "items",
                self: false,
                level: 0,
                parentContext: null,
                contextPath: "item",
                type: "repeat",
                rootPath: null,
                context: null,
            })).toEqual("items");
        });
        test("when the item refers to itself", async () => {
            expect(observerMap.getAbsolutePath({
                path: "item.a",
                self: true,
                level: 1,
                parentContext: null,
                contextPath: "items",
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("items.__index__.a");
        });
        test("when a parent context is given", async () => {
            /**
             * This should create a "users" context, which in turn should create an "items" context,
             * these should have Symbol references to each other
             */
            observerMap.cachePathWithContext({
                path: "users",
                self: false,
                parentContext: null,
                contextPath: "user",
                type: "repeat",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "items",
                self: true,
                parentContext: "user",
                contextPath: "item",
                type: "repeat",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.a",
                self: true,
                parentContext: "item",
                contextPath: null,
                type: "access",
                level: 2,
                rootPath: null,
                context: null,
            });

            expect(observerMap.getAbsolutePath({
                path: "item.a",
                self: true,
                level: 1,
                parentContext: "user",
                contextPath: "items",
                type: "access",
                rootPath: null,
                context: null,
            })).toEqual("users.__index__.items.__index__.a");
        });
    });

    test.describe("should cache paths with contexts", async () => {
        test("should cache a path", async () => {
            observerMap.cachePathWithContext({
                path: "a",
                self: false,
                parentContext: null,
                contextPath: null,
                type: "access",
                level: 0,
                rootPath: null,
                context: null,
            });

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();
            expect(cachedPathsWithContext["a"]).toBeDefined();
            expect(cachedPathsWithContext["a"].type).toEqual("default");
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"]).toBeDefined();
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"].type).toEqual("access");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"] as AccessCachedPath).relativePath).toEqual("a");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a"] as AccessCachedPath).absolutePath).toEqual("a");
        });
        test("should cache a nested path", async () => {
            observerMap.cachePathWithContext({
                path: "a.b.c",
                self: false,
                parentContext: null,
                contextPath: null,
                type: "access",
                level: 0,
                rootPath: null,
                context: null,
            });

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();
            expect(cachedPathsWithContext["a"]).toBeDefined();
            expect(cachedPathsWithContext["a"].type).toEqual("default");
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"]).toBeDefined();
            expect((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"].type).toEqual("access");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"] as AccessCachedPath).relativePath).toEqual("a.b.c");
            expect(((cachedPathsWithContext["a"] as DefaultCachedPath).paths["a.b.c"] as AccessCachedPath).absolutePath).toEqual("a.b.c");
        });
        test("should cache multiple paths", async () => {
            observerMap.cachePathWithContext({
                path: "a.b.c",
                self: false,
                parentContext: null,
                contextPath: null,
                type: "access",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "a.b.d",
                self: false,
                parentContext: null,
                contextPath: null,
                type: "access",
                level: 0,
                rootPath: null,
                context: null,
            });

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
            observerMap.cachePathWithContext({
                path: "items",
                self: false,
                parentContext: null,
                contextPath: "item",
                type: "repeat",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.a",
                self: true,
                parentContext: "item",
                contextPath: null,
                type: "access",
                level: 1,
                rootPath: null,
                context: null,
            });

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
            observerMap.cachePathWithContext({
                path: "root.items",
                self: false,
                parentContext: null,
                contextPath: "item",
                type: "repeat",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.a",
                self: true,
                parentContext: "item",
                contextPath: null,
                type: "access",
                level: 1,
                rootPath: null,
                context: null,
            });

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
            observerMap.cachePathWithContext({
                path: "root.items",
                self: false,
                parentContext: null,
                contextPath: "item",
                type: "repeat",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.a",
                self: true,
                parentContext: "item",
                contextPath: null,
                type: "access",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.subitems",
                self: true,
                parentContext: "item",
                contextPath: "subitem",
                type: "repeat",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "subitem.title",
                self: true,
                parentContext: "subitem",
                contextPath: null,
                type: "access",
                level: 2,
                rootPath: null,
                context: null,
            });

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
            observerMap.cachePathWithContext({
                path: "root.items",
                self: false,
                parentContext: null,
                contextPath: "item",
                type: "repeat",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.a",
                self: true,
                parentContext: "item",
                contextPath: null,
                type: "access",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.users",
                self: true,
                parentContext: "item",
                contextPath: "user",
                type: "repeat",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "user.name",
                self: true,
                parentContext: "user",
                contextPath: null,
                type: "access",
                level: 2,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "user.badges",
                self: true,
                parentContext: "user",
                contextPath: "badge",
                type: "repeat",
                level: 2,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "badge",
                self: true,
                parentContext: "badge",
                contextPath: null,
                type: "access",
                level: 3,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.settings",
                self: true,
                parentContext: "item",
                contextPath: "setting",
                type: "repeat",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "setting.visibility",
                self: true,
                parentContext: "setting",
                contextPath: null,
                type: "access",
                level: 2,
                rootPath: null,
                context: null,
            });

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
        test("should cache nested repeats with a path reference that belongs to the root parent context", async () => {
            /**
             * Example:
             * <f-repeat value="{{item in root.items}}">
             *     {{item.a}}
             *     <f-repeat value="{{user in item.users}}">
             *         {{user.name}}
             *         <f-repeat value="{{badge in user.badges}}">
             *             {{badge}}
             *             {{../../../selectedId}}
             *         </f-repeat>
             *     </f-repeat>
             * </f-repeat>
             */
            observerMap.cachePathWithContext({
                path: "root.items",
                self: false,
                parentContext: null,
                contextPath: "item",
                type: "repeat",
                level: 0,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.a",
                self: true,
                parentContext: "item",
                contextPath: null,
                type: "access",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "item.users",
                self: true,
                parentContext: "item",
                contextPath: "user",
                type: "repeat",
                level: 1,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "user.name",
                self: true,
                parentContext: "user",
                contextPath: null,
                type: "access",
                level: 2,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "user.badges",
                self: true,
                parentContext: "user",
                contextPath: "badge",
                type: "repeat",
                level: 2,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "badge",
                self: true,
                parentContext: "badge",
                contextPath: null,
                type: "access",
                level: 3,
                rootPath: null,
                context: null,
            });
            observerMap.cachePathWithContext({
                path: "../../../selectedId",
                self: true,
                parentContext: "badge",
                contextPath: null,
                type: "access",
                level: 3,
                rootPath: null,
                context: null,
            });

            const cachedPathsWithContext = observerMap.getCachedPathsWithContext();

            // Verify root structure
            expect(cachedPathsWithContext["root"]).toBeDefined();
            expect(cachedPathsWithContext["root"].type).toEqual("default");

            // Verify a nested item has been elevated to the root
            expect(cachedPathsWithContext["selectedId"]).toBeDefined();
            const selectedId = cachedPathsWithContext["selectedId"] as AccessCachedPath;
            expect(selectedId.type).toEqual("access");
            expect(selectedId.relativePath).toEqual("selectedId");
            expect(selectedId.absolutePath).toEqual("selectedId");
        });
    });
});
