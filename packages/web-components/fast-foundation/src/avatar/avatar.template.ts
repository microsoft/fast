import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Avatar, AvatarOptions } from "./avatar";

/**
 * The template for {@link @microsoft/fast-foundation#Avatar} component.
 * @public
 */
export const avatarTemplate: (
    context,
    definition: AvatarOptions
) => ViewTemplate<Avatar> = (context, definition: AvatarOptions) => html`
    <div
        class="coin ${x => x.shape}"
        part="coin"
        style="${x =>
            x.fill ? `background-color: var(--avatar-fill-${x.fill});` : void 0}"
    >
        <a
            class="link"
            part="link"
            href="${x => (x.link ? x.link : void 0)}"
            style="${x => (x.color ? `color: var(--avatar-color-${x.color});` : void 0)}"
        >
            <slot name>${definition.media || ""}</slot>
            <span class="name" part="name">${x => x.initials}</span>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`;
