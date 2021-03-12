import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { TabPanel } from "./tab-panel";
/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
export const TabPanelTemplate: ViewTemplate<TabPanel> = html`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
