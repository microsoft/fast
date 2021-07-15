var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { Router } from "./router";
/**
 * @alpha
 */
export class NavigationMessage {
    constructor(path) {
        this.path = path;
    }
}
const handlers = new Set();
/**
 * @alpha
 */
export const NavigationHandler = Object.freeze({
    register(handler) {
        handlers.add(handler);
    },
    unregister(handler) {
        handlers.delete(handler);
    },
});
// Cached regex for detecting if a URL is absolute,
// i.e., starts with a scheme or is scheme-relative.
// See http://www.ietf.org/rfc/rfc2396.txt section 3.1 for valid scheme format
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
/**
 * @alpha
 */
export const Route = Object.freeze({
    path: Object.freeze({
        get current() {
            return location.pathname + location.search;
        },
        generateRoute(relativeTo, path, params = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                let router =
                    "config" in relativeTo ? relativeTo : Router.find(relativeTo);
                while (router !== null) {
                    const p = yield router.config.generateRouteFromPath(path, params);
                    if (p !== null) {
                        return p;
                    }
                    router = router.parent;
                }
                return null;
            });
        },
        push(path, trigger = true) {
            if (path && absoluteUrl.test(path)) {
                location.href = path;
                return;
            }
            history.pushState({}, document.title, path);
            if (trigger) {
                Route.path.trigger(path);
            }
        },
        replace(path, trigger = true) {
            if (path && absoluteUrl.test(path)) {
                location.href = path;
                return;
            }
            history.replaceState({}, document.title, path);
            if (trigger) {
                Route.path.trigger(path);
            }
        },
        trigger(path) {
            const message = new NavigationMessage(path);
            for (const handler of handlers) {
                handler.enqueue(message);
            }
        },
    }),
    name: Object.freeze({
        generateRoute(relativeTo, name, params = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                let router =
                    "config" in relativeTo ? relativeTo : Router.find(relativeTo);
                while (router !== null) {
                    const path = yield router.config.generateRouteFromName(name, params);
                    if (path !== null) {
                        return path;
                    }
                    router = router.parent;
                }
                return null;
            });
        },
        push(relativeTo, name, params = {}, trigger = true) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = yield Route.name.generateRoute(relativeTo, name, params);
                if (path !== null) {
                    Route.path.push(path, trigger);
                }
            });
        },
        replace(relativeTo, name, params = {}, trigger = true) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = yield Route.name.generateRoute(relativeTo, name, params);
                if (path !== null) {
                    Route.path.replace(path, trigger);
                }
            });
        },
        trigger(relativeTo, name, params = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = yield Route.name.generateRoute(relativeTo, name, params);
                if (path !== null) {
                    Route.path.trigger(path);
                }
            });
        },
    }),
});
/**
 * @alpha
 */
export class DefaultNavigationQueue {
    constructor() {
        this.queue = [];
        this.promise = null;
        this.resolve = null;
    }
    connect() {
        this.enqueue(new NavigationMessage(Route.path.current));
        window.addEventListener("popstate", this);
        NavigationHandler.register(this);
    }
    disconnect() {
        this.queue = [];
        this.promise = null;
        this.resolve = null;
        window.removeEventListener("popstate", this);
        NavigationHandler.unregister(this);
    }
    receive() {
        if (this.promise !== null) {
            return this.promise;
        }
        this.promise = new Promise(resolve => (this.resolve = resolve));
        Promise.resolve().then(() => this.tryDequeue());
        return this.promise;
    }
    enqueue(msg) {
        this.queue.push(msg);
        this.tryDequeue();
    }
    tryDequeue() {
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
    handleEvent(event) {
        this.enqueue(new NavigationMessage(Route.path.current));
    }
}
