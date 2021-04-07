import {
    BaseProgress as Progress,
    ProgressTemplate as template,
} from "@microsoft/fast-foundation";
import { ProgressStyles as styles } from "./progress.styles";

/**
 * The FAST Progress Element. Implements {@link @microsoft/fast-foundation#BaseProgress},
 * {@link @microsoft/fast-foundation#ProgressTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-progress\>
 */
export const FASTProgress = Progress.compose({
    baseName: "progress",
    template,
    styles,
});

/**
 * Styles for Progress
 * @public
 */
export const ProgressStyles = styles;
