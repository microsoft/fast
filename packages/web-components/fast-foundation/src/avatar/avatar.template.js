import { html } from "@microsoft/fast-element";
/**
 * The template for {@link @microsoft/fast-foundation#Avatar} component.
 * @public
 */
export const avatarTemplate = (context, definition) => html`
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
