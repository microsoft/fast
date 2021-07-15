import { RadioGroup, radioGroupTemplate as template } from "@microsoft/fast-foundation";
import { radioGroupStyles as styles } from "./radio-group.styles";

/**
 * A function that returns a Radio Group registration for configuring the component with a DesignSystem.
 * Implements Radio Group
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-radio-group\>
 */
export const /* @echo namespace */RadioGroup = RadioGroup.compose({
    baseName: "radio-group",
    template,
    styles,
});

/**
 * Styles for RadioGroup
 * @public
 */
export const radioGroupStyles = styles;

/**
 * Base class for RadioGroup
 * @public
 */
export { RadioGroup };
