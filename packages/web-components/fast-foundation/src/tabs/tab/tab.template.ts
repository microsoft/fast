import { html } from "@microsoft/fast-element";
import { Tab } from "./tab";

export const TabTemplate = html<Tab>`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
