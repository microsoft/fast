import { FASTElement } from "@microsoft/fast-element";
import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";

/**
 * Avatar configuration options
 * @public
 */
export type AvatarOptions = {
    media?: StaticallyComposableHTML<FASTAvatar>;
};

/**
 * An Avatar Custom HTML Element
 *
 * @slot media - Used for media such as an image
 * @slot - The default slot for avatar text, commonly a name or initials
 * @slot badge - Used to provide a badge, such as a status badge
 * @csspart backplate - The wrapping container for the avatar
 * @csspart content - The default slot
 *
 * @public
 */
export class FASTAvatar extends FASTElement {}
