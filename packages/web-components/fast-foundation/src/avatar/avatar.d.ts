import { SyntheticViewTemplate } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
declare type AvatarShape = "circle" | "square";
/**
 * Avatar configuration options
 * @public
 */
export declare type AvatarOptions = FoundationElementDefinition & {
    media?: string | SyntheticViewTemplate;
};
/**
 * An Avatar Custom HTML Element
 *
 * @public
 */
export declare class Avatar extends FoundationElement {
    /**
     * Indicates the Avatar should have a color fill.
     *
     * @public
     * @remarks
     * HTML Attribute: fill
     */
    fill: string;
    /**
     * Indicates the Avatar should have a text color.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    color: string;
    /**
     * Indicates the Avatar should have url link
     *
     * @public
     * @remarks
     * HTML Attribute: link
     */
    link: string;
    /**
     * Indicates the Avatar shape should be. By default it will be set to "circle".
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape: AvatarShape;
    /**
     * Internal
     */
    connectedCallback(): void;
}
export {};
