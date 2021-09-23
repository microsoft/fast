import { attr, SyntheticViewTemplate } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";

type AvatarShape = "circle" | "square";

/**
 * Avatar configuration options
 * @public
 */
export type AvatarOptions = FoundationElementDefinition & {
    media?: string | SyntheticViewTemplate;
};

/**
 * An Avatar Custom HTML Element
 *
 * @public
 */
export class Avatar extends FoundationElement {
    /**
     * Indicates the Avatar should have a color fill.
     *
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    @attr public fill: string;

    /**
     * Indicates the Avatar should have a text color.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    @attr public color: string;

    /**
     * Indicates the Avatar should have url link
     *
     * @public
     * @remarks
     * HTML Attribute: link
     */
    @attr public link: string;

    /**
     * Indicates the Avatar shape should be. By default it will be set to "circle".
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    @attr public shape: AvatarShape;

    /**
     * References the root element
     */
    public control: HTMLAnchorElement;

    /**
     * Internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.shape) {
            this.shape = "circle";
        }

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
