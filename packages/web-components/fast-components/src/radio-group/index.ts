import { RadioGroup, radioGroupTemplate as template } from "@microsoft/fast-foundation";
import { radioGroupStyles as styles } from "./radio-group.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#RadioGroup} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#radioGroupTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-radio-group\>
 */
export const fastRadioGroup = RadioGroup.compose({
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
