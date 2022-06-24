import { AsyncLocalStorage } from "async_hooks";
import { createWindow } from "./dom-shim.js";

const asyncLocalStorage = new AsyncLocalStorage();
const defaultOptions = {};

export const RequestStorage = Object.freeze({
    set(key: any, value: any) {
        (asyncLocalStorage.getStore() as Map<any, any>).set(key, value);
    },

    get<T = any>(key: any): T | undefined {
        return (asyncLocalStorage.getStore() as Map<any, any>).get(key);
    },

    clear() {
        (asyncLocalStorage.getStore() as Map<any, any>).clear();
    },

    delete(key: any) {
        (asyncLocalStorage.getStore() as Map<any, any>).delete(key);
    },

    has(key: any) {
        return (asyncLocalStorage.getStore() as Map<any, any>).has(key);
    },
});

export type StorageOptions = {
    createWindow?: () => { [key: string]: unknown };
    storage?: Map<any, any>;
};

export type MiddlewareOptions = StorageOptions & {
    windowLocals?: readonly string[];
};

export const RequestManager = Object.freeze({
    windowLocals: [
        "dispatchEvent",
        "addEventListener",
        "removeEventListener",
        "window",
        "document",
    ] as const,

    installDOMShim(windowLocals?: readonly string[]) {
        windowLocals = windowLocals ?? RequestManager.windowLocals;

        for (const key of windowLocals) {
            Reflect.defineProperty(globalThis, key, {
                get() {
                    return RequestStorage.get("window")[key];
                },
            });
        }
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

    run(storage: Map<any, any>, callback: () => unknown) {
        asyncLocalStorage.run(storage, callback);
    },

    createMiddleware(options: MiddlewareOptions = defaultOptions) {
        RequestManager.installDOMShim(options.windowLocals);

        return (req: Request, res: Response, next: () => any) => {
            const storage = RequestManager.createStorage(options);
            RequestManager.run(storage, next);
        };
    },
});
