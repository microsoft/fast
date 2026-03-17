import "./install-dom-shim.js";
import { deepStrictEqual, notStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { describe, test } from "node:test";
import { createWindow } from "./dom-shim.js";
import { RequestStorage, RequestStorageManager } from "./request-storage.js";

const noStorageError = { message: "Storage must be accessed from within a request." };

describe("RequestStorageManager", () => {
    test("can create basic backing storage", () => {
        const storage = RequestStorageManager.createStorage();

        ok(storage instanceof Map);
        notStrictEqual(storage.get("window"), undefined);
    });

    test("can create backing storage with a custom window", () => {
        const w = createWindow();
        const storage = RequestStorageManager.createStorage({
            createWindow: () => w,
        });

        ok(storage instanceof Map);
        strictEqual(storage.get("window"), w);
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

        ok(storage instanceof Map);
        deepStrictEqual(storage.get("window"), {id: "test"});
    });

    test("can create backing storage with initial values", () => {
        const initialValues = new Map();
        initialValues.set("hello", "world");

        const storage = RequestStorageManager.createStorage({
            storage: initialValues,
        });

        ok(storage instanceof Map);
        strictEqual(storage.get("hello"), "world");
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

        strictEqual(captured, "world");
        throws(() => RequestStorage.get("hello"), noStorageError);
    });

    test("can get value from global without being in a storage scope", () => {
        // window is part of perRequestGlobals setup by installDOMShim
        (window as any)["hello"] = "world";
        RequestStorageManager.installDOMShim();

        strictEqual((window as any)["hello"], "world");
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

        notStrictEqual(captured, "world");
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

        strictEqual(captured, "world");
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

        strictEqual(captured, "world");
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

        notStrictEqual(captured, "world");
    });
});

describe("RequestStorage", () => {
    test("provides a DOM container", () => {
        const storage = RequestStorageManager.createStorage();

        let captured;
        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.container;
        });

        notStrictEqual(captured, undefined);
        throws(() => RequestStorage.container, noStorageError);
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

        strictEqual(captured, "world");
        throws(() => RequestStorage.get("hello"), noStorageError);
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

        ok(captured);
        throws(() => RequestStorage.get("hello"), noStorageError);
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

        ok(captured);

        RequestStorageManager.run(storage, () => {
            RequestStorage.delete("hello");
        });

        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello");
        });

        ok(!captured);
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

        ok(captured);

        RequestStorageManager.run(storage, () => {
            RequestStorage.clear();
        });

        RequestStorageManager.run(storage, () => {
            captured = RequestStorage.has("hello") || RequestStorage.has("foo");
        });

        ok(!captured);
    });
});
