import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTTabPanel } from "./tab-panel.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTTabPanel} component.
 * @public
 */
export function tabPanelTemplate(): ElementViewTemplate<FASTTabPanel> {
    return html<FASTTabPanel>`
        <template slot="tabpanel" role="tabpanel">
            <slot></slot>
        </template>
    `;
}
