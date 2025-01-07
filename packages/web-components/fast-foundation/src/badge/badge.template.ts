import { html } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Badge } from "./badge.js";

/**
 * The template for the {@link @ni/fast-foundation#Badge} component.
 * @public
 */
export const badgeTemplate: FoundationElementTemplate<ViewTemplate<Badge>> = (
    context,
    definition
) => html`
    <template class="${x => (x.circular ? "circular" : "")}">
        <div class="control" part="control" style="${x => x.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;
