import {
    Radio,
    RadioOptions,
    radioTemplate as template,
} from "@microsoft/fast-foundation";
import { radioStyles as styles } from "./radio.styles";

/**
 * A function that returns a Radio registration for configuring the component with a DesignSystem.
 * Implements Radio
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-radio\>
 */
export const /* @echo namespace */Radio = Radio.compose<RadioOptions>({
    baseName: "radio",
    template,
    styles,
    checkedIndicator: `
        <div part="checked-indicator" class="checked-indicator"></div>
    `,
});

/**
 * Styles for Radio
 * @public
 */
export const radioStyles = styles;

/**
 * Base class for Radio
 * @public
 */
export { Radio };
