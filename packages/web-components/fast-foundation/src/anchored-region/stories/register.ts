import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { AnchoredRegion } from "../anchored-region.js";
import { anchoredRegionTemplate as template } from "../anchored-region.template.js";

const styles = () => css`
    :host {
        display: block;
    }
`;

DesignSystem.getOrCreate(document.body)
    .withPrefix("fast")
    .register(
        AnchoredRegion.compose({
            baseName: "anchored-region",
            template,
            styles,
        })()
    );
