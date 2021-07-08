import { Badge, badgeTemplate as template } from "@microsoft/fast-foundation";
import { badgeStyles as styles } from "./badge.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Badge} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#badgeTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-badge\>
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

/**
 * Base class for Badge
 * @public
 */
export { Badge };
