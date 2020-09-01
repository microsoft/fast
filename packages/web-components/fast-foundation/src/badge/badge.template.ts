import { html } from "@microsoft/fast-element";
import { Badge } from "./badge";

/**
 * The template for the {@link @microsoft/fast-foundation#Badge} component.
 * @public
 */
export const BadgeTemplate = html<Badge>`
    <template class="${x => (x.circular ? "circular" : "")}">
        <div
            class="control"
            part="control"
            style="${x =>
                x.fill || x.color
                    ? `background-color: var(--badge-fill-${x.fill}); color: var(--badge-color-${x.color})`
                    : void 0}"
        >
            <slot></slot>
        </div>
    </template>
`;
