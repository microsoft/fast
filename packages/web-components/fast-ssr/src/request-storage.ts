import { AsyncLocalStorage } from "async_hooks";
import { DI, DOMContainer } from "@microsoft/fast-foundation";
import { createWindow } from "./dom-shim.js";

const asyncLocalStorage = new AsyncLocalStorage();
const defaultOptions = {};

function getStore() {
    const store = asyncLocalStorage.getStore();

    if (!store) {
        throw new Error("Storage must be accessed from within a request.");
    }

    return store as Map<any, any>;
}

function getItem<T = any>(key: any, fallback: () => T): T;
function getItem<T = any>(key: any): T | undefined;
function getItem<T = any>(key: any, fallback?: () => T): T | undefined {
    const store = getStore();
    let found = store.get(key);

    if (found === void 0 && fallback) {
        found = fallback();
        store.set(key, found);
    }

    return found;
}

/**
 * Get and set values that are local to the current
 * HTTP request.
 * @remarks
 * Also, provides access to a request-scoped DI container.
 * @beta
 */
export const RequestStorage = Object.freeze({
    /**
     * The request-scoped DI container.
     */
    get container(): DOMContainer {
        return RequestStorage.get("$$container$$", () =>
            DI.getOrCreateDOMContainer(window)
        );
    },

    /**
     * Stores a value in request-scoped storage.
     * @param key - The key to store the value under.
     * @param value - The value to store.
     * @returns This RequestStorage instance.
     */
    set(key: any, value: any) {
        getStore().set(key, value);
        return this;
    },

    /**
     * Gets a value from request-scoped storage.
     * @param key - The key to get the value for.
     * @param fallback - A function that provides a value if there is nothing stored under the key.
     * @returns The value stored under the key.
     * @remarks
     * The return result of the fallback function will be stored under the key for later access.
     */
    get: getItem,

    /**
     * Clears all request-scoped values.
     */
    clear(): void {
        getStore().clear();
    },

    /**
     *
     * @param key - The request-scoped key to delete.
     * @returns true if the value was deleted; false otherwise.
     */
    delete(key: any): boolean {
        return getStore().delete(key);
    },

    /**
     * Determines whether there's a request-scoped value for the given key.
     * @param key - The key to check.
     * @returns true if the key exists; false otherwise
     */
    has(key: any): boolean {
        return getStore().has(key);
    },
});

/**
 * Options used in creating the backing storage for RequestStorage.
 * @beta
 */
export type StorageOptions = {
    /**
     * A custom window creation function.
     */
    createWindow?: () => { [key: string]: unknown };

    /**
     * Initial values to setup in the backing store.
     */
    storage?: Map<any, any>;
};

/**
 * An Express-compatible middleware function.
 * @beta
 */
export type Middleware = (req: any, res: any, next: () => any) => void;

const perRequestGlobals = [
    "dispatchEvent",
    "addEventListener",
    "removeEventListener",
    "window",
    "document",
];

/**
 * APIs used in configuring and managing RequestStorage.
 * @beta
 */
export const RequestStorageManager = Object.freeze({
    /**
     * Installs a DOM shim that ensures that window, document,
     * and other globals are scoped per-request.
     */
    installDOMShim(): void {
        for (const key of perRequestGlobals) {
            Reflect.defineProperty(globalThis, key, {
                get() {
                    return RequestStorage.get("window")[key];
                },
            });
        }
    },

    /**
     * Installs the dependency injection system as the strategy for
     * handling Context requests. The installed behavior will use
     * RequestStorage.container as the root DI container.
     */
    installDIContextRequestStrategy(): void {
        DI.installAsContextRequestStrategy(() => RequestStorage.container);
    },

    /**
     * Creates a backing store for RequestStorage.
     * @param options - The options used when creating the backing store for RequestStorage.
     * @returns A Map suitable as a backing store for RequestStorage.
     */
    createStorage(options: StorageOptions = defaultOptions): Map<any, any> {
        const storage = new Map();
        const window = options.createWindow ? options.createWindow() : createWindow();

        storage.set("window", window);

        if (options.storage) {
            for (const [key, value] of options.storage) {
                storage.set(key, value);
            }
        }

        return storage;
    },

    /**
     * Runs a function with the provided storage available through RequestStorage.
     * @param storage - The storage to scope to the callback.
     * @param callback - The function to execute with the storage context.
     * @returns The result of the invoked function.
     */
    run<T = unknown>(storage: Map<any, any>, callback: () => T): T {
        return asyncLocalStorage.run(storage, callback);
    },

    /**
     * Creates an Express-compatible middleware function.
     * @param options - The options used when creating the backing store for RequestStorage.
     * @returns A middleware function.
     * @remarks
     * Invoking this function installs the RequestStorageManager DOM shim and then returns
     * an Express-compatible middleware function. The middleware ensures that a unique
     * storage instance is created for every request and that the following middleware
     * functions in the pipeline are processed in the context of this storage.
     */
    middleware(options: StorageOptions = defaultOptions): Middleware {
        RequestStorageManager.installDOMShim();

        return (req: any, res: any, next: () => any): void => {
            const storage = RequestStorageManager.createStorage(options);
            RequestStorageManager.run(storage, next);
        };
    },
});
