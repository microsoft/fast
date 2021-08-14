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
     * Internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.shape) {
            this.shape = "circle";
        }
    }
}
