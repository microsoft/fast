import { html } from "@microsoft/fast-element";
import { Tab } from "./tab.js";

export const TabTemplate = html<Tab>`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
