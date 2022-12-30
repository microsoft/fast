import type {
    DangerousHTMLDirective,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";

/**
 * ProgressRing configuration options
 * @public
 */
export type ProgressRingOptions = {
    indeterminateIndicator?: DangerousHTMLDirective | SyntheticViewTemplate;
};
