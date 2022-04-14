import {
    Radio,
    RadioOptions,
    radioTemplate as template,
} from "@microsoft/fast-foundation";
import { radioStyles as styles } from "./radio.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Radio} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#radioTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-radio>`
 */
export const fastRadio = Radio.compose<RadioOptions>({
    baseName: "radio",
    template,
    styles,
    checkedIndicator: /* html */ `
        <div part="checked-indicator" class="checked-indicator"></div>
    `,
});

/**
 * Base class for Radio
 * @public
 */
export { Radio };

export { styles as radioStyles };
