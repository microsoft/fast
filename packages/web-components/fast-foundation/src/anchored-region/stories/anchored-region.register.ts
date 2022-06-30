import { css } from "@microsoft/fast-element";
import { FASTAnchoredRegion } from "../anchored-region.js";
import { anchoredRegionTemplate } from "../anchored-region.template.js";

const styles = css`
    :host {
        display: block;
    }
`;

FASTAnchoredRegion.define({
    name: "fast-anchored-region",
    template: anchoredRegionTemplate(),
    styles,
});
