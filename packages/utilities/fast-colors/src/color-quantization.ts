import { PixelBlob } from "./pixel-blob";
import { Histogram } from "./histogram";
import { insertIntoSortedList, PixelBox } from "./pixel-box";
import { ColorRGBA64 } from "./color-rgba-64";

function countValidBoxes(
    queue: PixelBox[],
    isBoxValid: ((box: PixelBox) => boolean) | null
): number {
    if (isBoxValid === null) {
        return queue.length;
    }

    let retVal: number = 0;

    for (let i: number = 0; i < queue.length; i++) {
        if (isBoxValid(queue[i])) {
            retVal++;
        }
    }

    return retVal;
}

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
export const defaultQuantizeConfig: QuantizeConfig = {
    significantBits: 5,
    pixelSkipping: 5,
    targetPaletteSize: 64,
    fractionByPopulation: 0.85,
    isBoxValid: (box: PixelBox): boolean => {
        if (box.pixelCount < 5) {
            // Screen out outlier results that aren't present in the original image
            return false;
        }
        return true;
    },
    isHistogramPixelValid: (pixel: number[]): boolean => {
        if (pixel[3] < 128) {
            // Ignore pixels that are too transparent
            return false;
        }
        return true;
    },
    maxIterations: 1000,
};

/**
 * The data in the color histogram is reduced down to a small set of colors.
 * It can be useful to create the Histogram manually in cases where one wants to remove or alter the colors in it
 * or to re-use it in order to quantize multiple times with different config settings.
 * Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
 *
 * @public
 */
export function quantizeHistogram(
    histogram: Histogram,
    config: QuantizeConfig = defaultQuantizeConfig
): QuantizedColor[] {
    const initialBox: PixelBox = new PixelBox(
        histogram,
        histogram.minRed,
        histogram.maxRed,
        histogram.minGreen,
        histogram.maxGreen,
        histogram.minBlue,
        histogram.maxBlue
    );

    const queue: PixelBox[] = [initialBox];
    let count: number = countValidBoxes(queue, config.isBoxValid);

    // For a final palette of size targetPaletteSize, we determine the first fractionByPopulation*targetPaletteSize
    // using population as the only factor when determening sort order. For the rest of the colors the
    // sort order is population * colorVolume. This helps highly contrasting colors in a small area to show
    // up in some of the final output.
    const colorsByPopulation: number = Math.floor(
        config.targetPaletteSize * config.fractionByPopulation
    );
    const popSort: (box: PixelBox) => number = (box: PixelBox): number => {
        return box.pixelCount;
    };

    let iterationCount: number = 0;
    while (iterationCount <= config.maxIterations) {
        if (queue.length > 0) {
            const currentBox: PixelBox = queue.shift()!;

            const cutBoxes: [
                PixelBox | null,
                PixelBox | null
            ] = currentBox.modifiedMedianCut();

            if (cutBoxes[0] !== null) {
                insertIntoSortedList(queue, cutBoxes[0], popSort);
            }
            if (cutBoxes[1] !== null) {
                insertIntoSortedList(queue, cutBoxes[1], popSort);
            }
        }

        count = countValidBoxes(queue, config.isBoxValid);
        if (count >= colorsByPopulation || queue.length <= 1) {
            break;
        }

        iterationCount++;
    }

    if (count < config.targetPaletteSize) {
        const popAndVolumeSort: (box: PixelBox) => number = (box: PixelBox): number => {
            return box.pixelCount * box.colorVolume;
        };

        queue.sort((a: PixelBox, b: PixelBox) => {
            const aSort: number = popAndVolumeSort(a);
            const bSort: number = popAndVolumeSort(b);
            if (aSort === bSort) {
                return 0;
            } else if (aSort > bSort) {
                return -1;
            }
            return 1;
        });

        iterationCount = 0;
        while (iterationCount <= config.maxIterations) {
            if (queue.length > 0) {
                const currentBox: PixelBox = queue.shift()!;

                const cutBoxes: [
                    PixelBox | null,
                    PixelBox | null
                ] = currentBox.modifiedMedianCut();

                if (cutBoxes[0] !== null) {
                    insertIntoSortedList(queue, cutBoxes[0], popAndVolumeSort);
                }
                if (cutBoxes[1] !== null) {
                    insertIntoSortedList(queue, cutBoxes[1], popAndVolumeSort);
                }
            }

            count = countValidBoxes(queue, config.isBoxValid);
            if (count >= config.targetPaletteSize || queue.length <= 1) {
                break;
            }

            iterationCount++;
        }
    }

    const retVal: QuantizedColor[] = new Array(count);
    let index: number = 0;
    for (let i: number = 0; i < queue.length; i++) {
        if (!config.isBoxValid || config.isBoxValid(queue[i])) {
            retVal[index] = {
                color: queue[i].averageColor,
                pixelCount: queue[i].pixelCount,
                colorVolume: queue[i].colorVolume,
            };
            index++;
        }
    }

    return retVal;
}

/**
 * The image stored in the source PixelBlob is reduced down to a small set of colors.
 * Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
 *
 * @public
 */
export function quantize(
    source: PixelBlob,
    config: QuantizeConfig = defaultQuantizeConfig
): QuantizedColor[] {
    const histogram: Histogram = new Histogram(
        source,
        config.significantBits,
        config.pixelSkipping,
        config.isHistogramPixelValid
    );
    return quantizeHistogram(histogram, config);
}
