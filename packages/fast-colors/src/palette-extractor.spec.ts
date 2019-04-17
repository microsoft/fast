// tslint:disable:prefer-for-of
import { ArrayPixelBlob } from "./array-pixel-blob";
import { quantize, QuantizedColor } from "./color-quantization";
import { extractPalette, PaletteEntry } from "./palette-extractor";
import { test200ImageData } from "../__test-images__/test200";
import { testGrey200ImageData } from "../__test-images__/testGrey200";

describe("Extracting a palette from a set of colors", (): void => {
    test("Extract palette with default settings", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const colors: QuantizedColor[] = quantize(pixels);
        const results: PaletteEntry[] = extractPalette(colors);

        expect(results.length).toBe(6);
        expect(results[0].found).toBe(true);
        expect(results[0].color!.color.toStringHexRGB()).toBe("#e36a27");
        expect(results[0].color!.pixelCount).toBe(19);
        expect(results[0].color!.colorVolume).toBe(396);
        expect(results[1].found).toBe(true);
        expect(results[1].color!.color.toStringHexRGB()).toBe("#fba078");
        expect(results[1].color!.pixelCount).toBe(41);
        expect(results[1].color!.colorVolume).toBe(72);
        expect(results[2].found).toBe(true);
        expect(results[2].color!.color.toStringHexRGB()).toBe("#094b58");
        expect(results[2].color!.pixelCount).toBe(271);
        expect(results[2].color!.colorVolume).toBe(80);
        expect(results[3].found).toBe(true);
        expect(results[3].color!.color.toStringHexRGB()).toBe("#a0635b");
        expect(results[3].color!.pixelCount).toBe(89);
        expect(results[3].color!.colorVolume).toBe(72);
        expect(results[4].found).toBe(true);
        expect(results[4].color!.color.toStringHexRGB()).toBe("#b57a76");
        expect(results[4].color!.pixelCount).toBe(40);
        expect(results[4].color!.colorVolume).toBe(88);
        expect(results[5].found).toBe(true);
        expect(results[5].color!.color.toStringHexRGB()).toBe("#35241c");
        expect(results[5].color!.pixelCount).toBe(17);
        expect(results[5].color!.colorVolume).toBe(84);
    });

    test("Extract palette with default settings from greyscale image", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(testGrey200ImageData, 200, 125);
        const colors: QuantizedColor[] = quantize(pixels);
        const results: PaletteEntry[] = extractPalette(colors);

        expect(results.length).toBe(6);
        expect(results[0].found).toBe(false);
        expect(results[1].found).toBe(false);
        expect(results[2].found).toBe(false);
        expect(results[3].found).toBe(true);
        expect(results[3].color!.color.toStringHexRGB()).toBe("#7c7c7c");
        expect(results[3].color!.pixelCount).toBe(102);
        expect(results[3].color!.colorVolume).toBe(1);
        expect(results[4].found).toBe(true);
        expect(results[4].color!.color.toStringHexRGB()).toBe("#bdbdbd");
        expect(results[4].color!.pixelCount).toBe(9);
        expect(results[4].color!.colorVolume).toBe(42);
        expect(results[5].found).toBe(true);
        expect(results[5].color!.color.toStringHexRGB()).toBe("#444444");
        expect(results[5].color!.pixelCount).toBe(321);
        expect(results[5].color!.colorVolume).toBe(1);
    });
});
