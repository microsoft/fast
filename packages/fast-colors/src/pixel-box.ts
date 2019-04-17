// tslint:disable:member-ordering
// tslint:disable:no-bitwise
// tslint:disable:prefer-for-of

import { Histogram } from "./histogram";
import { ColorRGBA64 } from "./color-rgba-64";

// higher sort priority puts the newItem closer to the start (index 0) of the list
export function insertIntoSortedList(
    list: PixelBox[],
    newItem: PixelBox,
    sortPriority: (box: PixelBox) => number
): void {
    if (list.length === 0) {
        list.push(newItem);
        return;
    }
    const newItemPriority: number = sortPriority(newItem);
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
    let newIndex: number = 0;
    for (let i: number = 0; i < list.length; i++) {
        if (newItemPriority > sortPriority(list[i])) {
            newIndex = i;
            break;
        }
    }
    list.splice(newIndex, 0, newItem);
}

export class PixelBox {
    constructor(
        globalHistogram: Histogram,
        minRed: number,
        maxRed: number,
        minGreen: number,
        maxGreen: number,
        minBlue: number,
        maxBlue: number
    ) {
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

        let redSum: number = 0;
        let greenSum: number = 0;
        let blueSum: number = 0;
        const factor: number = 1 << (8 - this.globalHistogram.signifigantBits);

        for (let r: number = minRed; r <= maxRed; r++) {
            for (let g: number = minGreen; g <= maxGreen; g++) {
                for (let b: number = minBlue; b <= maxBlue; b++) {
                    const histoValue: number = this.globalHistogram.getHistogramValue(
                        r,
                        g,
                        b
                    );
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

    public readonly globalHistogram: Histogram;
    public readonly pixelCount: number;

    public readonly minRed: number;
    public readonly maxRed: number;
    public readonly rangeRed: number;
    public readonly minGreen: number;
    public readonly maxGreen: number;
    public readonly rangeGreen: number;
    public readonly minBlue: number;
    public readonly maxBlue: number;
    public readonly rangeBlue: number;
    public readonly colorVolume: number;

    public readonly averageColor: ColorRGBA64;

    // Based on the Modified Median Cut Quantization implementation from https://github.com/DanBloomberg/leptonica/blob/master/src/colorquant2.c
    public modifiedMedianCut = (): [PixelBox | null, PixelBox | null] => {
        if (this.rangeRed === 1 && this.rangeGreen === 1 && this.rangeBlue === 1) {
            // This box is already sliced as finely as possible
            return [this, null];
        }

        enum CutAxis {
            Red,
            Green,
            Blue,
        }
        let axis: CutAxis;
        let axisRange: number;
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
        const partialSum: number[] = new Array(axisRange);
        const lookAheadSum: number[] = new Array(axisRange);

        let retLeft: PixelBox | null = null;
        let retRight: PixelBox | null = null;
        let axisTotal: number = 0;
        // This does not actually cut directly at the median, rather it finds the median then
        // cuts halfway through the larger box on either side of that median
        // The result is that small areas of color are better represented in the final output
        if (axis === CutAxis.Red) {
            // Calculate partial sums
            for (let r: number = this.minRed; r <= this.maxRed; r++) {
                let sum: number = 0;
                for (let g: number = this.minGreen; g <= this.maxGreen; g++) {
                    for (let b: number = this.minBlue; b <= this.maxBlue; b++) {
                        sum += this.globalHistogram.getHistogramValue(r, g, b);
                    }
                }
                axisTotal += sum;
                partialSum[r - this.minRed] = axisTotal;
            }
            for (let i: number = 0; i < partialSum.length; i++) {
                lookAheadSum[i] = axisTotal - partialSum[i];
            }

            // Find the cut point based on partial sums vs total
            for (let r: number = this.minRed; r <= this.maxRed; r++) {
                if (partialSum[r - this.minRed] >= axisTotal / 2) {
                    const left: number = r - this.minRed;
                    const right: number = this.maxRed - r;
                    let cut: number;
                    if (left <= right) {
                        cut = Math.min(this.maxRed - 1, Math.floor(r + right / 2));
                    } else {
                        cut = Math.max(this.minRed, Math.floor(r - 1 - left / 2));
                    }
                    // Adjust the cut point if either side has 0 pixelCount
                    while (partialSum[cut - this.minRed] <= 0 && cut < this.maxRed - 1) {
                        cut++;
                    }
                    let lookAhead: number = lookAheadSum[cut - this.minRed];
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
            for (let g: number = this.minGreen; g <= this.maxGreen; g++) {
                let sum: number = 0;
                for (let r: number = this.minRed; r <= this.maxRed; r++) {
                    for (let b: number = this.minBlue; b <= this.maxBlue; b++) {
                        sum += this.globalHistogram.getHistogramValue(r, g, b);
                    }
                }
                axisTotal += sum;
                partialSum[g - this.minGreen] = axisTotal;
            }
            for (let i: number = 0; i < partialSum.length; i++) {
                lookAheadSum[i] = axisTotal - partialSum[i];
            }

            // Find the cut point based on partial sums vs total
            for (let g: number = this.minGreen; g <= this.maxGreen; g++) {
                if (partialSum[g - this.minGreen] >= axisTotal / 2) {
                    const left: number = g - this.minGreen;
                    const right: number = this.maxGreen - g;
                    let cut: number;
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
                    let lookAhead: number = lookAheadSum[cut - this.minGreen];
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
            for (let b: number = this.minBlue; b <= this.maxBlue; b++) {
                let sum: number = 0;
                for (let r: number = this.minRed; r <= this.maxRed; r++) {
                    for (let g: number = this.minGreen; g <= this.maxGreen; g++) {
                        sum += this.globalHistogram.getHistogramValue(r, g, b);
                    }
                }
                axisTotal += sum;
                partialSum[b - this.minBlue] = axisTotal;
            }
            for (let i: number = 0; i < partialSum.length; i++) {
                lookAheadSum[i] = axisTotal - partialSum[i];
            }

            // Find the cut point based on partial sums vs total
            for (let b: number = this.minBlue; b <= this.maxBlue; b++) {
                if (partialSum[b - this.minBlue] >= axisTotal / 2) {
                    const left: number = b - this.minBlue;
                    const right: number = this.maxBlue - b;
                    let cut: number;
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
                    let lookAhead: number = lookAheadSum[cut - this.minBlue];
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
}
