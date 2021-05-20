import { html, observable, ViewTemplate } from "@microsoft/fast-element";
import { DelegatesARIALink, Anchor } from "../anchor";
import type { Breadcrumb } from "../breadcrumb";
import { StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";

const breadcrumbItemSeparatorTemplate: ViewTemplate<HTMLElement> = html`
    <span class="separator" part="separator" aria-hidden="true">
        <slot name="separator">/</slot>
    </span>
`;

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

    public generateBreadcrumbItemSeparator(): ViewTemplate {
        if (
            this.parentNode &&
            typeof (this.parentNode as Breadcrumb).generateBreadcrumbSeparator ===
                "function"
        ) {
            (this.parentNode as Breadcrumb).generateBreadcrumbSeparator();
        }
        return breadcrumbItemSeparatorTemplate;
    }
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
