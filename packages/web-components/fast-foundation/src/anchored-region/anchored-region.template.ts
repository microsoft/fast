import type { ViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { AnchoredRegion } from "./anchored-region";

/**
 * The template for the {@link @microsoft/fast-foundation#(AnchoredRegion:class)} component.
 * @beta
 */
export const AnchoredRegionTemplate: ViewTemplate<AnchoredRegion> = html`
    <template>
        ${when(
            x => x.initialLayoutComplete,
            html<AnchoredRegion>`
                <slot></slot>
            `
        )}
    </template>
`;
