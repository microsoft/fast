// Cached regex for detecting if a URL is absolute,
// i.e., starts with a scheme or is scheme-relative.
// See http://www.ietf.org/rfc/rfc2396.txt section 3.1 for valid scheme format
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

export class NavigationMessage {
    constructor(public path: string) {}
}

export interface NavigationHandler {
    enqueue(msg: NavigationMessage): void;
}

const handlers = new Set<NavigationHandler>();

export const Navigation = Object.freeze({
    push(path: string, trigger = true) {
        if (path && absoluteUrl.test(path)) {
            location.href = path;
            return;
        }

        history.pushState({}, document.title, path);

        if (trigger) {
            this.trigger(path);
        }
    },

    replace(path: string, trigger = true) {
        if (path && absoluteUrl.test(path)) {
            location.href = path;
            return;
        }

        history.replaceState({}, document.title, path);

        if (trigger) {
            this.trigger(path);
        }
    },

    trigger(path: string) {
        const message = new NavigationMessage(path);

        for (const handler of handlers) {
            handler.enqueue(message);
        }
    },

    register(handler: NavigationHandler) {
        handlers.add(handler);
    },

    unregister(handler: NavigationHandler) {
        handlers.delete(handler);
    },
});

export interface NavigationQueue {
    connect(): void;
    disconnect(): void;
    receive(): Promise<NavigationMessage>;
}

export class PopStateNavigationQueue implements NavigationQueue, NavigationHandler {
    private queue: NavigationMessage[] = [];
    private promise: Promise<NavigationMessage> | null = null;
    private resolve: ((value: NavigationMessage) => void) | null = null;

    public connect() {
        this.enqueue(new NavigationMessage(location.pathname));
        window.addEventListener("popstate", this);
        Navigation.register(this);
    }

    public disconnect() {
        this.queue = [];
        this.promise = null;
        this.resolve = null;
        window.removeEventListener("popstate", this);
        Navigation.unregister(this);
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
        this.enqueue(new NavigationMessage(location.pathname));
    }
}
