import { customElement } from "@microsoft/fast-element";
import { AnchoredRegion } from "./anchored-region";
import { AnchoredRegionTemplate as template } from "./anchored-region.template";
import { AnchoredRegionStyles as styles } from "./anchored-region.styles";

@customElement({
    name: "fast-anchored-region",
    template,
    styles,
})
export class FASTAnchoredRegion extends AnchoredRegion {}
export * from "./anchored-region.template";
export * from "./anchored-region.styles";
export * from "./anchored-region";
