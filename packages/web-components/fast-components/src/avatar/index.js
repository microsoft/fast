var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, html, when } from "@microsoft/fast-element";
import {
    Avatar as FoundationAvatar,
    avatarTemplate as template,
} from "@microsoft/fast-foundation";
import { avatarStyles as styles } from "./avatar.styles";
/**
 * The FAST Avatar Class
 * @public
 *
 */
export class Avatar extends FoundationAvatar {}
__decorate([attr({ attribute: "src" })], Avatar.prototype, "imgSrc", void 0);
__decorate([attr], Avatar.prototype, "alt", void 0);
/**
 * The FAST Avatar Template for Images
 *  @public
 *
 */
export const imgTemplate = html`
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
 *  {@link @microsoft/fast-foundation#AvatarTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-avatar\>
 */
export const fastAvatar = Avatar.compose({
    baseName: "avatar",
    template,
    styles,
    media: imgTemplate,
    shadowOptions: {
        delegatesFocus: true,
    },
});
/**
 * Styles for Badge
 * @public
 */
export const avatarStyles = styles;
