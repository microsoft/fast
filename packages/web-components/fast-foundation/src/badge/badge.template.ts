import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Badge } from "./badge.js";

/**
 * The template for the {@link @microsoft/fast-foundation#Badge} component.
 * @public
 */
export const badgeTemplate: FoundationElementTemplate<ViewTemplate<Badge>> = (
    context,
    definition
) => html`
    <template>
        <div class="control" part="control">
            <slot></slot>
        </div>
    </template>
`;
