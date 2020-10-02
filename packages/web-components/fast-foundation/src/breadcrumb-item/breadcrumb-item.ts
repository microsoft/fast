import { observable } from "@microsoft/fast-element";
import { DelegatesARIALink, Anchor } from "../anchor";
import { StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";

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
    public showSeparator: boolean = true;
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
