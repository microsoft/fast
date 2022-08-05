import { observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element/foundation-element.js";
import { Anchor, DelegatesARIALink } from "../anchor/anchor.js";
import { StartEnd, StartEndOptions } from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Breadcrumb Item configuration options
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
