import {
    AnchoredRegion,
    anchoredRegionTemplate as template,
} from "@microsoft/fast-foundation";
import { anchoredRegionStyles as styles } from "./anchored-region.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#AnchoredRegion} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#anchoredRegionTemplate}
 *
 *
 * @beta
 * @remarks
 * Generates HTML Element: `<fast-anchored-region>`
 */
export const fastAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template,
    styles,
});

/**
 * Base class for AnchoredRegion
 * @public
 */
export { AnchoredRegion };

export { styles as anchoredRegionStyles };
