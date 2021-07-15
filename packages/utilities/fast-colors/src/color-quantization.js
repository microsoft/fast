import { Histogram } from "./histogram";
import { insertIntoSortedList, PixelBox } from "./pixel-box";
function countValidBoxes(queue, isBoxValid) {
    if (isBoxValid === null) {
        return queue.length;
    }
    let retVal = 0;
    for (let i = 0; i < queue.length; i++) {
        if (isBoxValid(queue[i])) {
            retVal++;
        }
    }
    return retVal;
}
/**
 * The default quantize configuration.
 * @public
 */
export const defaultQuantizeConfig = {
    significantBits: 5,
    pixelSkipping: 5,
    targetPaletteSize: 64,
    fractionByPopulation: 0.85,
    isBoxValid: box => {
        if (box.pixelCount < 5) {
            // Screen out outlier results that aren't present in the original image
            return false;
        }
        return true;
    },
    isHistogramPixelValid: pixel => {
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
export function quantizeHistogram(histogram, config = defaultQuantizeConfig) {
    const initialBox = new PixelBox(
        histogram,
        histogram.minRed,
        histogram.maxRed,
        histogram.minGreen,
        histogram.maxGreen,
        histogram.minBlue,
        histogram.maxBlue
    );
    const queue = [initialBox];
    let count = countValidBoxes(queue, config.isBoxValid);
    // For a final palette of size targetPaletteSize, we determine the first fractionByPopulation*targetPaletteSize
    // using population as the only factor when determening sort order. For the rest of the colors the
    // sort order is population * colorVolume. This helps highly contrasting colors in a small area to show
    // up in some of the final output.
    const colorsByPopulation = Math.floor(
        config.targetPaletteSize * config.fractionByPopulation
    );
    const popSort = box => {
        return box.pixelCount;
    };
    let iterationCount = 0;
    while (iterationCount <= config.maxIterations) {
        if (queue.length > 0) {
            const currentBox = queue.shift();
            const cutBoxes = currentBox.modifiedMedianCut();
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
        const popAndVolumeSort = box => {
            return box.pixelCount * box.colorVolume;
        };
        queue.sort((a, b) => {
            const aSort = popAndVolumeSort(a);
            const bSort = popAndVolumeSort(b);
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
                const currentBox = queue.shift();
                const cutBoxes = currentBox.modifiedMedianCut();
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
    const retVal = new Array(count);
    let index = 0;
    for (let i = 0; i < queue.length; i++) {
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
export function quantize(source, config = defaultQuantizeConfig) {
    const histogram = new Histogram(
        source,
        config.significantBits,
        config.pixelSkipping,
        config.isHistogramPixelValid
    );
    return quantizeHistogram(histogram, config);
}
