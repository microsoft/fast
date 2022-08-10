import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    ARIAGlobalStatesAndProperties,
    StartEnd,
    StartEndOptions,
} from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Anchor configuration options
 * @public
 */
export type AnchorOptions = StartEndOptions;

/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @slot start - Content which can be provided before the anchor content
 * @slot end - Content which can be provided after the anchor content
 * @slot - The default slot for anchor content
 * @csspart control - The anchor element
 * @csspart content - The element wrapping anchor content
 *
 * @public
 */
export class FASTAnchor extends FASTElement {
    /**
     * Prompts the user to save the linked URL. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: download
     */
    @attr
    public download: string;

    /**
     * The URL the hyperlink references. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: href
     */
    @attr
    public href: string;

    /**
     * Hints at the language of the referenced resource. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: hreflang
     */
    @attr
    public hreflang: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: ping
     */
    @attr
    public ping: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: referrerpolicy
     */
    @attr
    public referrerpolicy: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: rel
     */
    @attr
    public rel: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: target
     */
    @attr
    public target: "_self" | "_blank" | "_parent" | "_top";

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr
    public type: string;

    /**
     *
     * Default slotted content
     *
     * @internal
     */
    @observable
    public defaultSlottedContent: HTMLElement[];

    /**
     * References the root element
     */
    public control: HTMLAnchorElement;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.handleUnsupportedDelegatesFocus();
    }

    /**
     * Overrides the focus call for where delegatesFocus is unsupported.
     * This check works for Chrome, Edge Chromium, FireFox, and Safari
     * Relevant PR on the Firefox browser: https://phabricator.services.mozilla.com/D123858
     */
    private handleUnsupportedDelegatesFocus = () => {
        // Check to see if delegatesFocus is supported
        if (
            window.ShadowRoot &&
            !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") &&
            this.$fastController.definition.shadowOptions?.delegatesFocus
        ) {
            this.focus = () => {
                this.control.focus();
            };
        }
    };
}

/**
 * Includes ARIA states and properties relating to the ARIA link role
 *
 * @public
 */
export class DelegatesARIALink {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#link} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @attr({ attribute: "aria-expanded" })
    public ariaExpanded: "true" | "false" | string | null;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIALink extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIALink, ARIAGlobalStatesAndProperties);

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTAnchor extends StartEnd, DelegatesARIALink {}
applyMixins(FASTAnchor, StartEnd, DelegatesARIALink);
