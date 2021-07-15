import { Swatch, SwatchRGB } from "./swatch";
import { RelativeLuminance } from "./utilities/relative-luminance";
/**
 * A collection of {@link Swatch} instances
 * @public
 */
export interface Palette<T extends Swatch = Swatch> {
    readonly source: T;
    readonly swatches: ReadonlyArray<T>;
    /**
     * Returns a swatch from the palette that most closely matches
     * the contrast ratio provided to a provided reference.
     */
    colorContrast(
        reference: Swatch,
        contrast: number,
        initialIndex?: number,
        direction?: 1 | -1
    ): T;
    /**
     * Returns the index of the palette that most closely matches
     * the relativeLuminance of the provided swatch
     */
    closestIndexOf(reference: RelativeLuminance): number;
    /**
     * Gets a swatch by index. Index is clamped to the limits
     * of the palette so a Swatch will always be returned.
     */
    get(index: number): T;
}
/** @public */
export declare type PaletteRGB = Palette<SwatchRGB>;
/** @public */
export declare const PaletteRGB: Readonly<{
    create(source: SwatchRGB): PaletteRGB;
}>;
