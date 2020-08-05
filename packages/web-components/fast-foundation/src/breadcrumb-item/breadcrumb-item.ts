import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
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
     * The name of the hyperlink
     *
     * @public
     * @remarks
     * HTML Attribute: name
     */
    @attr
    public name: string;

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

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface BreadcrumbItem extends StartEnd {}
applyMixins(BreadcrumbItem, StartEnd);
