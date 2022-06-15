import { PixelBlob } from "./pixel-blob.js";
import { Histogram } from "./histogram.js";
import { PixelBox } from "./pixel-box.js";
import { ColorRGBA64 } from "./color-rgba-64.js";

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
    isHistogramPixelValid:
        | ((
              pixel: number[],
              width?: number,
              height?: number,
              x?: number,
              y?: number
          ) => boolean)
        | null;
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

const sortEpsilon: number = 0.5 / 255;
/**
 * Defines a sorting order for colors to ensure consistent results accross platforms
 * It sorts by r, then b then g then a and only returns 0 if all are within 0.5/255 of each other
 * It is a compareFunction as defined for javascript Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @public
 */
export function sortCompareColorDescending(a: ColorRGBA64, b: ColorRGBA64): number {
    if (Math.abs(a.r - b.r) <= sortEpsilon) {
        if (Math.abs(a.g - b.g) <= sortEpsilon) {
            if (Math.abs(a.b - b.b) <= sortEpsilon) {
                if (Math.abs(a.a - b.a) <= sortEpsilon) {
                    return 0;
                } else {
                    if (a.a < b.a) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            } else {
                if (a.b < b.b) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else {
            if (a.g < b.g) {
                return 1;
            } else {
                return -1;
            }
        }
    } else {
        if (a.r < b.r) {
            return 1;
        } else {
            return -1;
        }
    }
}

/**
 * Defines a sorting order for pixel boxes to ensure consistent results accross platforms
 * It sorts by Count then Color then Color
 * It is a compareFunction as defined for javascript Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @public
 */
export function sortComparePixelBoxDescending(a: PixelBox, b: PixelBox): number {
    if (a.pixelCount === b.pixelCount) {
        if (a.colorVolume === b.colorVolume) {
            return sortCompareColorDescending(a.averageColor, b.averageColor);
        } else {
            if (a.colorVolume < b.colorVolume) {
                return 1;
            } else {
                return -1;
            }
        }
    } else {
        if (a.pixelCount < b.pixelCount) {
            return 1;
        } else {
            return -1;
        }
    }
}

/**
 * Defines a sorting order for pixel boxes to ensure consistent results accross platforms
 * It sorts by Count then Color only and ignores Volume
 * It is a compareFunction as defined for javascript Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @public
 */
export function sortComparePixelBoxIgnoreVolumeDescending(
    a: PixelBox,
    b: PixelBox
): number {
    if (a.pixelCount === b.pixelCount) {
        return sortCompareColorDescending(a.averageColor, b.averageColor);
    } else {
        if (a.pixelCount < b.pixelCount) {
            return 1;
        } else {
            return -1;
        }
    }
}

/**
 * Defines a sorting order for pixel boxes to ensure consistent results accross platforms
 * Sorts by Count*Color. If Count.Color is equal then defaults to sortComparePixelBoxDescending.
 * It is a compareFunction as defined for javascript Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @public
 */
export function sortComparePixelBoxCountTimesVolumeDescending(
    a: PixelBox,
    b: PixelBox
): number {
    const aSortVal: number = a.pixelCount * a.colorVolume;
    const bSortVal: number = b.pixelCount * b.colorVolume;

    if (aSortVal === bSortVal) {
        return sortComparePixelBoxDescending(a, b);
    } else {
        if (aSortVal < bSortVal) {
            return 1;
        } else {
            return -1;
        }
    }
}

/**
 * Defines a sorting order for quantized colors to ensure consistent results accross platforms
 * It sorts by Count then Volume then Color
 * It is a compareFunction as defined for javascript Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @public
 */
export function sortCompareQuantizedColorDescending(
    a: QuantizedColor,
    b: QuantizedColor
): number {
    if (a.pixelCount === b.pixelCount) {
        if (a.colorVolume === b.colorVolume) {
            return sortCompareColorDescending(a.color, b.color);
        } else if (a.colorVolume < b.colorVolume) {
            return 1;
        }
        return -1;
    }
    if (a.pixelCount < b.pixelCount) {
        return 1;
    } else {
        return -1;
    }
}

/**
 * Defines a sorting order for quantized colors to ensure consistent results accross platforms
 * It sorts by Count then Color and ignores Volume
 * It is a compareFunction as defined for javascript Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 * @public
 */
export function sortCompareQuantizedColorIgnoreVolumeDescending(
    a: QuantizedColor,
    b: QuantizedColor
): number {
    if (a.pixelCount === b.pixelCount) {
        return sortCompareColorDescending(a.color, b.color);
    }
    if (a.pixelCount < b.pixelCount) {
        return 1;
    } else {
        return -1;
    }
}

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

    let iterationCount: number = 0;
    while (iterationCount <= config.maxIterations) {
        if (queue.length > 0) {
            if (queue.length > 1) {
                queue.sort(sortComparePixelBoxDescending);
            }
            const currentBox: PixelBox = queue.shift()!;

            const cutBoxes: [
                PixelBox | null,
                PixelBox | null
            ] = currentBox.modifiedMedianCut();
            if (cutBoxes[0] !== null) {
                queue.push(cutBoxes[0]);
            }
            if (cutBoxes[1] !== null) {
                queue.push(cutBoxes[1]);
            }
        }

        count = countValidBoxes(queue, config.isBoxValid);
        if (count >= colorsByPopulation || queue.length <= 1) {
            break;
        }

        iterationCount++;
    }

    if (count < config.targetPaletteSize) {
        iterationCount = 0;
        while (iterationCount <= config.maxIterations) {
            if (queue.length > 0) {
                queue.sort(sortComparePixelBoxCountTimesVolumeDescending);

                const currentBox: PixelBox = queue.shift()!;

                const cutBoxes: [
                    PixelBox | null,
                    PixelBox | null
                ] = currentBox.modifiedMedianCut();
                if (cutBoxes[0] !== null) {
                    queue.push(cutBoxes[0]);
                }
                if (cutBoxes[1] !== null) {
                    queue.push(cutBoxes[1]);
                }
            }

            count = countValidBoxes(queue, config.isBoxValid);
            if (count >= config.targetPaletteSize || queue.length <= 1) {
                break;
            }

            iterationCount++;
        }
    }

    queue.sort(sortComparePixelBoxDescending);

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
