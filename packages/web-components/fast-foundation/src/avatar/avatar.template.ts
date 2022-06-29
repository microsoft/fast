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
        class="backplate ${x => x.shape}"
        part="backplate"
        style="${x =>
            x.fill ? `background-color: var(--avatar-fill-${x.fill});` : void 0}"
    >
        <a
            class="link"
            part="link"
            href="${x => (x.link ? x.link : void 0)}"
            style="${x => (x.color ? `color: var(--avatar-color-${x.color});` : void 0)}"
        >
            <slot name="media">${options.media || ""}</slot>
            <slot><slot>
        </a>
    </div>
    <slot name="badge"></slot>
    `;
}
