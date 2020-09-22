import { html, when } from "@microsoft/fast-element";
import { Avatar } from "./avatar";

/**
 * The template for {@link @microsoft/fast-foundation#Avatar} component.
 * @public
 */
export const AvatarTemplate = html<Avatar>`
    <template>
        <div
            class="coin ${x => (x.shape === "square" ? "square" : "circle")}"
            part="coin"
            style="${x =>
                x.fill || x.color
                    ? `background-color: var(--avatar-fill-${x.fill}); color: var(--avatar-color-${x.color});`
                    : void 0}"
        >
            <a class="link" part="link" href="${x => (x.link ? x.link : void 0)}">
                ${when(
                    x => x.imgSrc,
                    html`
                        <img
                            src="${x => x.imgSrc}"
                            alt="${x => x.alt}"
                            tabindex="${x => (!x.link ? "0" : void 0)}"
                            class="image"
                        />
                    `
                )}
                <span class="name" part="name">${x => x.initials}</span>
            </a>
        </div>
        <slot name="badge" part="badge"></slot>
    </template>
`;
