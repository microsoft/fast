import { html, ref } from "@microsoft/fast-element";
import { Skeleton } from "./skeleton";

export const SkeletonTemplate = html<Skeleton>`
  <template
    aria-busy="${x => x.ariaBusy}"
    shape="${x => x.shape}"
    class="${x => (x.shape === "circle" ? "circle" : "rect")}"
  >
    <span ${ref("shimmerEl")} class="shimmer" ></span>
    <slot></slot>
  </template>
`;
