import {
    clamp,
    ColorRGBA64,
    ComponentStateColorPalette,
    parseColorHexRGB,
} from "@microsoft/fast-colors";
import { isSwatchRGB, Swatch, SwatchRGB } from "./swatch.js";
import { binarySearch } from "./utilities/binary-search.js";
import { directionByIsDark } from "./utilities/direction-by-is-dark.js";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

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
export type PaletteRGB = Palette<SwatchRGB>;

/**
 * Creates a PaletteRGB from input R, G, B color values.
 * @param r - Red value represented as a number between 0 and 1.
 * @param g - Green value represented as a number between 0 and 1.
 * @param b - Blue value represented as a number between 0 and 1.
 */
function create(r: number, g: number, b: number): PaletteRGB;
/**
 * Creates a PaletteRGB from a source SwatchRGB object.
 * @deprecated - Use PaletteRGB.from()
 */
function create(source: SwatchRGB): PaletteRGB;
function create(rOrSource: SwatchRGB | number, g?: number, b?: number): PaletteRGB {
    if (typeof rOrSource === "number") {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        return PaletteRGB.from(SwatchRGB.create(rOrSource, g!, b!));
    } else {
        return PaletteRGB.from(rOrSource);
    }
}

/**
 * Creates a PaletteRGB from a source color object.
 * @param source - The source color
 */
function from(source: SwatchRGB): PaletteRGB;
function from(source: Record<"r" | "g" | "b", number>): PaletteRGB;
function from(source: any): PaletteRGB {
    return isSwatchRGB(source)
        ? PaletteRGBImpl.from(source)
        : PaletteRGBImpl.from(SwatchRGB.create(source.r, source.g, source.b));
}
/** @public */
export const PaletteRGB = Object.freeze({
    create,
    from,
});

/**
 * A {@link Palette} representing RGB swatch values.
 * @public
 */
class PaletteRGBImpl implements Palette<SwatchRGB> {
    /**
     * {@inheritdoc Palette.source}
     */
    public readonly source: SwatchRGB;
    public readonly swatches: ReadonlyArray<SwatchRGB>;
    private lastIndex: number;
    private reversedSwatches: ReadonlyArray<SwatchRGB>;
    private closestIndexCache = new Map<number, number>();

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

    /**
     * {@inheritdoc Palette.colorContrast}
     */
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

    /**
     * {@inheritdoc Palette.get}
     */
    public get(index: number): SwatchRGB {
        return this.swatches[index] || this.swatches[clamp(index, 0, this.lastIndex)];
    }

    /**
     * {@inheritdoc Palette.closestIndexOf}
     */
    public closestIndexOf(reference: Swatch): number {
        if (this.closestIndexCache.has(reference.relativeLuminance)) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return this.closestIndexCache.get(reference.relativeLuminance)!;
        }

        let index = this.swatches.indexOf(reference as SwatchRGB);

        if (index !== -1) {
            this.closestIndexCache.set(reference.relativeLuminance, index);
            return index;
        }

        const closest = this.swatches.reduce((previous, next) =>
            Math.abs(next.relativeLuminance - reference.relativeLuminance) <
            Math.abs(previous.relativeLuminance - reference.relativeLuminance)
                ? next
                : previous
        );

        index = this.swatches.indexOf(closest);
        this.closestIndexCache.set(reference.relativeLuminance, index);

        return index;
    }

    /**
     * Create a color palette from a provided swatch
     * @param source - The source swatch to create a palette from
     * @returns
     */
    static from(source: SwatchRGB): PaletteRGB {
        return new PaletteRGBImpl(
            source,
            Object.freeze(
                new ComponentStateColorPalette({
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    baseColor: ColorRGBA64.fromObject(source)!,
                }).palette.map(x => {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    const _x = parseColorHexRGB(x.toStringHexRGB())!;
                    return SwatchRGB.create(_x.r, _x.g, _x.b);
                })
            )
        );
    }
}
