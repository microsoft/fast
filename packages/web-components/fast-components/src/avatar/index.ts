import { attr, html, when } from "@microsoft/fast-element";
import {
    AvatarOptions,
    Avatar as FoundationAvatar,
    avatarTemplate as template,
} from "@microsoft/fast-foundation";
import { avatarStyles as styles } from "./avatar.styles.js";

/**
 * The FAST Avatar Class
 * @public
 *
 */
export class Avatar extends FoundationAvatar {
    /**
     * Indicates the Avatar should have an image source
     *
     * @public
     * @remarks
     * HTML Attribute: src
     */
    @attr({ attribute: "src" })
    public imgSrc: string | undefined;

    /**
     * Indicates the Avatar should have alt text
     *
     * @public
     * @remarks
     * HTML Attribute: alt
     */
    @attr public alt: string | undefined;
}

/**
 * The FAST Avatar Template for Images
 *  @public
 *
 */
export const imgTemplate = html<Avatar>`
    ${when(
        x => x.imgSrc,
        html`
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

/**
 * A function that returns a {@link @microsoft/fast-foundation#Avatar} registration for configuring the component with a DesignSystem.
 *  {@link @microsoft/fast-foundation#avatarTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-avatar>`
 */
export const fastAvatar = Avatar.compose<AvatarOptions>({
    baseName: "avatar",
    baseClass: FoundationAvatar,
    template,
    styles,
    media: imgTemplate,
    shadowOptions: {
        delegatesFocus: true,
    },
});

export { styles as avatarStyles };
