import { customElement } from "@microsoft/fast-element";
import { Avatar, AvatarTemplate as template } from "@microsoft/fast-foundation";
import { AvatarStyles as styles } from "./avatar.styles";

/**
 *  The FAST Avatar Element. Implements {@link @microsoft/fast-foundation#Avatar},
 *  {@link @microsoft/fast-foundation#AvatarTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-avatar\>
 */
@customElement({
    name: "fast-avatar",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAvatar extends Avatar {}

/**
 * Styles for Badge
 * @public
 */
export const AvatarStyles = styles;
