import type { StyleTarget } from "../interfaces.js";
import type { ElementStyles } from "./element-styles.js";
import { getShadowRoot } from "./shadow-root.js";

export interface HostController<TSource = any> {
    readonly source: TSource;
    readonly isConnected: boolean;
    readonly behaviors: HostBehaviorCollection<TSource>;
    readonly styles: HostStyleCollection;
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
    private readonly behaviors = new Map<HostBehavior<TSource>, number>();

    constructor(private readonly controller: HostController<TSource>) {}

    add(behavior: HostBehavior<TSource>) {
        const behaviors = this.behaviors;
        const count = behaviors.get(behavior) ?? 0;

        if (count === 0) {
            const controller = this.controller;
            behaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(controller);

            if (behavior.connectedCallback && controller.isConnected) {
                behavior.connectedCallback(controller);
            }
        } else {
            behaviors.set(behavior, count + 1);
        }
    }

    remove(behavior: HostBehavior<TSource>, force: boolean = false) {
        const behaviors = this.behaviors;
        const count = (behaviors.get(behavior) ?? 0) - 1;

        if (count === 0 || force) {
            const controller = this.controller;
            behaviors.delete(behavior);

            if (behavior.disconnectedCallback && controller.isConnected) {
                behavior.disconnectedCallback(controller);
            }

            behavior.removedCallback && behavior.removedCallback(controller);
        } else {
            behaviors.set(behavior, count);
        }
    }

    connect() {
        const controller = this.controller;

        if (!controller.isConnected) {
            for (const key of this.behaviors.keys()) {
                key.connectedCallback && key.connectedCallback(controller);
            }
        }
    }

    disconnect() {
        const controller = this.controller;

        if (controller.isConnected) {
            for (const key of this.behaviors.keys()) {
                key.disconnectedCallback && key.disconnectedCallback(controller);
            }
        }
    }
}

export interface HostStyleCollection {
    main: ElementStyles | null;
    add(styles: ElementStyles | HTMLStyleElement | null | undefined);
    remove(styles: ElementStyles | HTMLStyleElement | null | undefined);
}

export interface StylesHost<TSource = any> extends HostController<TSource> {
    readonly definition: { styles?: ElementStyles };
}

export interface HostStyleOrchestrator extends HostStyleCollection {
    initialize(): void;
}

export const HostStyleOrchestrator = Object.freeze({
    create(host: StylesHost): HostStyleOrchestrator {
        return new DefaultHostStyleOrchestrator(host);
    },
});

class DefaultHostStyleOrchestrator implements HostStyleCollection, HostStyleOrchestrator {
    private _main: ElementStyles | null = null;
    private _needsInitialization = true;

    constructor(private host: StylesHost) {}

    public get main(): ElementStyles | null {
        // 1. Styles overrides take top precedence.
        if (this._main === null) {
            const definition = this.host.definition;

            if ((this.host.source as any).resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._main = (this.host.source as any).resolveStyles();
            } else if (definition.styles) {
                // 3. Default to the static definition.
                this._main = definition.styles ?? null;
            }
        }

        return this._main;
    }

    public set main(value: ElementStyles | null) {
        if (this._main === value) {
            return;
        }

        if (this._main !== null) {
            this.remove(this._main);
        }

        this._main = value;

        if (!this._needsInitialization) {
            this.add(value);
        }
    }

    public initialize() {
        if (this._needsInitialization) {
            this.add(this.main);
            this._needsInitialization = false;
        }
    }

    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    public add(styles: ElementStyles | HTMLStyleElement | null | undefined): void {
        if (!styles) {
            return;
        }

        const source = this.host.source;
        const target: StyleTarget = getShadowRoot(source) ?? source.getRootNode();

        if (styles instanceof HTMLElement) {
            target.append(styles);
        } else if (!styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(target);

            if (sourceBehaviors !== null) {
                const behaviors = this.host.behaviors;

                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    behaviors.add(sourceBehaviors[i]);
                }
            }
        }
    }

    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    public remove(styles: ElementStyles | HTMLStyleElement | null | undefined): void {
        if (!styles) {
            return;
        }

        const source = this.host.source;
        const target: StyleTarget = getShadowRoot(source) ?? source.getRootNode();

        if (styles instanceof HTMLElement) {
            target.removeChild(styles);
        } else if (styles.isAttachedTo(target)) {
            const sourceBehaviors = styles.behaviors;

            styles.removeStylesFrom(target);

            if (sourceBehaviors !== null) {
                const behaviors = this.host.behaviors;

                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    behaviors.add(sourceBehaviors[i]);
                }
            }
        }
    }
}
