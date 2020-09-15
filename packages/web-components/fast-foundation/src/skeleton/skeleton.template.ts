import { html } from "@microsoft/fast-element";
import { Skeleton } from "./skeleton";

export const SkeletonTemplate = html<Skeleton>`
  <template
    aria-busy="${x => x.ariaBusy}"
    shape="${x => x.shape}"
    class="${x => (x.shape === "circle" ? "circle" : "rect")}"
    pattern="${x => x.pattern}"
  >
    <slot></slot>
  </template>
`;
