import { attr } from "@microsoft/fast-element";

/**
 * Some states and properties are applicable to all host language elements regardless of whether a role is applied.
 * The following global states and properties are supported by all roles and by all base markup elements.
 * {@link https://www.w3.org/TR/wai-aria-1.1/#global_states}
 *
 * This is intended to be used as a mixin. Be sure you extend FASTElement.
 *
 * @public
 */
export class ARIAGlobalStatesAndProperties {
    /**
     * Indicates whether assistive technologies will present all, or only parts of,
     * the changed region based on the change notifications defined by the aria-relevant attribute.
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-atomic}
     *
     * @public
     * @remarks
     * HTML Attribute: aria-atomic
     */
    @attr({ attribute: "aria-atomic", mode: "fromView" })
    public ariaAtomic: "true" | "false";

    /**
     * Indicates an element is being modified and that assistive technologies MAY want to wait
     * until the modifications are complete before exposing them to the user.
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-busy}
     *
     * @public
     * @remarks
     * HTML Attribute: aria-busy
     */
    @attr({ attribute: "aria-busy", mode: "fromView" })
    public ariaBusy: "true" | "false";

    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-controls}
     * @public
     * @remarks
     * HTML Attribute: aria-controls
     */
    @attr({ attribute: "aria-controls", mode: "fromView" })
    public ariaControls: string;

    /**
     * Indicates the element that represents the current item within a container or set of related elements.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-current}
     * @public
     * @remarks
     * HTML Attribute: aria-current
     */
    @attr({ attribute: "aria-current", mode: "fromView" })
    public ariaCurrent:
        | "page"
        | "step"
        | "location"
        | "date"
        | "time"
        | "true"
        | "false"
        | string;

    /**
     * Identifies the element (or elements) that describes the object.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-describedby}
     * @public
     * @remarks
     * HTML Attribute: aria-describedby
     */
    @attr({ attribute: "aria-describedby", mode: "fromView" })
    public ariaDescribedby: string;

    /**
     * Identifies the element that provides a detailed, extended description for the object.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-details}
     * @public
     * @remarks
     * HTML Attribute: aria-details
     */
    @attr({ attribute: "aria-details", mode: "fromView" })
    public ariaDetails: string;

    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-disabled}
     * @public
     * @remarks
     * HTML Attribute: aria-disabled
     */
    @attr({ attribute: "aria-disabled", mode: "fromView" })
    public ariaDisabled: "true" | "false";

    /**
     * Identifies the element that provides an error message for the object.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage}
     * @public
     * @remarks
     * HTML Attribute: aria-errormessage
     */
    @attr({ attribute: "aria-errormessage", mode: "fromView" })
    public ariaErrormessage: string;

    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-flowto}
     * @public
     * @remarks
     * HTML Attribute: aria-flowto
     */
    @attr({ attribute: "aria-flowto", mode: "fromView" })
    public ariaFlowto: string;

    /**
     * Indicates the availability and type of interactive popup element,
     * such as menu or dialog, that can be triggered by an element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup}
     * @public
     * @remarks
     * HTML Attribute: aria-haspopup
     */
    @attr({ attribute: "aria-haspopup", mode: "fromView" })
    public ariaHaspopup:
        | "false"
        | "true"
        | "menu"
        | "listbox"
        | "tree"
        | "grid"
        | "dialog";

    /**
     * Indicates whether the element is exposed to an accessibility API
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-hidden}
     * @public
     * @remarks
     * HTML Attribute: aria-hidden
     */
    @attr({ attribute: "aria-hidden", mode: "fromView" })
    public ariaHidden: "false" | "true" | undefined;

    /**
     * Indicates the entered value does not conform to the format expected by the application.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-invalid}
     * @public
     * @remarks
     * HTML Attribute: aria-invalid
     */
    @attr({ attribute: "aria-invalid", mode: "fromView" })
    public ariaInvalid: "false" | "true" | "grammar" | "spelling";

    /**
     * Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts}
     * @public
     * @remarks
     * HTML Attribute: aria-keyshortcuts
     */
    @attr({ attribute: "aria-keyshortcuts", mode: "fromView" })
    public ariaKeyshortcuts: string;

    /**
     * Defines a string value that labels the current element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-label}
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    @attr({ attribute: "aria-label", mode: "fromView" })
    public ariaLabel: string;

    /**
     * Identifies the element (or elements) that labels the current element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby}
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    @attr({ attribute: "aria-labelledby", mode: "fromView" })
    public ariaLabelledby: string;

    /**
     * Indicates that an element will be updated, and describes the types of updates the user agents,
     * assistive technologies, and user can expect from the live region.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-live}
     * @public
     * @remarks
     * HTML Attribute: aria-live
     */
    @attr({ attribute: "aria-live", mode: "fromView" })
    public ariaLive: "assertive" | "off" | "polite";

    /**
     * Identifies an element (or elements) in order to define a visual,
     * functional, or contextual parent/child relationship between DOM elements
     * where the DOM hierarchy cannot be used to represent the relationship.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-owns}
     * @public
     * @remarks
     * HTML Attribute: aria-owns
     */
    @attr({ attribute: "aria-owns", mode: "fromView" })
    public ariaOwns: string;

    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-relevant}
     * @public
     * @remarks
     * HTML Attribute: aria-relevant
     */
    @attr({ attribute: "aria-relevant", mode: "fromView" })
    public ariaRelevant: "additions" | "additions text" | "all" | "removals" | "text";

    /**
     * Defines a human-readable, author-localized description for the role of an element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription}
     * @public
     * @remarks
     * HTML Attribute: aria-roledescription
     */
    @attr({ attribute: "aria-roledescription", mode: "fromView" })
    public ariaRoledescription: string;
}
