import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { anchorTemplate } from "../anchor";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { ElementDefinitionContext } from "../design-system";
import type { BreadcrumbItem, BreadcrumbItemOptions } from "./breadcrumb-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(BreadcrumbItem:class)} component.
 * @public
 */
export const breadcrumbItemTemplate: (
    context: ElementDefinitionContext,
    definition: BreadcrumbItemOptions
) => ViewTemplate<BreadcrumbItem> = (
    context: ElementDefinitionContext,
    definition: BreadcrumbItemOptions
) => html`
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
                ${startSlotTemplate(context, definition)}
                <slot></slot>
                ${endSlotTemplate(context, definition)}
            `
        )}
        ${when(
            x => x.separator,
            html<BreadcrumbItem>`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${definition.separator || ""}</slot>
                </span>
            `
        )}
    </div>
`;
