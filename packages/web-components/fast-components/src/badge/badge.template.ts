import { html } from "@microsoft/fast-element";
import { Badge } from "./badge";

export const BadgeTemplate = html<Badge>`
    <template class="${x => (x.circular ? "circular" : void 0)}">
        <div
            class="badge"
            style="background-color: var(--badge-fill-${x =>
                x.fill}); color: var(--badge-color-${x => x.color})"
        >
            <slot></slot>
        </div>
    </template>
`;
