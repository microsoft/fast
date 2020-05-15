import { html } from "@microsoft/fast-element";
import { TabPanel } from "./tab-panel.js";

export const TabPanelTemplate = html<TabPanel>`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
