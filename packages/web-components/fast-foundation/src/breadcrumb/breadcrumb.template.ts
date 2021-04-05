import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Breadcrumb } from "./breadcrumb";

/**
 * The template for the {@link @microsoft/fast-foundation#Breadcrumb} component.
 * @public
 */
export const BreadcrumbTemplate: (context, definition) => ViewTemplate<Breadcrumb> = (
    context,
    definition
) => html`
    <${context.tagFor(Breadcrumb)} role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
            ></slot>
        </div>
    </${context.tagFor(Breadcrumb)}>
`;
