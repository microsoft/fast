import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Badge } from "./badge";

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
        <style>
            ${x => (x.circular ? ":host([circular])" : "")} div.control {
                ${x => x.generateBadgeStyle()}
            }
        </style>
        <div class="control" part="control">
            <slot></slot>
        </div>
    </template>
`;
