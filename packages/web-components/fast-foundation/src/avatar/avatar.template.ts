import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { AvatarOptions, FASTAvatar } from "./avatar.js";

/**
 * The template for {@link @microsoft/fast-foundation#FASTAvatar} component.
 * @public
 */
export function avatarTemplate<T extends FASTAvatar>(
    options: AvatarOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <slot name="media">${options.media ?? ""}</slot>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <slot name="badge"></slot>
    `;
}
