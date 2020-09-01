import { html } from "@microsoft/fast-element";
import { TabPanel } from "./tab-panel";
/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
export const TabPanelTemplate = html<TabPanel>`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
