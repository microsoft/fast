import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTTooltip } from "./tooltip.js";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(FASTTooltip:class)} component using the provided prefix.
 * @public
 */
export function tooltipTemplate(): ElementViewTemplate<FASTTooltip> {
    return html<FASTTooltip>`
        <template role="tooltip"><slot></slot></template>
    `;
}
