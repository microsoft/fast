import type { ElementStyles } from "./element-styles.js";

export interface HostController<TSource = any> {
    readonly source: TSource;
    readonly isConnected: boolean;

    mainStyles: ElementStyles | null;

    addBehavior(behavior: HostBehavior<TSource>): void;
    removeBehavior(behavior: HostBehavior<TSource>, force?: boolean): void;
    addStyles(styles: ElementStyles | HTMLStyleElement | null | undefined): void;
    removeStyles(styles: ElementStyles | HTMLStyleElement | null | undefined): void;
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
