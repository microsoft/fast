import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Breadcrumb } from "./breadcrumb";

/**
 * The template for the {@link @microsoft/fast-foundation#Breadcrumb} component.
 * @public
 */
export const breadcrumbTemplate: FoundationElementTemplate<ViewTemplate<Breadcrumb>> = (
    context,
    definition
) => html`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
            ></slot>
        </div>
    </template>
`;
