import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
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
            <slot name="media">${staticallyCompose(options.media)}</slot>
            <slot></slot>
        </div>
        <slot name="badge"></slot>
    `;
}
