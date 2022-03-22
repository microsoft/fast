import { observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import { Anchor, DelegatesARIALink } from "../anchor";
import { StartEnd, StartEndOptions } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";

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
