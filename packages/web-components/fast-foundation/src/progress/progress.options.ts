import type { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../index.js";

/**
 * Progress configuration options
 * @public
 */
export type ProgressOptions = FoundationElementDefinition & {
    indeterminateIndicator1?: string | SyntheticViewTemplate;
    indeterminateIndicator2?: string | SyntheticViewTemplate;
};
