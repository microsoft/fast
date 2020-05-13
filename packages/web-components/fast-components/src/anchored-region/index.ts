import { customElement } from "@microsoft/fast-element";
import {
    AnchoredRegion,
    AnchoredRegionTemplate as template,
} from "@microsoft/fast-foundation";
import { AnchoredRegionStyles as styles } from "./anchored-region.styles";

@customElement({
    name: "fast-anchored-region",
    template,
    styles,
})
export class FASTAnchoredRegion extends AnchoredRegion {}
