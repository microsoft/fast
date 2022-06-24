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

export const RequestStorage = Object.freeze({
    get container(): DOMContainer {
        return RequestStorage.get("$$container$$", () =>
            DI.getOrCreateDOMContainer(window)
        );
    },

    set(key: any, value: any) {
        getStore().set(key, value);
        return this;
    },

    get: getItem,

    clear(): void {
        getStore().clear();
    },

    delete(key: any): boolean {
        return getStore().delete(key);
    },

    has(key: any): boolean {
        return getStore().has(key);
    },
});

export type StorageOptions = {
    createWindow?: () => { [key: string]: unknown };
    storage?: Map<any, any>;
};

export type Middleware = (req: any, res: any, next: () => any) => void;

const perRequestGlobals = [
    "dispatchEvent",
    "addEventListener",
    "removeEventListener",
    "window",
    "document",
];

export const RequestStorageManager = Object.freeze({
    installDOMShim() {
        for (const key of perRequestGlobals) {
            Reflect.defineProperty(globalThis, key, {
                get() {
                    return RequestStorage.get("window")[key];
                },
            });
        }
    },

    installDIContextRequestStrategy() {
        DI.installAsContextRequestStrategy(() => RequestStorage.container);
    },

    createStorage(options: StorageOptions = defaultOptions) {
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

    run<T = unknown>(storage: Map<any, any>, callback: () => T): T {
        return asyncLocalStorage.run(storage, callback);
    },

    middleware(options: StorageOptions = defaultOptions): Middleware {
        RequestStorageManager.installDOMShim();

        return (req: any, res: any, next: () => any): void => {
            const storage = RequestStorageManager.createStorage(options);
            RequestStorageManager.run(storage, next);
        };
    },
});
