import { html, ref, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

export const AnchoredRegionTemplate = html<AnchoredRegion>`
    <template style=${x => x.regionStyle}>
        ${when(x => x.initialLayoutComplete, html<AnchoredRegion>`<slot></slot>`)}
    </template>
`;
