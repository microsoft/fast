import {
    clamp,
    ComponentStateColorPalette,
    parseColorHexRGB,
} from "@microsoft/fast-colors";
import { Swatch, SwatchRGB } from "./swatch";
import { directionByMode } from "./utilities/direction-by-mode";
import { contrast } from "./utilities/relative-luminance";

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
    colorContrast(reference: Swatch, contrast: number): Swatch;

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
    private reversedSwatches: ReadonlyArray<SwatchRGB>;
    constructor(source: SwatchRGB) {
        this.swatches = Object.freeze(
            new ComponentStateColorPalette({
                baseColor: source,
            }).palette
                .map(x => parseColorHexRGB(x.toStringHexRGB())!)
                .map(x => new SwatchRGB(x.r, x.g, x.b))
        );

        this.reversedSwatches = Object.freeze(this.swatches.concat([]).reverse());
        this.lastIndex = this.swatches.length - 1;
    }

    public colorContrast(reference: Swatch, contrastTarget: number): SwatchRGB {
        const referenceIndex = this.closestIndexOf(reference);
        let startIndex: number;
        let source: ReadonlyArray<SwatchRGB>;
        const direction = directionByMode(reference);
        const condition = (value: SwatchRGB) =>
            contrast(reference, value) >= contrastTarget;

        if (direction === -1) {
            startIndex = this.lastIndex - referenceIndex;
            source = this.reversedSwatches;
        } else {
            startIndex = referenceIndex;
            source = this.swatches;
        }

        return binarySearch(source, condition, startIndex, this.lastIndex);
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
}

function binarySearch<T>(
    valuesToSearch: T[] | ReadonlyArray<T>,
    searchCondition: (value: T) => boolean,
    startIndex: number = 0,
    endIndex: number = valuesToSearch.length - 1
): T {
    if (endIndex === startIndex) {
        return valuesToSearch[startIndex];
    }

    const middleIndex: number = Math.floor((endIndex - startIndex) / 2) + startIndex;

    // Check to see if this passes on the item in the center of the array
    // if it does check the previous values
    return searchCondition(valuesToSearch[middleIndex])
        ? binarySearch(
              valuesToSearch,
              searchCondition,
              startIndex,
              middleIndex // include this index because it passed the search condition
          )
        : binarySearch(
              valuesToSearch,
              searchCondition,
              middleIndex + 1, // exclude this index because it failed the search condition
              endIndex
          );
}
