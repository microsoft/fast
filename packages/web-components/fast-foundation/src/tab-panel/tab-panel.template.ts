import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTTabPanel } from "./tab-panel.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTTabPanel} component.
 * @public
 */
export function tabPanelTemplate<T extends FASTTabPanel>(): ElementViewTemplate<T> {
    return html<T>`
        <template slot="tabpanel" role="tabpanel">
            <slot></slot>
        </template>
    `;
}
