import {
    AnchoredRegion,
    AnchoredRegionTemplate as template,
} from "@microsoft/fast-foundation";
import { AnchoredRegionStyles as styles } from "./anchored-region.styles";

/**
 * The FAST AnchoredRegion Element. Implements {@link @microsoft/fast-foundation#AnchoredRegion},
 * {@link @microsoft/fast-foundation#AnchoredRegionTemplate}
 *
 *
 * @beta
 * @remarks
 * HTML Element: \<fast-anchored-region\>
 */
export const fastAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template,
    styles,
});

/**
 * Styles for AnchoredRegion
 * @public
 */
export const AnchoredRegionStyles = styles;
