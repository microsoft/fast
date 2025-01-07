import { observable, SyntheticViewTemplate } from "@ni/fast-element";
import type { FoundationElementDefinition } from "../foundation-element/foundation-element.js";
import { Anchor, DelegatesARIALink } from "../anchor/anchor.js";
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
export type BreadcrumbItemOptions = FoundationElementDefinition &
    StartEndOptions & {
        separator?: string | SyntheticViewTemplate;
    };

/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class BreadcrumbItem extends Anchor {
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
export interface BreadcrumbItem extends StartEnd, DelegatesARIALink {}
applyMixins(BreadcrumbItem, StartEnd, DelegatesARIALink);
