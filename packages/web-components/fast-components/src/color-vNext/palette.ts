import {
    clamp,
    ComponentStateColorPalette,
    parseColorHexRGB,
} from "@microsoft/fast-colors";
import { Swatch, SwatchRGB } from "./swatch";
import { binarySearch } from "./utilities/binary-search";
import { directionByIsDark } from "./utilities/direction-by-is-dark";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance";

/**
 * @public
 */
export interface Palette<T extends Swatch = Swatch> {
    readonly source: T;
    readonly swatches: ReadonlyArray<T>;

    /**
     * Returns a swatch from the palette that most closely matches
     * the contrast ratio provided to a provided reference.
     *
     * @remarks
     * We need to know where to start searching
     * and which direction to search in - isDarkMode?
     */
    colorContrast(
        reference: Swatch,
        contrast: number,
        initialIndex?: number,
        direction?: 1 | -1
    ): Swatch;

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

/**
 * A {@link Palette} representing RGB swatch values.
 * @public
 */
export class PaletteRGB implements Palette<SwatchRGB> {
    public readonly source: SwatchRGB;
    public readonly swatches: ReadonlyArray<SwatchRGB>;
    private lastIndex: number;
    private reversedSwatches: ReadonlyArray<SwatchRGB>;
    /**
     *
     * @param source - The source color for the palette
     * @param swatches - All swatches in the palette
     */
    constructor(source: SwatchRGB, swatches: ReadonlyArray<SwatchRGB>) {
        this.source = source;
        this.swatches = swatches;

        this.reversedSwatches = Object.freeze([...this.swatches].reverse());
        this.lastIndex = this.swatches.length - 1;
    }

    public colorContrast(
        reference: Swatch,
        contrastTarget: number,
        initialSearchIndex?: number,
        direction?: 1 | -1
    ): SwatchRGB {
        if (initialSearchIndex === undefined) {
            initialSearchIndex = this.closestIndexOf(reference);
        }

        let source: ReadonlyArray<SwatchRGB> = this.swatches;
        const endSearchIndex = this.lastIndex;
        let startSearchIndex = initialSearchIndex;

        if (direction === undefined) {
            direction = directionByIsDark(reference);
        }

        const condition = (value: SwatchRGB) =>
            contrast(reference, value) >= contrastTarget;

        if (direction === -1) {
            source = this.reversedSwatches;
            startSearchIndex = endSearchIndex - startSearchIndex;
        }

        return binarySearch(source, condition, startSearchIndex, endSearchIndex);
    }

    public get(index: number): SwatchRGB {
        return (
            this.swatches[index] ||
            this.swatches[clamp(index, 0, this.swatches.length - 1)]
        );
    }

    public closestIndexOf(reference: Swatch): number {
        const index = this.swatches.indexOf(reference as SwatchRGB);

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
    static from(source: SwatchRGB) {
        return new PaletteRGB(
            source,
            Object.freeze(
                new ComponentStateColorPalette({
                    baseColor: source,
                }).palette.map(x => {
                    const _x = parseColorHexRGB(x.toStringHexRGB())!;
                    return new SwatchRGB(_x.r, _x.g, _x.b);
                })
            )
        );
    }
}
