import { html, when } from "@microsoft/fast-element";
import { BreadcrumbItem } from "./breadcrumb-item";

/**
 * The template for the {@link @microsoft/fast-foundation#BreadcrumbItem} component.
 * @public
 */
export const BreadcrumbItemTemplate = html<BreadcrumbItem>`
    <div role="listitem" class="listitem-container" part="listitem-container">
        <slot></slot>
        ${when(
            x => x.showSeparator,
            html<BreadcrumbItem>`
                <span class="separator" aria-hidden="true">
                    <slot name="separator" part="separator">/</slot>
                </span>
            `
        )}
    </div>
`;
