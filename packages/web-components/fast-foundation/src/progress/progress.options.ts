import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";
import type { FASTProgress } from "./progress.js";

/**
 * Progress configuration options
 * @public
 */
export type ProgressOptions = {
    indeterminateIndicator1?: StaticallyComposableHTML<FASTProgress>;
    indeterminateIndicator2?: StaticallyComposableHTML<FASTProgress>;
};
