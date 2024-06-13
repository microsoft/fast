import { AsyncLocalStorage } from "async_hooks";
import { DI, DOMContainer } from "@microsoft/fast-element/di.js";
import { createWindow } from "./dom-shim.js";

let asyncLocalStorage = new AsyncLocalStorage();
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

const perRequestGetters = perRequestGlobals.reduce((accum, key) => {
    accum[key] = function get() {
        // Return original global variable if currently not in the storage scope
        const store = asyncLocalStorage.getStore() as Map<string, any>;
        return store ? store.get("window")[key] : preShimGlobals.get(key);
    };
    return accum;
}, {} as Record<string, () => unknown>);

/**
 * Tests whether the {@link RequestStorageManager} has an installed
 * DOM shim for a provided key. Determination is performed by checking
 * the getter instance of the globalThis's property descriptor against the preRequestDescriptors
 * of the same key.
 * @param key - The key of the global check for installation
 */
function shimIsInstalledFor(key: string): boolean {
    return (
        Object.getOwnPropertyDescriptor(globalThis, key)?.get === perRequestGetters[key]
    );
}

/**
 * Store the global objects being shimmed so that they be accessed as backup values
 * and restored during uninstall.
 */
const preShimGlobals = new Map<string, any>();
const preShimDescriptors = new Map<string, PropertyDescriptor>();

/**
 * APIs used in configuring and managing RequestStorage.
 * @beta
 */
export const RequestStorageManager = Object.freeze({
    /**
     * Gets the current AsyncLocalStorage instance that provides
     * the backend for the RequestStorageManager.
     */
    get backend(): AsyncLocalStorage<unknown> {
        return asyncLocalStorage;
    },

    /**
     * Sets an AsyncLocalStorage instance to provide
     * a pre-existing backend for the RequestStorageManager.
     * @remarks
     * Replacing the default AsyncLocalStorage backend should not be
     * done under normal circumstances. This capability is intended for
     * advanced integration scenarios only.
     *
     * Avoid setting this property after middleware is installed or in the
     * middle of a RequestStorageManager#run operation. In the event that
     * this timing is necessary, then you must provide a window instance
     * available through the "window" key of your storage, otherwise the
     * necessary requirements for RequestStorage to function will not be met.
     */
    set backend(localStorage: AsyncLocalStorage<unknown>) {
        asyncLocalStorage = localStorage;
    },

    /**
     * Installs a DOM shim that ensures that window, document,
     * and other globals are scoped per-request. Calling this function
     * will have no effect if the shim has already been installed.
     *
     * @throws TypeError when properties cannot be defined on the globalThis.
     */
    installDOMShim(): void {
        for (const key of perRequestGlobals) {
            if (!shimIsInstalledFor(key)) {
                const preShimValue = (globalThis as any)[key];
                preShimGlobals.set(key, (globalThis as any)[key]);
                const preShimDescriptor = Object.getOwnPropertyDescriptor(
                    globalThis,
                    key
                );

                // This will throw if the globalThis already contains a value for the key that is not configurable. Do this work
                // prior to caching value and descriptor so if it does throw, the caches aren't polluted
                Object.defineProperty(globalThis, key, {
                    get: perRequestGetters[key],
                    enumerable: true,
                    configurable: true,
                });

                if (preShimDescriptor) {
                    preShimDescriptors.set(key, preShimDescriptor);
                }

                preShimGlobals.set(key, preShimValue);
            }
        }
    },

    /**
     * Uninstalls the DOM shim installed by {@link RequestStorageManager.installDOMShim}.
     * Calling this function will have no effect if there is no shim installed.
     */
    uninstallDOMShim(): void {
        for (const key of perRequestGlobals) {
            if (shimIsInstalledFor(key)) {
                if (preShimDescriptors.has(key)) {
                    Object.defineProperty(globalThis, key, preShimDescriptors.get(key)!);
                    preShimDescriptors.delete(key);
                } else {
                    delete (globalThis as any)[key];
                }

                preShimGlobals.delete(key);
            }
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
