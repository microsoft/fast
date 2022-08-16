import type { SyntheticViewTemplate } from "@microsoft/fast-element";

/**
 * ProgressRing configuration options
 * @public
 */
export type ProgressRingOptions = {
    determinateIndicator?: string | SyntheticViewTemplate;
    indeterminateIndicator?: string | SyntheticViewTemplate;
};
