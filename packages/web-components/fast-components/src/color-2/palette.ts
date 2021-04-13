import { clamp, ComponentStateColorPalette } from "@microsoft/fast-colors";
import { Swatch, SwatchRGB } from "./swatch";

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
    getByContrast(reference: Swatch, contrast: number): Swatch;

    /**
     * Returns the index of the palette that most closely matches
     * the relativeLuminance of the provided swatch
     */
    closestIndexOf(reference: Swatch): number;

    /**
     * Gets a swatch by index. Index is clamped to the limits
     * of the palette so a Swatch will always be returned.
     */
    get(index: number): Swatch;
}

export class PaletteRGB implements Palette<SwatchRGB> {
    public readonly source: SwatchRGB;
    public readonly swatches: ReadonlyArray<SwatchRGB>;
    private lastIndex: number;
    constructor(source: SwatchRGB) {
        this.swatches = Object.freeze(
            new ComponentStateColorPalette({
                baseColor: source,
            }).palette.map(x => new SwatchRGB(x.r, x.g, x.b))
        );
        this.lastIndex = this.swatches.length - 1;
    }

    public getByContrast(reference: Swatch, contrast: number): SwatchRGB {
        return this.source;
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

        const closest = this.swatches.reduce((previous, next) => {
            // If the difference between the next and the reference is less
            // than previous, return next. Else return previous
            return Math.abs(next.relativeLuminance - reference.relativeLuminance) <
                Math.abs(previous.relativeLuminance - reference.relativeLuminance)
                ? next
                : previous;
        });

        return this.swatches.indexOf(closest);
    }
}
