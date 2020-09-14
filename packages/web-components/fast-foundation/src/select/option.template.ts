import { html, slotted } from "@microsoft/fast-element";
import { Option } from "./option";

export const OptionTemplate = html<Option>`
    <template
        tabindex="0"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        current="${x => x.checked ? "" : null}"
        checked="${x => x.checked ? "" : null}"
    >
        <slot></slot>
    </template>
`;