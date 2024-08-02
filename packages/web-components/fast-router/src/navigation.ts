import { Router } from "./router.js";

/**
 * @beta
 */
export interface Route {
    readonly path: string;
    readonly name?: string;
    readonly caseSensitive?: boolean;
}

/**
 * @beta
 */
export class NavigationMessage {
    constructor(public path: string) {}
}

/**
 * @beta
 */
export interface NavigationHandler {
    enqueue(msg: NavigationMessage): void;
}

const handlers = new Set<NavigationHandler>();

/**
 * @beta
 */
export const NavigationHandler = Object.freeze({
    register(handler: NavigationHandler) {
        handlers.add(handler);
    },

    unregister(handler: NavigationHandler) {
        handlers.delete(handler);
    },
});

/**
 * @beta
 */
export interface NavigationQueue {
    connect(): void;
    disconnect(): void;
    receive(): Promise<NavigationMessage>;
}

// Cached regex for detecting if a URL is absolute,
// i.e., starts with a scheme or is scheme-relative.
// See http://www.ietf.org/rfc/rfc2396.txt section 3.1 for valid scheme format
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

/**
 * @beta
 */
export const Route = Object.freeze({
    path: Object.freeze({
        get current() {
            return location.pathname + location.search;
        },

        async generateRoute(
            relativeTo: HTMLElement | Router,
            path: string,
            params: Object = {}
        ) {
            let router = "config" in relativeTo ? relativeTo : Router.find(relativeTo);

            while (router !== null) {
                const p = await router.config!.generateRouteFromPath(path, params);

                if (p !== null) {
                    return p;
                }

                router = router.parent;
            }

            return null;
        },

        push(path: string, trigger = true) {
            if (path && absoluteUrl.test(path)) {
                location.href = path;
                return;
            }

            history.pushState({}, document.title, path);

            if (trigger) {
                Route.path.trigger(path);
            }
        },

        replace(path: string, trigger = true) {
            if (path && absoluteUrl.test(path)) {
                location.href = path;
                return;
            }

            history.replaceState({}, document.title, path);

            if (trigger) {
                Route.path.trigger(path);
            }
        },

        trigger(path: string) {
            const message = new NavigationMessage(path);

            for (const handler of handlers) {
                handler.enqueue(message);
            }
        },
    }),

    name: Object.freeze({
        async generateRoute(
            relativeTo: HTMLElement | Router,
            name: string,
            params: Object = {}
        ) {
            let router = "config" in relativeTo ? relativeTo : Router.find(relativeTo);

            while (router !== null) {
                const path = await router.config!.generateRouteFromName(name, params);

                if (path !== null) {
                    return path;
                }

                router = router.parent;
            }

            return null;
        },

        async push(
            relativeTo: HTMLElement | Router,
            name: string,
            params: Object = {},
            trigger = true
        ) {
            const path = await Route.name.generateRoute(relativeTo, name, params);

            if (path !== null) {
                Route.path.push(path, trigger);
            }
        },

        async replace(
            relativeTo: HTMLElement | Router,
            name: string,
            params: Object = {},
            trigger = true
        ) {
            const path = await Route.name.generateRoute(relativeTo, name, params);

            if (path !== null) {
                Route.path.replace(path, trigger);
            }
        },

        async trigger(
            relativeTo: HTMLElement | Router,
            name: string,
            params: Object = {}
        ) {
            const path = await Route.name.generateRoute(relativeTo, name, params);

            if (path !== null) {
                Route.path.trigger(path);
            }
        },
    }),
});

/**
 * @beta
 */
export class DefaultNavigationQueue implements NavigationQueue, NavigationHandler {
    private queue: NavigationMessage[] = [];
    private promise: Promise<NavigationMessage> | null = null;
    private resolve: ((value: NavigationMessage) => void) | null = null;

    public connect() {
        this.enqueue(new NavigationMessage(Route.path.current));
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
        this.enqueue(new NavigationMessage(Route.path.current));
    }
}
