import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTTooltip } from "./tooltip.js";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(FASTTooltip:class)} component using the provided prefix.
 * @public
 */
export function tooltipTemplate<T extends FASTTooltip>(): ElementViewTemplate<T> {
    return html<T>`
        <template role="tooltip" ?visible="${x => x.visible}">
            <slot></slot>
        </template>
    `;
}
