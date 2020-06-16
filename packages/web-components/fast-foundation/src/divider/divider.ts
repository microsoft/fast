import { attr, FASTElement } from "@microsoft/fast-element";
/**
 * Divider roles
 * @public
 */
export enum DividerRole {
    /**
     * The divider semantically separates content
     */
    separator = "separator",
    
    /**
     * The divider has no semantic value and is for visual presentation only.
     */
    presentation = "presentation",
}

/**
 * A Divider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#separator | ARIA separator } or {@link https://www.w3.org/TR/wai-aria-1.1/#presentation | ARIA presentation}.
 *
 * @public
 */
export class Divider extends FASTElement {
    /**
     * The role of the element.
     * 
     * @public
     * @defaultValue - {@link DividerRole.separator}
     */
    @attr
    public role: DividerRole = DividerRole.separator;
}
