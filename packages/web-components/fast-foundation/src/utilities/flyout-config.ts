import type { AnchoredRegionConfig } from "../anchored-region/anchored-region-config";

/**
 * A utility interface to label flyout positioning logic
 *
 * @public
 */
export interface FlyoutConfig {
    /**
     *
     */
    name: string;

    /**
     *
     */
    anchoredRegionConfig: AnchoredRegionConfig;
}

export const above: FlyoutConfig = {
    name: "above",
    anchoredRegionConfig: null,
};
