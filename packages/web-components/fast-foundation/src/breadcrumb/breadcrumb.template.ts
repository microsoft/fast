import { elements, html, slotted } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Breadcrumb } from "./breadcrumb.js";

/**
 * The template for the {@link @ni/fast-foundation#Breadcrumb} component.
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
