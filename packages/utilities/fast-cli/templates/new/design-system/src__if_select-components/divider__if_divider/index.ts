import { Divider, dividerTemplate as template } from "@microsoft/fast-foundation";
import { dividerStyles as styles } from "./divider.styles";

/**
 * A function that returns a Divider registration for configuring the component with a DesignSystem.
 * Implements Divider
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-divider\>
 */
export const /* @echo namespace */Divider = Divider.compose({
    baseName: "divider",
    template,
    styles,
});

/**
 * Styles for Divider
 * @public
 */
export const dividerStyles = styles;

/**
 * Base class for Divider
 * @public
 */
export { Divider };
