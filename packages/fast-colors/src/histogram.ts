// tslint:disable:member-ordering
// tslint:disable:no-bitwise
import { PixelBlob } from "./pixel-blob";

// The memory needed for the histogram increases dramaticially if signifigantBits is increased
// It needs a buffer which is 4*2^(3*signifigantBits) in size
// EG: for 5 signifigant bits the histogram is 128K while for 8 it is 64 megs.
// CPU time increases linearly as pixelSkipping is reduced
// Pixels with an alpha value less than minAlpha are ignored
// If the image source has more than 2^32 pixels (eg: a square image 65536x65536 in size) of the same color this code will break

export class Histogram {
    constructor(
        source: PixelBlob,
        signifigantBits: number = 5,
        pixelSkipping: number = 5,
        isHistoPixelValid: ((pixel: number[]) => boolean) | null = null
    ) {
        if (signifigantBits < 1 || signifigantBits > 8) {
            throw new Error("signifigantBits must be in the range [1,8]");
        }
        if (pixelSkipping < 0) {
            throw new Error("pixelSkipping must be >= 0");
        }

        this.signifigantBits = signifigantBits;
        const sigShift: number = 8 - this.signifigantBits;
        this.minRed = 255 >>> sigShift;
        this.maxRed = 0;
        this.minGreen = 255 >>> sigShift;
        this.maxGreen = 0;
        this.minBlue = 255 >>> sigShift;
        this.maxBlue = 0;

        const histoSize: number = 1 << (signifigantBits * 3);
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
                if (isHistoPixelValid !== null) {
                    if (!isHistoPixelValid(rgba)) {
                        continue;
                    }
                }

                // Shift the pixel data into the range determined by signifigantBits
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

    public readonly signifigantBits: number;
    public readonly total: number;
    public readonly minRed: number;
    public readonly maxRed: number;
    public readonly minGreen: number;
    public readonly maxGreen: number;
    public readonly minBlue: number;
    public readonly maxBlue: number;

    public getHistogramIndex = (r: number, g: number, b: number): number => {
        const index: number =
            (r << (2 * this.signifigantBits)) + (g << this.signifigantBits) + b;
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
