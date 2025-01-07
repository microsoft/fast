import { html } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { TabPanel } from "./tab-panel.js";
/**
 * The template for the {@link @ni/fast-foundation#TabPanel} component.
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
