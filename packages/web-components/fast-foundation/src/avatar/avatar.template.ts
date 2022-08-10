import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { AvatarOptions, FASTAvatar } from "./avatar.js";

/**
 * The template for {@link @microsoft/fast-foundation#FASTAvatar} component.
 * @public
 */
export function avatarTemplate(
    options: AvatarOptions = {}
): ElementViewTemplate<FASTAvatar> {
    return html<FASTAvatar>`
    <div
        class="backplate"
        part="backplate"
    >
        <a
            class="link"
            part="link"
            href="${x => (x.link ? x.link : void 0)}"
        >
            <slot name="media">${options.media || ""}</slot>
            <slot><slot>
        </a>
    </div>
    <slot name="badge"></slot>
    `;
}
