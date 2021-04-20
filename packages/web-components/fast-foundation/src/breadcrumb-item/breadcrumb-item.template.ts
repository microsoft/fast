import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { anchorTemplate } from "../anchor";
import { endTemplate, startTemplate } from "../patterns/start-end";
import type { BreadcrumbItem } from "./breadcrumb-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(BreadcrumbItem:class)} component.
 * @public
 */
export const breadcrumbItemTemplate: (
    context,
    definition
) => ViewTemplate<BreadcrumbItem> = (context, definition) => html`
    <div role="listitem" class="listitem" part="listitem">
        ${when(
            x => x.href && x.href.length > 0,
            html<BreadcrumbItem>`
                ${anchorTemplate(context, definition)}
            `
        )}
        ${when(
            x => !x.href,
            html<BreadcrumbItem>`
                ${startTemplate}
                <slot></slot>
                ${endTemplate}
            `
        )}
        ${when(
            x => x.separator,
            html<BreadcrumbItem>`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">/</slot>
                </span>
            `
        )}
    </div>
`;
