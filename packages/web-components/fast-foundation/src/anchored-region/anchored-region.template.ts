import { html, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { AnchoredRegion } from "./anchored-region.js";

/**
 * The template for the {@link @ni/fast-foundation#(AnchoredRegion:class)} component.
 * @public
 */
export const anchoredRegionTemplate: FoundationElementTemplate<ViewTemplate<
    AnchoredRegion
>> = (context, definition) => html`
    <template class="${x => (x.initialLayoutComplete ? "loaded" : "")}">
        ${when(
            x => x.initialLayoutComplete,
            html<AnchoredRegion>`
                <slot></slot>
            `
        )}
    </template>
`;
