export interface HostBehaviorController<TSource = any> {
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
    attach?(controller: HostBehaviorController<TSource>): void;

    /**
     * Executed when this behavior is detached from a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    detach?(controller: HostBehaviorController<TSource>): void;

    /**
     * Executed when this behavior is bound.
     * @param controller - Controls the behavior lifecycle.
     */
    bind?(controller: HostBehaviorController<TSource>): void;

    /**
     * Executed when this behavior is unbound.
     * @param controller - Controls the behavior lifecycle.
     */
    unbind?(controller: HostBehaviorController<TSource>): void;
}

export interface HostBehaviorOrchestrator<TSource = any>
    extends HostBehaviorController<TSource> {
    bind(): void;
    unbind(): void;
}

export interface HostBehaviorCollection<TSource = any> {
    add(behavior: HostBehavior<TSource>);
    remove(behavior: HostBehavior<TSource>, force?: boolean);
}

export const HostBehaviorOrchestrator = Object.freeze({
    create<TSource = any>(source: TSource): HostBehaviorOrchestrator<TSource> {
        return new BehaviorControllerImplementation(source);
    },
});

class BehaviorControllerImplementation<TSource = any>
    implements HostBehaviorCollection<TSource>, HostBehaviorOrchestrator<TSource> {
    private _behaviors = new Map<HostBehavior<TSource>, number>();
    private _isBound: boolean = false;

    constructor(public readonly source: TSource) {}

    get behaviors(): HostBehaviorCollection<TSource> {
        return this;
    }

    add(behavior: HostBehavior<TSource>) {
        const behaviors = this._behaviors;
        const count = behaviors.get(behavior) ?? 0;

        if (count === 0) {
            behaviors.set(behavior, 1);
            behavior.attach && behavior.attach(this);

            if (this._isBound && behavior.bind) {
                behavior.bind(this);
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

            if (this._isBound && behavior.unbind) {
                behavior.unbind(this);
            }

            behavior.detach && behavior.detach(this);
        } else {
            behaviors.set(behavior, count);
        }
    }

    bind() {
        if (!this._isBound) {
            this._isBound = true;

            for (const key of this._behaviors.keys()) {
                key.bind && key.bind(this);
            }
        }
    }

    unbind() {
        if (this._isBound) {
            this._isBound = false;

            for (const key of this._behaviors.keys()) {
                key.unbind && key.unbind(this);
            }
        }
    }
}
