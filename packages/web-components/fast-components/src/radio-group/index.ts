import { RadioGroup, RadioGroupTemplate as template } from "@microsoft/fast-foundation";
import { RadioGroupStyles as styles } from "./radio-group.styles";

/**
 * The FAST Radio Group Element. Implements {@link @microsoft/fast-foundation#RadioGroup},
 * {@link @microsoft/fast-foundation#RadioGroupTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-radio-group\>
 */
export const FASTRadioGroup = RadioGroup.compose({
    baseName: "radio-group",
    template,
    styles
})

/**
 * Styles for RadioGroup
 * @public
 */
export const RadioGroupStyles = styles;
