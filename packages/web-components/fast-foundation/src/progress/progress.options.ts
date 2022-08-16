import type { SyntheticViewTemplate } from "@microsoft/fast-element";

/**
 * Progress configuration options
 * @public
 */
export type ProgressOptions = {
    determinateIndicator?: string | SyntheticViewTemplate;
    indeterminateIndicator?: string | SyntheticViewTemplate;
};
