import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import type { FASTAnchoredRegion } from "./anchored-region.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTAnchoredRegion:class)} component.
 * @public
 */
export function anchoredRegionTemplate(): ElementViewTemplate<FASTAnchoredRegion> {
    return html<FASTAnchoredRegion>`
        <template class="${x => (x.initialLayoutComplete ? "loaded" : "")}">
            ${when(
                x => x.initialLayoutComplete,
                html<FASTAnchoredRegion>`
                    <slot></slot>
                `
            )}
        </template>
    `;
}
