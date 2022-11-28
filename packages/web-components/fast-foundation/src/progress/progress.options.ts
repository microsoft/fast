import type {
    DangerousHTMLDirective,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";

/**
 * Progress configuration options
 * @public
 */
export type ProgressOptions = {
    indeterminateIndicator1?: DangerousHTMLDirective | SyntheticViewTemplate;
    indeterminateIndicator2?: DangerousHTMLDirective | SyntheticViewTemplate;
};
