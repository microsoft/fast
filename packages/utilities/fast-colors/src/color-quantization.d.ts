import { PixelBlob } from "./pixel-blob";
import { Histogram } from "./histogram";
import { PixelBox } from "./pixel-box";
import { ColorRGBA64 } from "./color-rgba-64";
/**
 * A quantized color
 * @public
 */
export interface QuantizedColor {
    color: ColorRGBA64;
    pixelCount: number;
    colorVolume: number;
}
/**
 * A quantize configuration object.
 * @public
 */
export interface QuantizeConfig {
    /**
     * Must be in the range [1,8]. Memory use increases as 4*2^(3*significantBits). Setting significantBits to 8 requires a 64 megabyte histogram.
     */
    significantBits: number;
    /**
     * Lowering this value increases the CPU load but includes more pixels in the calculation.
     */
    pixelSkipping: number;
    /**
     * Desired output palette size. Actual output may vary in edge cases such as images with very few colors.
     */
    targetPaletteSize: number;
    /**
     * For a final palette of size targetPaletteSize, we determine the first fractionByPopulation*targetPaletteSize using population as the only factor when determening sort order. For the rest of the colors the sort order is population*colorVolume. This helps highly contrasting colors in a small area to show up in some of the final output.
     */
    fractionByPopulation: number;
    /**
     * This predicate can be used to screen out undesirable colors from the final output. EG: excluding colors with a pixelCount below a min value.
     */
    isBoxValid: ((box: PixelBox) => boolean) | null;
    /**
     * This predicate can be used to exlude pixels from the histogram. It is passed numbers in the range [0,255] in rgba order. EG: Excluding colors too close to pure white or ones which are transparent.
     */
    isHistogramPixelValid: ((pixel: number[]) => boolean) | null;
    /**
     * If the quantization process goes on for more iterations than maxIterations it is aborted and the current results are returned. Only likely to happen in extreme edge cases with strange input.
     */
    maxIterations: number;
}
/**
 * The default quantize configuration.
 * @public
 */
export declare const defaultQuantizeConfig: QuantizeConfig;
/**
 * The data in the color histogram is reduced down to a small set of colors.
 * It can be useful to create the Histogram manually in cases where one wants to remove or alter the colors in it
 * or to re-use it in order to quantize multiple times with different config settings.
 * Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
 *
 * @public
 */
export declare function quantizeHistogram(
    histogram: Histogram,
    config?: QuantizeConfig
): QuantizedColor[];
/**
 * The image stored in the source PixelBlob is reduced down to a small set of colors.
 * Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
 *
 * @public
 */
export declare function quantize(
    source: PixelBlob,
    config?: QuantizeConfig
): QuantizedColor[];
