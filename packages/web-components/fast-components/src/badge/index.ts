import { Badge, badgeTemplate as template } from "@microsoft/fast-foundation";
import { badgeStyles as styles } from "./badge.styles";

/**
 * The FAST Badge Element. Implements {@link @microsoft/fast-foundation#Badge},
 * {@link @microsoft/fast-foundation#badgeTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-badge\>
 */
export const fastBadge = Badge.compose({
    baseName: "badge",
    template,
    styles,
});

/**
 * Styles for Badge
 * @public
 */
export const badgeStyles = styles;
