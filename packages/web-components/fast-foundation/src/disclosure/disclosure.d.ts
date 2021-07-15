import { FoundationElement } from "../foundation-element";
/**
 * A Disclosure Custom HTML Element.
 * Based largely on the {@link https://w3c.github.io/aria-practices/#disclosure | disclosure element }.
 *
 * @public
 */
export declare class Disclosure extends FoundationElement {
    /**
     * Determines if the element should show the extra content or not.
     *
     * @public
     */
    expanded: boolean;
    /**
     * Invoker title
     *
     * @public
     */
    title: string;
    /**
     * @internal
     */
    details: HTMLDetailsElement;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Show extra content.
     */
    show(): void;
    /**
     * Hide extra content.
     */
    hide(): void;
    /**
     * Toggle the current(expanded/collapsed) state.
     */
    toggle(): void;
    /**
     * Register listener and set default disclosure mode
     */
    protected setup(): void;
    /**
     * Update the aria attr and fire `toggle` event
     */
    protected onToggle(): void;
}
