import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTTab } from "./tab.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTTab} component.
 * @public
 */
export function tabTemplate(): ElementViewTemplate<FASTTab> {
    return html<FASTTab>`
        <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
            <slot></slot>
        </template>
    `;
}
