import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { TabPanel } from "./tab-panel";
/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
export const tabPanelTemplate: FoundationElementTemplate<ViewTemplate<TabPanel>> = (
    context,
    definition
) => html`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
