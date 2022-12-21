import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { staticallyComposeOption } from "../utilities/template-helpers.js";
import type { AvatarOptions, FASTAvatar } from "./avatar.js";

/**
 * The template for {@link @microsoft/fast-foundation#FASTAvatar} component.
 * @public
 */
export function avatarTemplate<T extends FASTAvatar>(
    options: AvatarOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
    <div
        class="backplate"
        part="backplate"
    >
        <a
            class="link"
            part="link"
            href="${x => (x.link ? x.link : void 0)}"
        >
            <slot name="media">${staticallyComposeOption(options.media)}</slot>
            <slot><slot>
        </a>
    </div>
    <slot name="badge"></slot>
    `;
}
