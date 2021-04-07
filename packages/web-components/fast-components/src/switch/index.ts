import { customElement } from "@microsoft/fast-element";
import { Switch, SwitchTemplate as template } from "@microsoft/fast-foundation";
import { SwitchStyles as styles } from "./switch.styles";

/**
 * The FAST Switch Custom Element. Implements {@link @microsoft/fast-foundation#Switch},
 * {@link @microsoft/fast-foundation#SwitchTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-switch\>
 */
export const FASTSwitch = Switch.compose({
    baseName: "switch",
    template,
    styles,
});

/**
 * Styles for Switch
 * @public
 */
export const SwitchStyles = styles;
