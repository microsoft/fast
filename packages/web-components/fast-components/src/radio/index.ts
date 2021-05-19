import {
    Radio,
    RadioOptions,
    radioTemplate as template,
} from "@microsoft/fast-foundation";
import { radioStyles as styles } from "./radio.styles";

/**
 * The FAST Radio Element. Implements {@link @microsoft/fast-foundation#Radio},
 * {@link @microsoft/fast-foundation#radioTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-radio\>
 */
export const fastRadio = Radio.compose<RadioOptions>({
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
