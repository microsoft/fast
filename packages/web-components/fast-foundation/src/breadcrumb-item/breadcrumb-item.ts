import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";
import { DelegatesARIALink } from "../anchor/index";

/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class BreadcrumbItem extends FASTElement {
    /**
     * The URL of the hyperlink
     * @public
     * @remarks
     * HTML Attribute: href
     */
    @attr
    public href: string;

    /**
     * @internal
     */
    @observable
    public showSeparator: boolean = true;

    /**
     * @internal
     */
    @observable
    public isCurrent: boolean = false;
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
