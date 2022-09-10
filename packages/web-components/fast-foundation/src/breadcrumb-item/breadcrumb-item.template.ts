import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { anchorTemplate } from "../anchor/anchor.template.js";
import type { BreadcrumbItemOptions, FASTBreadcrumbItem } from "./breadcrumb-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTBreadcrumbItem:class)} component.
 * @public
 */
export function breadcrumbItemTemplate<T extends FASTBreadcrumbItem>(
    options: BreadcrumbItemOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <div role="listitem" class="listitem" part="listitem">
            ${anchorTemplate(options)}
            ${when(
                x => x.separator,
                html<T>`
                    <span class="separator" part="separator" aria-hidden="true">
                        <slot name="separator">${options.separator ?? ""}</slot>
                    </span>
                `
            )}
        </div>
    `;
}
