import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Badge } from "./badge";

/**
 * The template for the {@link @microsoft/fast-foundation#Badge} component.
 * @public
 */
export const BadgeTemplate: ViewTemplate<Badge> = html`
    <template class="${x => (x.circular ? "circular" : "")}">
        <div class="control" part="control" style="${x => x.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;
