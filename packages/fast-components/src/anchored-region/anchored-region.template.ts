import { html, ref, when } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

export const AnchoredRegionTemplate = html<AnchoredRegion>`
  <div
      class="region"
      ${ref("region")}
      style=${x => x.regionStyle}
  >
      ${when(x => x.initialLayoutComplete, html`<slot></slot>`)}
  </div>
`;
