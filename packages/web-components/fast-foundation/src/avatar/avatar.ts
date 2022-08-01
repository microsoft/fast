import { attr, FASTElement, SyntheticViewTemplate } from "@microsoft/fast-element";

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
     * Indicates the Avatar should have url link
     *
     * @public
     * @remarks
     * HTML Attribute: link
     */
    @attr public link: string;
}
