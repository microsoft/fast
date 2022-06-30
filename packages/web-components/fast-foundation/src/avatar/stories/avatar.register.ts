import { attr, css, html, when } from "@microsoft/fast-element";
import { FASTAvatar } from "../avatar.js";
import { avatarTemplate } from "../avatar.template.js";

const styles = css`
    :host {
        --avatar-size-default: 32px;
        --avatar-text-size: var(--type-ramp-base-font-size);
        --avatar-text-ratio: var(--design-unit);
        display: flex;
        height: var(--avatar-size, var(--avatar-size-default));
        max-width: var(--avatar-size, var(--avatar-size-default));
        position: relative;
    }

    :host([hidden]) {
        display: none;
    }

    .link {
        align-items: center;
        color: var(--neutral-foreground-rest);
        display: flex;
        flex-direction: row;
        justify-content: center;
        min-width: 100%;
        text-decoration: none;
    }

    .square {
        border-radius: calc(var(--control-corner-radius) * 1px);
        min-width: 100%;
        overflow: hidden;
    }

    .circle {
        border-radius: 100%;
        min-width: 100%;
        overflow: hidden;
    }

    .backplate {
        display: flex;
        position: relative;
    }

    .media,
    ::slotted(img) {
        display: block;
        max-width: 100%;
        position: absolute;
    }

    .content {
        --avatar-size: var(--avatar-size, var(--avatar-size-default));
        display: block;
        font-size: calc(
            (var(--avatar-text-size) + var(--avatar-size)) / var(--avatar-text-ratio)
        );
        line-height: var(--avatar-size);
        min-height: var(--avatar-size);
    }

    ::slotted(fast-badge) {
        display: block;
        position: absolute;
    }
`;

class Avatar extends FASTAvatar {
    @attr({ attribute: "src" })
    public imgSrc?: string;

    @attr
    public alt?: string;
}

const media = html<Avatar>`
    ${when(
        x => x.imgSrc,
        html<Avatar>`
            <img
                src="${x => x.imgSrc}"
                alt="${x => x.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `
    )}
`;

Avatar.define({
    name: "fast-avatar",
    template: avatarTemplate({ media }),
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
