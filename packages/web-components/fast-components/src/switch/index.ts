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
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="12" height="12" rx="6"/>
    </svg>
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
