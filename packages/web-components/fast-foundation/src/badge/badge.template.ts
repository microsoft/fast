import { html } from "@microsoft/fast-element";
import { Badge } from "./badge";

export const BadgeTemplate = html<Badge>`
    <template class="${x => (x.circular ? "circular" : "")}">
        <div
            class="badge"
            style="${x =>
                x.fill || x.color
                    ? `background-color: var(--badge-fill-${x.fill}); color: var(--badge-color-${x.color})`
                    : void 0}"
        >
            <slot></slot>
        </div>
    </template>
`;
