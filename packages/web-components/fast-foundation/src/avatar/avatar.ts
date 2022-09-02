import { FASTElement, SyntheticViewTemplate } from "@microsoft/fast-element";

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
 * @csspart media - The wrapping container for the media
 * @csspart content - The wrapping container for the default content
 *
 * @public
 */
export class FASTAvatar extends FASTElement {}
