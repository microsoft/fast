import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type {
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Tab } from "./tab";

/**
 * The template for the {@link @microsoft/fast-foundation#Tab} component.
 * @public
 */
export const tabTemplate: FoundationElementTemplate<ViewTemplate<Tab>> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
        <slot></slot>
    </template>
`;
