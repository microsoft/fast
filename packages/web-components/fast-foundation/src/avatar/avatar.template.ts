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
        <div class="backplate" part="backplate">
            <div class="media" part="media">
                <slot name="media">${options.media ?? ""}</slot>
            </div>
            <div class="content" part="content">
                <slot></slot>
            </div>
        </div>
        <slot name="badge"></slot>
    `;
}
