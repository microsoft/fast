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
        <template
            data-loaded="${x => (x.initialLayoutComplete ? "loaded" : "")}"
            :classList=${x => {
                return `
                    ${x.verticalPosition === "start" ? "top" : ""}
                    ${x.verticalPosition === "end" ? "bottom" : ""}
                    ${x.verticalPosition === "insetStart" ? "inset-top" : ""}
                    ${x.verticalPosition === "insetEnd" ? "inset-bottom" : ""}
                    ${x.verticalPosition === "center" ? "vertical-center" : ""}

                    ${x.horizontalPosition === "start" ? "left" : ""}
                    ${x.horizontalPosition === "end" ? "right" : ""}
                    ${x.horizontalPosition === "insetStart" ? "inset-left" : ""}
                    ${x.horizontalPosition === "insetEnd" ? "inset-right" : ""}
                    ${x.horizontalPosition === "center" ? "horizontal-center" : ""}
                    ${x.loaded ? "loaded" : ""}
                    `;
            }}
        >
            ${when(
                x => x.initialLayoutComplete,
                html<T>`
                    <slot></slot>
                `
            )}
        </template>
    `;
}
