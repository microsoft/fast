import {
    BaseProgress as ProgressRing,
    ProgressRingOptions,
    progressRingTemplate as template,
} from "@microsoft/fast-foundation";
import { progressRingStyles as styles } from "./progress-ring.styles";

/**
 * A function that returns a Progres Ring registration for configuring the component with a DesignSystem.
 * Implements Progres Ring
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-progress-ring\>
 */
export const /* @echo namespace */ProgressRing = ProgressRing.compose<ProgressRingOptions>({
    baseName: "progress-ring",
    template,
    styles,
    indeterminateIndicator: `
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
 * Styles for ProgressRing
 * @public
 */
export const progressRingStyles = styles;

/**
 * Base class for ProgressRing
 * @public
 */
export { ProgressRing };
