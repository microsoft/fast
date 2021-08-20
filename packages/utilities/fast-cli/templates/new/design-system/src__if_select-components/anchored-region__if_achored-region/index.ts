import {
    AnchoredRegion,
    anchoredRegionTemplate as template,
} from "@microsoft/fast-foundation";
import { anchoredRegionStyles as styles } from "./anchored-region.styles";

/**
 * A function that returns a Anchored Region registration for configuring the component with a DesignSystem.
 * Implements Anchored
 *
 * @beta
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-anchored-region\>
 */
export const /* @echo namespace */AnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template,
    styles,
});

/**
 * Styles for AnchoredRegion
 * @public
 */
export const anchoredRegionStyles = styles;

/**
 * Base class for AnchoredRegion
 * @public
 */
export { AnchoredRegion };
