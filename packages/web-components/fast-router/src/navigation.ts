// Cached regex for detecting if a URL is absolute,
// i.e., starts with a scheme or is scheme-relative.

import { Router } from "./router";

// See http://www.ietf.org/rfc/rfc2396.txt section 3.1 for valid scheme format
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

export class NavigationMessage {
    constructor(public path: string) {}
}

export interface NavigationHandler {
    enqueue(msg: NavigationMessage): void;
}

const handlers = new Set<NavigationHandler>();

export const NavigationHandler = Object.freeze({
    register(handler: NavigationHandler) {
        handlers.add(handler);
    },

    unregister(handler: NavigationHandler) {
        handlers.delete(handler);
    },
});

export const Navigation = Object.freeze({
    get path() {
        return location.pathname + location.search;
    },

    async generateRoute(
        relativeTo: HTMLElement,
        nameOrPath: string,
        params: Object = {}
    ) {
        let router = Router.find(relativeTo);

        while (router !== null) {
            const path = await router.config!.generateRoute(nameOrPath, params);

            if (path !== null) {
                return path;
            }

            router = router.parent;
        }

        return null;
    },

    pushPath(path: string, trigger = true) {
        if (path && absoluteUrl.test(path)) {
            location.href = path;
            return;
        }

        history.pushState({}, document.title, path);

        if (trigger) {
            this.triggerPath(path);
        }
    },

    async pushName(
        relativeTo: HTMLElement,
        nameOrPath: string,
        params: Object = {},
        trigger = true
    ) {
        const path = await Navigation.generateRoute(relativeTo, nameOrPath, params);

        if (path !== null) {
            Navigation.pushPath(path, trigger);
        }
    },

    replacePath(path: string, trigger = true) {
        if (path && absoluteUrl.test(path)) {
            location.href = path;
            return;
        }

        history.replaceState({}, document.title, path);

        if (trigger) {
            this.triggerPath(path);
        }
    },

    async replaceName(
        relativeTo: HTMLElement,
        nameOrPath: string,
        params: Object = {},
        trigger = true
    ) {
        const path = await Navigation.generateRoute(relativeTo, nameOrPath, params);

        if (path !== null) {
            Navigation.replacePath(path, trigger);
        }
    },

    triggerPath(path: string) {
        const message = new NavigationMessage(path);

        for (const handler of handlers) {
            handler.enqueue(message);
        }
    },

    async triggerName(relativeTo: HTMLElement, nameOrPath: string, params: Object = {}) {
        const path = await Navigation.generateRoute(relativeTo, nameOrPath, params);

        if (path !== null) {
            Navigation.triggerPath(path);
        }
    },
});

export interface NavigationQueue {
    connect(): void;
    disconnect(): void;
    receive(): Promise<NavigationMessage>;
}

export class DefaultNavigationQueue implements NavigationQueue, NavigationHandler {
    private queue: NavigationMessage[] = [];
    private promise: Promise<NavigationMessage> | null = null;
    private resolve: ((value: NavigationMessage) => void) | null = null;

    public connect() {
        this.enqueue(new NavigationMessage(Navigation.path));
        window.addEventListener("popstate", this);
        NavigationHandler.register(this);
    }

    public disconnect() {
        this.queue = [];
        this.promise = null;
        this.resolve = null;
        window.removeEventListener("popstate", this);
        NavigationHandler.unregister(this);
    }

    public receive(): Promise<NavigationMessage> {
        if (this.promise !== null) {
            return this.promise;
        }

        this.promise = new Promise(resolve => (this.resolve = resolve));
        Promise.resolve().then(() => this.tryDequeue());
        return this.promise;
    }

    public enqueue(msg: NavigationMessage) {
        this.queue.push(msg);
        this.tryDequeue();
    }

    private tryDequeue() {
        if (this.resolve === null || this.queue.length === 0) {
            return;
        }

        const request = this.queue[this.queue.length - 1];
        const resolve = this.resolve;

        this.queue.length = 0;
        this.promise = null;
        this.resolve = null;

        resolve(request);
    }

    public handleEvent(event: PopStateEvent) {
        this.enqueue(new NavigationMessage(Navigation.path));
    }
}
