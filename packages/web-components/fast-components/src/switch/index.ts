import { Switch, switchTemplate as template } from "@microsoft/fast-foundation";
import { switchStyles as styles } from "./switch.styles";

/**
 * The FAST Switch Custom Element. Implements {@link @microsoft/fast-foundation#Switch},
 * {@link @microsoft/fast-foundation#switchTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-switch\>
 */
export const fastSwitch = Switch.compose({
    baseName: "switch",
    template,
    styles,
});

/**
 * Styles for Switch
 * @public
 */
export const switchStyles = styles;
