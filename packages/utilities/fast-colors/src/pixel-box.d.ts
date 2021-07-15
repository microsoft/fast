import { Histogram } from "./histogram";
import { ColorRGBA64 } from "./color-rgba-64";
/**
 * Adds a newItem to an already sorted list without needing to do a full re-sort.
 * Higher sort priority puts the newItem closer to the start (index 0) of the list.
 *
 * @public
 */
export declare function insertIntoSortedList(
    list: PixelBox[],
    newItem: PixelBox,
    sortPriority: (box: PixelBox) => number
): void;
/**
 * Represents a range of colors in RGB color space.
 *
 * @public
 */
export declare class PixelBox {
    constructor(
        globalHistogram: Histogram,
        minRed: number,
        maxRed: number,
        minGreen: number,
        maxGreen: number,
        minBlue: number,
        maxBlue: number
    );
    readonly globalHistogram: Histogram;
    readonly pixelCount: number;
    readonly minRed: number;
    readonly maxRed: number;
    readonly rangeRed: number;
    readonly minGreen: number;
    readonly maxGreen: number;
    readonly rangeGreen: number;
    readonly minBlue: number;
    readonly maxBlue: number;
    readonly rangeBlue: number;
    readonly colorVolume: number;
    readonly averageColor: ColorRGBA64;
    /**
     * Attempts to divide the range of colors represented by this PixelBox into two smaller PixelBox objects.
     * This does not actually cut directly at the median, rather it finds the median then cuts halfway through the larger box on either side of that median. The result is that small areas of color are better represented in the final output.
     * Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
     */
    modifiedMedianCut: () => [PixelBox | null, PixelBox | null];
}
