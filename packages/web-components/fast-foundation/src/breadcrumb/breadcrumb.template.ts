import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Breadcrumb } from "./breadcrumb";

/**
 * The template for the {@link @microsoft/fast-foundation#Breadcrumb} component.
 * @public
 */
export const breadcrumbTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Breadcrumb> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
            ></slot>
        </div>
    </template>
`;
