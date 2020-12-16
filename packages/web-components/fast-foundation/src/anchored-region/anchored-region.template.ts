import { html, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

/**
 * The template for the {@link @microsoft/fast-foundation#(AnchoredRegion:class)} component.
 * @beta
 */
export const AnchoredRegionTemplate = html<AnchoredRegion>`
    <template>
        ${when(
            x => x.initialLayoutComplete,
            html<AnchoredRegion>`
                <slot></slot>
            `
        )}
    </template>
`;
