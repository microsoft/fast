import { Badge, badgeTemplate as template } from "@microsoft/fast-foundation";
import { badgeStyles as styles } from "./badge.styles";

/**
 * A function that returns a Badge registration for configuring the component with a DesignSystem.
 * Implements Badge
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-badge\>
 */
export const /* @echo namespace */Badge = Badge.compose({
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
