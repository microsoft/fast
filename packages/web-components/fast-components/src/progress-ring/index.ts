import {
    BaseProgress as ProgressRing,
    ProgressRingOptions,
    progressRingTemplate as template,
} from "@microsoft/fast-foundation";
import { progressRingStyles as styles } from "./progress-ring.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#BaseProgress} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#progressRingTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-progress-ring>`
 */
export const fastProgressRing = ProgressRing.compose<ProgressRingOptions>({
    baseName: "progress-ring",
    template,
    styles,
    indeterminateIndicator: /* html */ `
        <svg class="progress" part="progress" viewBox="0 0 16 16">
            <circle
                class="background"
                part="background"
                cx="8px"
                cy="8px"
                r="7px"
            ></circle>
            <circle
                class="indeterminate-indicator-1"
                part="indeterminate-indicator-1"
                cx="8px"
                cy="8px"
                r="7px"
            ></circle>
        </svg>
    `,
});

/**
 * Base class for ProgressRing
 * @public
 */
export { ProgressRing };

export { styles as progressRingStyles };
