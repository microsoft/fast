import { Divider, dividerTemplate as template } from "@microsoft/fast-foundation";
import { dividerStyles as styles } from "./divider.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Divider} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#dividerTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-divider>`
 */
export const fastDivider = Divider.compose({
    baseName: "divider",
    template,
    styles,
});

/**
 * Base class for Divider
 * @public
 */
export { Divider };

export { styles as dividerStyles };
