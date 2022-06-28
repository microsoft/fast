import type { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../index.js";

/**
 * ProgressRing configuration options
 * @public
 */
export type ProgressRingOptions = FoundationElementDefinition & {
    indeterminateIndicator?: string | SyntheticViewTemplate;
};
