import {
    clamp,
    ColorRGBA64,
    ComponentStateColorPalette,
    parseColorHexRGB,
} from "@microsoft/fast-colors";
import { SwatchRGB } from "./swatch";
import { binarySearch } from "./utilities/binary-search";
import { directionByIsDark } from "./utilities/direction-by-is-dark";
import { contrast } from "./utilities/relative-luminance";
/** @public */
export const PaletteRGB = Object.freeze({
    create(source) {
        return PaletteRGBImpl.from(source);
    },
});
/**
 * A {@link Palette} representing RGB swatch values.
 * @public
 */
class PaletteRGBImpl {
    /**
     *
     * @param source - The source color for the palette
     * @param swatches - All swatches in the palette
     */
    constructor(source, swatches) {
        this.source = source;
        this.swatches = swatches;
        this.reversedSwatches = Object.freeze([...this.swatches].reverse());
        this.lastIndex = this.swatches.length - 1;
    }
    /**
     * {@inheritdoc Palette.colorContrast}
     */
    colorContrast(reference, contrastTarget, initialSearchIndex, direction) {
        if (initialSearchIndex === undefined) {
            initialSearchIndex = this.closestIndexOf(reference);
        }
        let source = this.swatches;
        const endSearchIndex = this.lastIndex;
        let startSearchIndex = initialSearchIndex;
        if (direction === undefined) {
            direction = directionByIsDark(reference);
        }
        const condition = value => contrast(reference, value) >= contrastTarget;
        if (direction === -1) {
            source = this.reversedSwatches;
            startSearchIndex = endSearchIndex - startSearchIndex;
        }
        return binarySearch(source, condition, startSearchIndex, endSearchIndex);
    }
    /**
     * {@inheritdoc Palette.get}
     */
    get(index) {
        return this.swatches[index] || this.swatches[clamp(index, 0, this.lastIndex)];
    }
    /**
     * {@inheritdoc Palette.closestIndexOf}
     */
    closestIndexOf(reference) {
        const index = this.swatches.indexOf(reference);
        if (index !== -1) {
            return index;
        }
        const closest = this.swatches.reduce((previous, next) =>
            Math.abs(next.relativeLuminance - reference.relativeLuminance) <
            Math.abs(previous.relativeLuminance - reference.relativeLuminance)
                ? next
                : previous
        );
        return this.swatches.indexOf(closest);
    }
    /**
     * Create a color palette from a provided swatch
     * @param source - The source swatch to create a palette from
     * @returns
     */
    static from(source) {
        return new PaletteRGBImpl(
            source,
            Object.freeze(
                new ComponentStateColorPalette({
                    baseColor: ColorRGBA64.fromObject(source),
                }).palette.map(x => {
                    const _x = parseColorHexRGB(x.toStringHexRGB());
                    return SwatchRGB.create(_x.r, _x.g, _x.b);
                })
            )
        );
    }
}
