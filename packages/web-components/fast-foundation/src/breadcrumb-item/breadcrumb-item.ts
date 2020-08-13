import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";

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
 * Includes ARIA states and properties relating to the ARIA link role
 *
 * @public
 */
export class DelegatesARIABreadcrumbItem extends ARIAGlobalStatesAndProperties {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#link} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @attr({ attribute: "aria-expanded", mode: "fromView" })
    public ariaExpanded: "true" | "false" | undefined;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface BreadcrumbItem extends StartEnd, DelegatesARIABreadcrumbItem {}
applyMixins(BreadcrumbItem, StartEnd, DelegatesARIABreadcrumbItem);
