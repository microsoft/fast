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

    .backplate {
        text-decoration: none;
        position: relative;
        border-radius: 100%;
        min-width: 100%;
        overflow: hidden;
        background-color: var(--accent-fill-rest);
        color: var(--foreground-on-accent-rest);
    }

    .media,
    .content {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    ::slotted(img) {
        display: block;
        max-width: 100%;
        position: absolute;
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: calc(
            (var(--avatar-text-size) + var(--avatar-size)) / var(--avatar-text-ratio)
        );
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
