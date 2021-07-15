import { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import { Anchor, DelegatesARIALink } from "../anchor";
import { StartEnd } from "../patterns/index";
/**
 * Breadcrumb Item configuration options
 * @public
 */
export declare type BreadcrumbItemOptions = FoundationElementDefinition & {
    separator?: string | SyntheticViewTemplate;
};
/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export declare class BreadcrumbItem extends Anchor {
    /**
     * @internal
     */
    separator: boolean;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface BreadcrumbItem extends StartEnd, DelegatesARIALink {}
