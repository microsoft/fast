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

export const CurrentRequest = Object.freeze({
    get container(): DOMContainer {
        let container = CurrentRequest.get<DOMContainer>("$$container$$");

        if (!container) {
            container = DI.getOrCreateDOMContainer(window);
            CurrentRequest.set("$$container$$", container);
        }

        return container;
    },

    set(key: any, value: any) {
        getStore().set(key, value);
        return this;
    },

    get<T = any>(key: any): T | undefined {
        return getStore().get(key);
    },

    clear() {
        getStore().clear();
    },

    delete(key: any) {
        return getStore().delete(key);
    },

    has(key: any) {
        return getStore().has(key);
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
                    return CurrentRequest.get("window")[key];
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

    middleware(options: MiddlewareOptions = defaultOptions) {
        RequestManager.installDOMShim(options.windowLocals);

        return (req: Request, res: Response, next: () => any) => {
            const storage = RequestManager.createStorage(options);
            RequestManager.run(storage, next);
        };
    },

    installDIContextRequestStrategy() {
        DI.installAsContextRequestStrategy(() => CurrentRequest.container);
    },
});
