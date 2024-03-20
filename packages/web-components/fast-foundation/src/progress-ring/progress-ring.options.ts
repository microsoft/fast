import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";
import type { FASTProgressRing } from "./progress-ring.js";

/**
 * ProgressRing configuration options
 * @public
 */
export type ProgressRingOptions = {
    determinateIndicator?: StaticallyComposableHTML<FASTProgressRing>;
    indeterminateIndicator?: StaticallyComposableHTML<FASTProgressRing>;
};
