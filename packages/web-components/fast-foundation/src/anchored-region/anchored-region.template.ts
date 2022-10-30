import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import type { FASTAnchoredRegion } from "./anchored-region.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTAnchoredRegion:class)} component.
 * @public
 */
export function anchoredRegionTemplate<
    T extends FASTAnchoredRegion
>(): ElementViewTemplate<T> {
    return html<T>`
        <template data-loaded="${x => (x.initialLayoutComplete ? "loaded" : "")}">
            ${when(
                x => x.initialLayoutComplete,
                html<T>`
                    <slot></slot>
                `
            )}
        </template>
    `;
}
