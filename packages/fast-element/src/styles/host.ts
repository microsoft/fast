import type { ExpressionController } from "../observation/observable.js";
import type { ElementStyles } from "./element-styles.js";

/**
 * Controls the lifecycle and context of behaviors and styles
 * associated with a component host.
 * @public
 */
export interface HostController<TSource = any> extends ExpressionController<TSource> {
    /**
     * Indicates whether the host is connected or not.
     */
    readonly isConnected: boolean;

    /**
     * The main set of styles used for the component, independent
     * of any behavior-specific styles.
     */
    mainStyles: ElementStyles | null;

    /**
     * Adds the behavior to the component.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior: HostBehavior<TSource>): void;

    /**
     * Removes the behavior from the component.
     * @param behavior - The behavior to remove.
     * @param force - Forces removal even if this behavior was added more than once.
     */
    removeBehavior(behavior: HostBehavior<TSource>, force?: boolean): void;

    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles: ElementStyles | HTMLStyleElement | null | undefined): void;

    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
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
     * Executed when this behavior's host is connected.
     * @param controller - Controls the behavior lifecycle.
     */
    connectedCallback?(controller: HostController<TSource>): void;

    /**
     * Executed when this behavior's host is disconnected.
     * @param controller - Controls the behavior lifecycle.
     */
    disconnectedCallback?(controller: HostController<TSource>): void;
}
