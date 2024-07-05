import "./install-dom-shim.js";
import { expect, test } from "@playwright/test";
import { createWindow } from "./dom-shim.js";
import { RequestStorage, RequestStorageManager } from "./request-storage.js";

const noStorageError = "Storage must be accessed from within a request.";

test.describe("RequestStorageManager", () => {
    test("can create basic backing storage", () => {
        const storage = RequestStorageManager.createStorage();

        expect(storage).toBeInstanceOf(Map);
        expect(storage.get("window")).not.toBeUndefined();
    });

    test("can create backing storage with a custom window", () => {
        const w = createWindow();
        const storage = RequestStorageManager.createStorage({
            createWindow: () => w,
        });

        expect(storage).toBeInstanceOf(Map);
        expect(storage.get("window")).toBe(w);
    });

    test("should pass in request object to createWindow middleware", () => {
        function createWindowShim(req: any) {
            return {
                id: req.headers["id"]
            };
        }
        const request = { headers: { id: "test" } };
        const storage = RequestStorageManager.createStorage({
            createWindow: createWindowShim,
        }, request);

        expect(storage).toBeInstanceOf(Map);
        expect(storage.get("window")).toStrictEqual({id: "test"});
    });

    test("can create backing storage with initial values", () => {
        const initialValues = new Map();
        initialValues.set("hello", "world");

        const storage = RequestStorageManager.createStorage({
            storage: initialValues,
        });

        expect(storage).toBeInstanceOf(Map);
        expect(storage.get("hello")).toBe("world");
    });

    test("can run a callback with the provided storage", () => {
        const initialValues = new Map();
        initialValues.set("hello", "world");

        const storage = RequestStorageManager.createStorage({
            storage: initialValues,
        });

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.get("hello");
        });

        expect(captured).toBe("world");
        expect(() => RequestStorage.get("hello")).toThrow(noStorageError);
    });

    test("can get value from global without being in a storage scope", () => {
        // window is part of perRequestGlobals setup by installDOMShim
        (window as any)["hello"] = "world";
        RequestStorageManager.installDOMShim();

        expect((window as any)["hello"]).toBe("world");
    });

    test("can get different value from global in a storage scope", () => {
        // window is part of perRequestGlobals setup by installDOMShim
        (window as any)["hello"] = "world";
        RequestStorageManager.installDOMShim();

        let captured;
        const storage = RequestStorageManager.createStorage();
        RequestStorageManager.run(storage, () => {
            captured = (window as any)["hello"];
        });

        expect(captured).not.toBe("world");
    });

    test("uninstalling the DOM shim should make previously assigned globals available within callback ", () => {
        // window is part of perRequestGlobals setup by installDOMShim
        (window as any)["hello"] = "world";
        RequestStorageManager.installDOMShim();
        RequestStorageManager.uninstallDOMShim();

        let captured;
        const storage = RequestStorageManager.createStorage();
        RequestStorageManager.run(storage, () => {
            captured = (window as any)["hello"];
        });

        expect(captured).toBe("world");
    });
    test("invoking installDOMShim multiple times should not impact the ability to uninstall the shim with a single invocation of uninstall", () => {
        // window is part of perRequestGlobals setup by installDOMShim
        (window as any)["hello"] = "world";
        RequestStorageManager.installDOMShim();
        RequestStorageManager.installDOMShim();
        RequestStorageManager.installDOMShim();
        RequestStorageManager.uninstallDOMShim();

        let captured;
        const storage = RequestStorageManager.createStorage();
        RequestStorageManager.run(storage, () => {
            captured = (window as any)["hello"];
        });

        expect(captured).toBe("world");
    });
    test("invoking uninstall multiple times should not impact the ability to reinstall the shim with a single invocation of install", () => {
        // window is part of perRequestGlobals setup by installDOMShim
        (window as any)["hello"] = "world";
        RequestStorageManager.installDOMShim();
        RequestStorageManager.uninstallDOMShim();
        RequestStorageManager.uninstallDOMShim();
        RequestStorageManager.uninstallDOMShim();
        RequestStorageManager.installDOMShim();

        let captured;
        const storage = RequestStorageManager.createStorage();
        RequestStorageManager.run(storage, () => {
            captured = (window as any)["hello"];
        });

        expect(captured).not.toBe("world");
    });
});

test.describe("RequestStorage", () => {
    test("provides a DOM container", () => {
        const storage = RequestStorageManager.createStorage();

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.container;
        });

        expect(captured).toBeDefined();
        expect(() => RequestStorage.container).toThrow(noStorageError);
    });

    test("can set and get values", () => {
        const storage = RequestStorageManager.createStorage();

        RequestStorageManager.run(storage, () => {
            RequestStorage.set("hello", "world");
        });

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.get("hello");
        });

        expect(captured).toBe("world");
        expect(() => RequestStorage.get("hello")).toThrow(noStorageError);
    });

    test("can set and check values", () => {
        const storage = RequestStorageManager.createStorage();

        RequestStorageManager.run(storage, () => {
            RequestStorage.set("hello", "world");
        });

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello");
        });

        expect(captured).toBeTruthy();
        expect(() => RequestStorage.get("hello")).toThrow(noStorageError);
    });

    test("can set and delete values", () => {
        const storage = RequestStorageManager.createStorage();

        RequestStorageManager.run(storage, () => {
            RequestStorage.set("hello", "world");
        });

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello");
        });

        expect(captured).toBeTruthy();

        RequestStorageManager.run(storage, () => {
            RequestStorage.delete("hello");
        });

        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello");
        });

        expect(captured).toBeFalsy();
    });

    test("can clear values", () => {
        const storage = RequestStorageManager.createStorage();

        RequestStorageManager.run(storage, () => {
            RequestStorage.set("hello", "world");
            RequestStorage.set("foo", "bar");
        });

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello") && RequestStorage.has("foo");
        });

        expect(captured).toBeTruthy();

        RequestStorageManager.run(storage, () => {
            RequestStorage.clear();
        });

        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello") || RequestStorage.has("foo");
        });

        expect(captured).toBeFalsy();
    });
});
