import { PixelBlob } from "./pixel-blob";
/**
 * For each possible color, this counts how many pixels in the source image match that color.
 * If signifigantBits is less than 8, each channel (eg: red, green, blue) in each color is reduced to fit in significantBits. So for the default value of 5 significantBits colors are reduced from 8 bits per channel (0-255) to 5 (0-31). Colors that were previously distinct get combined together.
 * If the image source has more than 2^32 pixels (eg: a square image 65536x65536 in size) of the same color this code will break.
 *
 * @public
 */
export declare class Histogram {
    /**
     * @param source - the source pixel data.
     * @param significantBits - The memory needed for the histogram increases dramatically if significantBits is increased. It needs a buffer which is 4*2^(3*significantBits) in size. EG: for 5 significant bits the histogram is 128K while for 8 it is 64 megs.
     * @param pixelSkipping - CPU time increases linearly as pixelSkipping is reduced.
     * @param isHistogramPixelValid - isHistogramPixelValid is an optional predicate which can screen out unwanted pixels from the source data. EG: ignoring transparent pixels.
     */
    constructor(
        source: PixelBlob,
        significantBits?: number,
        pixelSkipping?: number,
        isHistogramPixelValid?: ((pixel: number[]) => boolean) | null
    );
    readonly data: Uint32Array;
    readonly significantBits: number;
    readonly total: number;
    readonly minRed: number;
    readonly maxRed: number;
    readonly minGreen: number;
    readonly maxGreen: number;
    readonly minBlue: number;
    readonly maxBlue: number;
    getHistogramIndex: (r: number, g: number, b: number) => number;
    getHistogramValue: (r: number, g: number, b: number) => number;
    setHistogramValue: (value: number, r: number, g: number, b: number) => void;
}
