import { customElement } from "@microsoft/fast-element";
// TODO: Update this pathing once we export anchored region from `fast-foundation`
import {
    AnchoredRegion,
    AnchoredRegionTemplate as template,
} from "@microsoft/fast-foundation/dist/esm/anchored-region/index.js";
import { AnchoredRegionStyles as styles } from "./anchored-region.styles";

@customElement({
    name: "fast-anchored-region",
    template,
    styles,
})
export class FASTAnchoredRegion extends AnchoredRegion {}
