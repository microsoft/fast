import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";
import type { FASTProgress } from "./progress.js";

/**
 * Progress configuration options
 * @public
 */
export type ProgressOptions = {
    determinateIndicator?: StaticallyComposableHTML<FASTProgress>;
    indeterminateIndicator?: StaticallyComposableHTML<FASTProgress>;
};
