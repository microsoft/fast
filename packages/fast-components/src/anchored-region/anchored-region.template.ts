import { html, ref } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

export const AnchoredRegionTemplate = html<AnchoredRegion>`
  <template>
      <div
          class="region"
          ${ref("region")}
          style=${x => x.regionStyle}
    >
    <slot></slot>
    </div>
  </template>
`;
