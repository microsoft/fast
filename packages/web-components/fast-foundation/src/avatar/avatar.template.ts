import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Avatar, AvatarOptions } from "./avatar";

/**
 * The template for {@link @microsoft/fast-foundation#Avatar} component.
 * @public
 */
export const avatarTemplate: (
    context: ElementDefinitionContext,
    definition: AvatarOptions
) => ViewTemplate<Avatar> = (
    context: ElementDefinitionContext,
    definition: AvatarOptions
) => html`
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
            <slot name="media" part="media">${definition.media || ""}</slot>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`;
