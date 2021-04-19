import {
    BaseProgress as Progress,
    ProgressRingTemplate as template,
} from "@microsoft/fast-foundation";
import { ProgressRingStyles as styles } from "./progress-ring.styles";

/**
 * The FAST Progress Ring Element. Implements {@link @microsoft/fast-foundation#BaseProgress},
 * {@link @microsoft/fast-foundation#ProgressRingTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-progress-ring\>
 */
export const fastProgressRing = Progress.compose({
    baseName: "progress-ring",
    template,
    styles,
});

/**
 * Styles for ProgressRing
 * @public
 */
export const ProgressRingStyles = styles;
