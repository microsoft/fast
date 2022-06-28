import { observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import { DelegatesARIALink, FASTAnchor } from "../anchor/anchor.js";
import { StartEnd, StartEndOptions } from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Breadcrumb Item configuration options
 *
 * @slot - The default slot for when no href is provided or for providing your own custom elements
 * @slot separator - The slot for providing a custom separator
 * @csspart listitem - The wrapping container for the item, represents a semantic listitem
 * @csspart separator - The wrapping element for the separator
 *
 * @public
 */
export type BreadcrumbItemOptions = StartEndOptions & {
    separator?: string | SyntheticViewTemplate;
};

/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class FASTBreadcrumbItem extends FASTAnchor {
    /**
     * @internal
     */
    @observable
    public separator: boolean = true;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface FASTBreadcrumbItem extends StartEnd, DelegatesARIALink {}
applyMixins(FASTBreadcrumbItem, StartEnd, DelegatesARIALink);
