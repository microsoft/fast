// tslint:disable:member-ordering
// tslint:disable:no-bitwise
import { PixelBlob } from "./pixel-blob";

/**
 * For each possible color, this counts how many pixels in the source image match that color.
 * If signifigantBits is less tahn 8, each channel (eg: red, green, blue) in each color is reduced to fit in significantBits. So for the default value of 5 significantBits colors are reduced from 8 bits per channel (0-255) to 5 (0-31). Colors that were previously distinct get combined together.
 * If the image source has more than 2^32 pixels (eg: a square image 65536x65536 in size) of the same color this code will break.
 */
export class Histogram {
    /**
     * @param source
     * @param significantBits The memory needed for the histogram increases dramaticially if significantBits is increased. It needs a buffer which is 4*2^(3*significantBits) in size. EG: for 5 significant bits the histogram is 128K while for 8 it is 64 megs.
     * @param pixelSkipping CPU time increases linearly as pixelSkipping is reduced.
     * @param isHistogramPixelValid isHistogramPixelValid is an optional predicate which can screen out unwanted pixels from the source data. EG: ignoring transparent pixels.
     */
    constructor(
        source: PixelBlob,
        significantBits: number = 5,
        pixelSkipping: number = 5,
        isHistogramPixelValid: ((pixel: number[]) => boolean) | null = null
    ) {
        if (significantBits < 1 || significantBits > 8) {
            throw new Error("significantBits must be in the range [1,8]");
        }
        if (pixelSkipping < 0) {
            throw new Error("pixelSkipping must be >= 0");
        }

        this.significantBits = significantBits;
        const sigShift: number = 8 - this.significantBits;
        this.minRed = 255 >>> sigShift;
        this.maxRed = 0;
        this.minGreen = 255 >>> sigShift;
        this.maxGreen = 0;
        this.minBlue = 255 >>> sigShift;
        this.maxBlue = 0;

        const histoSize: number = 1 << (significantBits * 3);
        this.data = new Uint32Array(histoSize);
        this.data.fill(0);

        this.total = 0;
        let pixelIndex: number = 0;
        for (let y: number = 0; y < source.height; y++) {
            for (let x: number = 0; x < source.width; x++) {
                if (pixelSkipping > 0 && pixelIndex++ % pixelSkipping !== 0) {
                    continue;
                }
                const rgba: number[] = source.getPixelRGBA(x, y);
                if (isHistogramPixelValid !== null) {
                    if (!isHistogramPixelValid(rgba)) {
                        continue;
                    }
                }

                // Shift the pixel data into the range determined by significantBits
                // after checking minAlpha the alpha data is no longer needed
                rgba[0] = rgba[0] >>> sigShift;
                rgba[1] = rgba[1] >>> sigShift;
                rgba[2] = rgba[2] >>> sigShift;

                this.minRed = Math.min(rgba[0], this.minRed);
                this.maxRed = Math.max(rgba[0], this.maxRed);
                this.minGreen = Math.min(rgba[1], this.minGreen);
                this.maxGreen = Math.max(rgba[1], this.maxGreen);
                this.minBlue = Math.min(rgba[2], this.minBlue);
                this.maxBlue = Math.max(rgba[2], this.maxBlue);

                const histoIndex: number = this.getHistogramIndex(
                    rgba[0],
                    rgba[1],
                    rgba[2]
                );
                this.data[histoIndex] += 1;
                this.total++;
            }
        }
    }

    public readonly data: Uint32Array;

    public readonly significantBits: number;
    public readonly total: number;
    public readonly minRed: number;
    public readonly maxRed: number;
    public readonly minGreen: number;
    public readonly maxGreen: number;
    public readonly minBlue: number;
    public readonly maxBlue: number;

    public getHistogramIndex = (r: number, g: number, b: number): number => {
        const index: number =
            (r << (2 * this.significantBits)) + (g << this.significantBits) + b;
        if (index >= this.data.length) {
            throw new Error("RGB value is outside the bounds of the histogram");
        }
        return index;
    };

    public getHistogramValue = (r: number, g: number, b: number): number => {
        return this.data[this.getHistogramIndex(r, g, b)];
    };

    public setHistogramValue = (value: number, r: number, g: number, b: number): void => {
        this.data[this.getHistogramIndex(r, g, b)] = value;
    };
}
