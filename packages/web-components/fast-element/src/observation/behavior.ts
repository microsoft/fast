export interface HostController<TSource = any> {
    readonly source: TSource;
    readonly behaviors: HostBehaviorCollection<TSource>;
}

/**
 * Represents an object that can contribute behavior to a host.
 * @public
 */
export interface HostBehavior<TSource = any> {
    /**
     * Executed when this behavior is attached to a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    addedCallback?(controller: HostController<TSource>): void;

    /**
     * Executed when this behavior is detached from a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    removedCallback?(controller: HostController<TSource>): void;

    /**
     * Executed when this behavior is bound.
     * @param controller - Controls the behavior lifecycle.
     */
    connectedCallback?(controller: HostController<TSource>): void;

    /**
     * Executed when this behavior is unbound.
     * @param controller - Controls the behavior lifecycle.
     */
    disconnectedCallback?(controller: HostController<TSource>): void;
}

export interface HostBehaviorCollection<TSource = any> {
    add(behavior: HostBehavior<TSource>);
    remove(behavior: HostBehavior<TSource>, force?: boolean);
}

export interface HostBehaviorOrchestrator<TSource = any>
    extends HostBehaviorCollection<TSource> {
    connect(): void;
    disconnect(): void;
}

export const HostBehaviorOrchestrator = Object.freeze({
    create<TSource = any>(
        controller: HostController<TSource>
    ): HostBehaviorOrchestrator<TSource> {
        return new DefaultHostBehaviorOrchestrator(controller);
    },
});

class DefaultHostBehaviorOrchestrator<TSource = any>
    implements HostBehaviorCollection<TSource>, HostBehaviorOrchestrator<TSource> {
    private readonly _behaviors = new Map<HostBehavior<TSource>, number>();
    private _connected: boolean = false;

    constructor(private readonly _controller: HostController<TSource>) {}

    add(behavior: HostBehavior<TSource>) {
        const behaviors = this._behaviors;
        const count = behaviors.get(behavior) ?? 0;

        if (count === 0) {
            behaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(this._controller);

            if (this._connected && behavior.connectedCallback) {
                behavior.connectedCallback(this._controller);
            }
        } else {
            behaviors.set(behavior, count + 1);
        }
    }

    remove(behavior: HostBehavior<TSource>, force: boolean = false) {
        const behaviors = this._behaviors;
        const count = (behaviors.get(behavior) ?? 0) - 1;

        if (count === 0 || force) {
            behaviors.delete(behavior);

            if (this._connected && behavior.disconnectedCallback) {
                behavior.disconnectedCallback(this._controller);
            }

            behavior.removedCallback && behavior.removedCallback(this._controller);
        } else {
            behaviors.set(behavior, count);
        }
    }

    connect() {
        if (!this._connected) {
            this._connected = true;
            const controller = this._controller;

            for (const key of this._behaviors.keys()) {
                key.connectedCallback && key.connectedCallback(controller);
            }
        }
    }

    disconnect() {
        if (this._connected) {
            this._connected = false;
            const controller = this._controller;

            for (const key of this._behaviors.keys()) {
                key.disconnectedCallback && key.disconnectedCallback(controller);
            }
        }
    }
}
