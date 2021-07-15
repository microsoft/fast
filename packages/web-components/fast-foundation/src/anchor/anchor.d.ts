import { FoundationElement } from "../foundation-element";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @public
 */
export declare class Anchor extends FoundationElement {
    /**
     * Prompts the user to save the linked URL. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: download
     */
    download: string;
    /**
     * The URL the hyperlink references. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: href
     */
    href: string;
    /**
     * Hints at the language of the referenced resource. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: hreflang
     */
    hreflang: string;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: ping
     */
    ping: string;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: referrerpolicy
     */
    referrerpolicy: string;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: rel
     */
    rel: string;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: target
     */
    target: "_self" | "_blank" | "_parent" | "_top";
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: type
     */
    type: string;
    /**
     *
     * Default slotted content
     *
     * @internal
     */
    defaultSlottedContent: HTMLElement[];
    /**
     * References the root element
     */
    control: HTMLAnchorElement;
}
/**
 * Includes ARIA states and properties relating to the ARIA link role
 *
 * @public
 */
export declare class DelegatesARIALink {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#link} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    ariaExpanded: "true" | "false" | undefined;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIALink extends ARIAGlobalStatesAndProperties {}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface Anchor extends StartEnd, DelegatesARIALink {}
