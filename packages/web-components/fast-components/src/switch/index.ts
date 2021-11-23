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
 * Generates HTML Element: `<fast-switch>`
 */
export const fastSwitch = Switch.compose<SwitchOptions>({
    baseName: "switch",
    template,
    styles,
    switch: `
        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4"/>
        </svg>
    `,
});

/**
 * Base class for Switch
 * @public
 */
export { Switch };

export { styles as switchStyles };
