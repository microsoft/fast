import { html, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

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
