import { attr, FASTElement, SyntheticViewTemplate } from "@microsoft/fast-element";

type AvatarShape = "circle" | "square";

/**
 * Avatar configuration options
 * @public
 */
export type AvatarOptions = {
    media?: string | SyntheticViewTemplate;
};

/**
 * An Avatar Custom HTML Element
 *
 * @slot media - Used for media such as an image
 * @slot - The default slot for avatar text, commonly a name or initials
 * @slot badge - Used to provide a badge, such as a status badge
 * @csspart backplate - The wrapping container for the avatar
 * @csspart link - The avatar link
 * @csspart content - The default slot
 *
 * @public
 */
export class FASTAvatar extends FASTElement {
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
     * Internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.shape) {
            this.shape = "circle";
        }
    }
}
