import { tooltipTemplate as template, Tooltip } from "@microsoft/fast-foundation";
import { tooltipStyles as styles } from "./tooltip.styles";

/**
 * A function that returns a Tooltip registration for configuring the component with a DesignSystem.
 * Implements Tooltip
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-tooltip\>
 */
export const /* @echo namespace */Tooltip = Tooltip.compose({
    baseName: "tooltip",
    template,
    styles,
});

/**
 * Base class for Tooltip
 * @public
 */
export { Tooltip };
