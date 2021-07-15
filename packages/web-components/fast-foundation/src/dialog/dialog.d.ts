import { FoundationElement } from "../foundation-element";
/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#dialog | ARIA dialog }.
 *
 * @public
 */
export declare class Dialog extends FoundationElement {
    /**
     * Indicates the element is modal. When modal, user interaction will be limited to the contents of the element.
     * @public
     * @defaultValue - true
     * @remarks
     * HTML Attribute: modal
     */
    modal: boolean;
    /**
     * The hidden state of the element.
     *
     * @public
     * @defaultValue - false
     * @remarks
     * HTML Attribute: hidden
     */
    hidden: boolean;
    /**
     * Indicates that the dialog should trap focus.
     *
     * @public
     * @defaultValue - true
     * @remarks
     * HTML Attribute: trap-focus
     */
    trapFocus: boolean;
    /**
     * The id of the element describing the dialog.
     * @public
     * @remarks
     * HTML Attribute: aria-describedby
     */
    ariaDescribedby: string;
    /**
     * The id of the element labeling the dialog.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    ariaLabelledby: string;
    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    ariaLabel: string;
    /**
     * @internal
     */
    dialog: HTMLDivElement;
    /**
     * @internal
     */
    dismiss(): void;
    /**
     * The method to show the dialog.
     *
     * @public
     */
    show(): void;
    /**
     * The method to hide the dialog.
     *
     * @public
     */
    hide(): void;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    private trapFocusChanged;
    private handleDocumentKeydown;
    private handleDocumentFocus;
    private handleTabKeyDown;
    private getTabQueueBounds;
    /**
     * focus on first element of tab queue
     */
    private focusFirstElement;
    /**
     * we should only focus if focus has not already been brought to the dialog
     */
    private shouldForceFocus;
    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    private static reduceTabbableItems;
    /**
     * Test if element is focusable fast element
     *
     * @param element - The element to check
     *
     * @internal
     */
    private static isFocusableFastElement;
    /**
     * Test if the element has a focusable shadow
     *
     * @param element - The element to check
     *
     * @internal
     */
    private static hasTabbableShadow;
}
