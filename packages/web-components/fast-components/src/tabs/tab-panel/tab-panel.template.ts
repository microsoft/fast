import { html } from "@microsoft/fast-element";
import { TabPanel } from "./tab-panel";

export const TabPanelTemplate = html<TabPanel>`
    <template role="tabpanel">
        <slot></slot>
    </template>
`;
