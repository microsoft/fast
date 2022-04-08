import {
    BaseProgress as Progress,
    ProgressOptions,
    progressTemplate as template,
} from "@microsoft/fast-foundation";
import { progressStyles as styles } from "./progress.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#BaseProgress} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#progressTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-progress>`
 */
export const fastProgress = Progress.compose<ProgressOptions>({
    baseName: "progress",
    template,
    styles,
    indeterminateIndicator1: /* html */ `
        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
    `,
    indeterminateIndicator2: /* html */ `
        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
    `,
});

/**
 * Base class for Progress
 * @public
 */
export { Progress };

export { styles as progressStyles };
