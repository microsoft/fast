import {
    Switch,
    SwitchOptions,
    switchTemplate as template,
} from "@microsoft/fast-foundation";
import { switchStyles as styles } from "./switch.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Switch} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#switchTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-switch\>
 */
export const fastSwitch = Switch.compose<SwitchOptions>({
    baseName: "switch",
    template,
    styles,
    switch: `
        <span class="checked-indicator" part="checked-indicator"></span>
    `,
});

/**
 * Styles for Switch
 * @public
 */
export const switchStyles = styles;

/**
 * Base class for Switch
 * @public
 */
export { Switch };
