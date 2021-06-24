import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Badge } from "./badge";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";

/**
 * The template for the {@link @microsoft/fast-foundation#Badge} component.
 * @public
 */
export const badgeTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Badge> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template class="${x => (x.circular ? "circular" : "")}">
        <div class="control" part="control" style="${x => x.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;
