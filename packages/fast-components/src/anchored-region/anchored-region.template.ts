import { html } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";

export const AnchoredRegionTemplate = html<AnchoredRegion>`
  <div class="root">
    <slot></slot>
  </div>
`;
