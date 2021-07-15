import { ColorRGBA64 } from "./color-rgba-64";
/**
 * Adds a newItem to an already sorted list without needing to do a full re-sort.
 * Higher sort priority puts the newItem closer to the start (index 0) of the list.
 *
 * @public
 */
export function insertIntoSortedList(list, newItem, sortPriority) {
    if (list.length === 0) {
        list.push(newItem);
        return;
    }
    const newItemPriority = sortPriority(newItem);
    // The new item being either first or last happens often enough that it is worth special casing
    // In cases of a tie the new item should be inserted after existing items of the same priority
    if (newItemPriority > sortPriority(list[0])) {
        list.unshift(newItem);
        return;
    }
    if (newItemPriority <= sortPriority(list[list.length - 1])) {
        list.push(newItem);
        return;
    }
    let newIndex = 0;
    for (let i = 0; i < list.length; i++) {
        if (newItemPriority > sortPriority(list[i])) {
            newIndex = i;
            break;
        }
    }
    list.splice(newIndex, 0, newItem);
}
/**
 * Represents a range of colors in RGB color space.
 *
 * @public
 */
export class PixelBox {
    constructor(globalHistogram, minRed, maxRed, minGreen, maxGreen, minBlue, maxBlue) {
        /**
         * Attempts to divide the range of colors represented by this PixelBox into two smaller PixelBox objects.
         * This does not actually cut directly at the median, rather it finds the median then cuts halfway through the larger box on either side of that median. The result is that small areas of color are better represented in the final output.
         * Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
         */
        this.modifiedMedianCut = () => {
            if (this.rangeRed === 1 && this.rangeGreen === 1 && this.rangeBlue === 1) {
                // This box is already sliced as finely as possible
                return [this, null];
            }
            let CutAxis;
            (function (CutAxis) {
                CutAxis[(CutAxis["Red"] = 0)] = "Red";
                CutAxis[(CutAxis["Green"] = 1)] = "Green";
                CutAxis[(CutAxis["Blue"] = 2)] = "Blue";
            })(CutAxis || (CutAxis = {}));
            let axis;
            let axisRange;
            if (this.rangeRed >= this.rangeGreen && this.rangeRed >= this.rangeBlue) {
                axis = CutAxis.Red;
                axisRange = this.rangeRed;
            } else if (
                this.rangeGreen >= this.rangeRed &&
                this.rangeGreen >= this.rangeBlue
            ) {
                axis = CutAxis.Green;
                axisRange = this.rangeGreen;
            } else {
                axis = CutAxis.Blue;
                axisRange = this.rangeBlue;
            }
            const partialSum = new Array(axisRange);
            const lookAheadSum = new Array(axisRange);
            let retLeft = null;
            let retRight = null;
            let axisTotal = 0;
            // This does not actually cut directly at the median, rather it finds the median then
            // cuts halfway through the larger box on either side of that median
            // The result is that small areas of color are better represented in the final output
            if (axis === CutAxis.Red) {
                // Calculate partial sums
                for (let r = this.minRed; r <= this.maxRed; r++) {
                    let sum = 0;
                    for (let g = this.minGreen; g <= this.maxGreen; g++) {
                        for (let b = this.minBlue; b <= this.maxBlue; b++) {
                            sum += this.globalHistogram.getHistogramValue(r, g, b);
                        }
                    }
                    axisTotal += sum;
                    partialSum[r - this.minRed] = axisTotal;
                }
                for (let i = 0; i < partialSum.length; i++) {
                    lookAheadSum[i] = axisTotal - partialSum[i];
                }
                // Find the cut point based on partial sums vs total
                for (let r = this.minRed; r <= this.maxRed; r++) {
                    if (partialSum[r - this.minRed] >= axisTotal / 2) {
                        const left = r - this.minRed;
                        const right = this.maxRed - r;
                        let cut;
                        if (left <= right) {
                            cut = Math.min(this.maxRed - 1, Math.floor(r + right / 2));
                        } else {
                            cut = Math.max(this.minRed, Math.floor(r - 1 - left / 2));
                        }
                        // Adjust the cut point if either side has 0 pixelCount
                        while (
                            partialSum[cut - this.minRed] <= 0 &&
                            cut < this.maxRed - 1
                        ) {
                            cut++;
                        }
                        let lookAhead = lookAheadSum[cut - this.minRed];
                        while (
                            lookAhead === 0 &&
                            cut > this.minRed &&
                            partialSum[cut - this.minRed - 1] !== 0
                        ) {
                            cut--;
                            lookAhead = lookAheadSum[cut - this.minRed];
                        }
                        retLeft = new PixelBox(
                            this.globalHistogram,
                            this.minRed,
                            cut,
                            this.minGreen,
                            this.maxGreen,
                            this.minBlue,
                            this.maxBlue
                        );
                        retRight = new PixelBox(
                            this.globalHistogram,
                            cut + 1,
                            this.maxRed,
                            this.minGreen,
                            this.maxGreen,
                            this.minBlue,
                            this.maxBlue
                        );
                        break;
                    }
                }
            } else if (axis === CutAxis.Green) {
                // Calculate partial sums
                for (let g = this.minGreen; g <= this.maxGreen; g++) {
                    let sum = 0;
                    for (let r = this.minRed; r <= this.maxRed; r++) {
                        for (let b = this.minBlue; b <= this.maxBlue; b++) {
                            sum += this.globalHistogram.getHistogramValue(r, g, b);
                        }
                    }
                    axisTotal += sum;
                    partialSum[g - this.minGreen] = axisTotal;
                }
                for (let i = 0; i < partialSum.length; i++) {
                    lookAheadSum[i] = axisTotal - partialSum[i];
                }
                // Find the cut point based on partial sums vs total
                for (let g = this.minGreen; g <= this.maxGreen; g++) {
                    if (partialSum[g - this.minGreen] >= axisTotal / 2) {
                        const left = g - this.minGreen;
                        const right = this.maxGreen - g;
                        let cut;
                        if (left <= right) {
                            cut = Math.min(this.maxGreen - 1, Math.floor(g + right / 2));
                        } else {
                            cut = Math.max(this.minGreen, Math.floor(g - 1 - left / 2));
                        }
                        // Adjust the cut point if either side has 0 pixelCount
                        while (
                            partialSum[cut - this.minGreen] <= 0 &&
                            cut < this.maxGreen - 1
                        ) {
                            cut++;
                        }
                        let lookAhead = lookAheadSum[cut - this.minGreen];
                        while (
                            lookAhead === 0 &&
                            cut > this.minGreen &&
                            partialSum[cut - this.minGreen - 1] !== 0
                        ) {
                            cut--;
                            lookAhead = lookAheadSum[cut - this.minGreen];
                        }
                        retLeft = new PixelBox(
                            this.globalHistogram,
                            this.minRed,
                            this.maxRed,
                            this.minGreen,
                            cut,
                            this.minBlue,
                            this.maxBlue
                        );
                        retRight = new PixelBox(
                            this.globalHistogram,
                            this.minRed,
                            this.maxRed,
                            cut + 1,
                            this.maxGreen,
                            this.minBlue,
                            this.maxBlue
                        );
                        break;
                    }
                }
            } else {
                // Calculate partial sums
                for (let b = this.minBlue; b <= this.maxBlue; b++) {
                    let sum = 0;
                    for (let r = this.minRed; r <= this.maxRed; r++) {
                        for (let g = this.minGreen; g <= this.maxGreen; g++) {
                            sum += this.globalHistogram.getHistogramValue(r, g, b);
                        }
                    }
                    axisTotal += sum;
                    partialSum[b - this.minBlue] = axisTotal;
                }
                for (let i = 0; i < partialSum.length; i++) {
                    lookAheadSum[i] = axisTotal - partialSum[i];
                }
                // Find the cut point based on partial sums vs total
                for (let b = this.minBlue; b <= this.maxBlue; b++) {
                    if (partialSum[b - this.minBlue] >= axisTotal / 2) {
                        const left = b - this.minBlue;
                        const right = this.maxBlue - b;
                        let cut;
                        if (left <= right) {
                            cut = Math.min(this.maxBlue - 1, Math.floor(b + right / 2));
                        } else {
                            cut = Math.max(this.minBlue, Math.floor(b - 1 - left / 2));
                        }
                        // Adjust the cut point if either side has 0 pixelCount
                        while (
                            partialSum[cut - this.minBlue] <= 0 &&
                            cut < this.maxBlue - 1
                        ) {
                            cut++;
                        }
                        let lookAhead = lookAheadSum[cut - this.minBlue];
                        while (
                            lookAhead === 0 &&
                            cut > this.minBlue &&
                            partialSum[cut - this.minBlue - 1] !== 0
                        ) {
                            cut--;
                            lookAhead = lookAheadSum[cut - this.minBlue];
                        }
                        retLeft = new PixelBox(
                            this.globalHistogram,
                            this.minRed,
                            this.maxRed,
                            this.minGreen,
                            this.maxGreen,
                            this.minBlue,
                            cut
                        );
                        retRight = new PixelBox(
                            this.globalHistogram,
                            this.minRed,
                            this.maxRed,
                            this.minGreen,
                            this.maxGreen,
                            cut + 1,
                            this.maxBlue
                        );
                        break;
                    }
                }
            }
            return [retLeft, retRight];
        };
        this.pixelCount = 0;
        this.globalHistogram = globalHistogram;
        this.minRed = minRed;
        this.maxRed = maxRed;
        this.minGreen = minGreen;
        this.maxGreen = maxGreen;
        this.minBlue = minBlue;
        this.maxBlue = maxBlue;
        this.rangeRed = this.maxRed - this.minRed + 1;
        this.rangeGreen = this.maxGreen - this.minGreen + 1;
        this.rangeBlue = this.maxBlue - this.minBlue + 1;
        this.colorVolume = this.rangeRed * this.rangeGreen * this.rangeBlue;
        let redSum = 0;
        let greenSum = 0;
        let blueSum = 0;
        const factor = 1 << (8 - this.globalHistogram.significantBits);
        for (let r = minRed; r <= maxRed; r++) {
            for (let g = minGreen; g <= maxGreen; g++) {
                for (let b = minBlue; b <= maxBlue; b++) {
                    const histoValue = this.globalHistogram.getHistogramValue(r, g, b);
                    this.pixelCount += histoValue;
                    redSum += histoValue * (r + 0.5) * factor;
                    greenSum += histoValue * (g + 0.5) * factor;
                    blueSum += histoValue * (b + 0.5) * factor;
                }
            }
        }
        if (this.pixelCount === 0) {
            this.averageColor = new ColorRGBA64(
                (factor * ((minRed + maxRed + 1) / 2)) / 255,
                (factor * ((minGreen + maxGreen + 1) / 2)) / 255,
                (factor * ((minBlue + maxBlue + 1) / 2)) / 255,
                1
            );
        } else {
            this.averageColor = new ColorRGBA64(
                redSum / this.pixelCount / 255,
                greenSum / this.pixelCount / 255,
                blueSum / this.pixelCount / 255,
                1
            );
        }
    }
}
