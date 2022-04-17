import chai from "chai";
import { test } from "mocha";
import { test200ImageData } from "./__test__/test200.js";
import { testGrey200ImageData } from "./__test__/testGrey200.js";
import { ArrayPixelBlob } from "./array-pixel-blob.js";
import { quantize, QuantizedColor } from "./color-quantization.js";
import { extractPalette, PaletteEntry } from "./palette-extractor.js";
const expect = chai.expect;

describe("Extracting a palette from a set of colors", (): void => {
    test("Extract palette with default settings", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const colors: QuantizedColor[] = quantize(pixels);
        const results: PaletteEntry[] = extractPalette(colors);

        expect(results.length).to.equal(6);
        expect(results[0].found).to.equal(true);
        expect(results[0].color!.color.toStringHexRGB()).to.equal("#e36a27");
        expect(results[0].color!.pixelCount).to.equal(19);
        expect(results[0].color!.colorVolume).to.equal(396);
        expect(results[1].found).to.equal(true);
        expect(results[1].color!.color.toStringHexRGB()).to.equal("#fba078");
        expect(results[1].color!.pixelCount).to.equal(41);
        expect(results[1].color!.colorVolume).to.equal(72);
        expect(results[2].found).to.equal(true);
        expect(results[2].color!.color.toStringHexRGB()).to.equal("#094b58");
        expect(results[2].color!.pixelCount).to.equal(271);
        expect(results[2].color!.colorVolume).to.equal(80);
        expect(results[3].found).to.equal(true);
        expect(results[3].color!.color.toStringHexRGB()).to.equal("#a0635b");
        expect(results[3].color!.pixelCount).to.equal(89);
        expect(results[3].color!.colorVolume).to.equal(72);
        expect(results[4].found).to.equal(true);
        expect(results[4].color!.color.toStringHexRGB()).to.equal("#b57a76");
        expect(results[4].color!.pixelCount).to.equal(40);
        expect(results[4].color!.colorVolume).to.equal(88);
        expect(results[5].found).to.equal(true);
        expect(results[5].color!.color.toStringHexRGB()).to.equal("#35241c");
        expect(results[5].color!.pixelCount).to.equal(17);
        expect(results[5].color!.colorVolume).to.equal(84);
    });

    test("Extract palette with default settings from greyscale image", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(testGrey200ImageData, 200, 125);
        const colors: QuantizedColor[] = quantize(pixels);
        const results: PaletteEntry[] = extractPalette(colors);

        expect(results.length).to.equal(6);
        expect(results[0].found).to.equal(false);
        expect(results[1].found).to.equal(false);
        expect(results[2].found).to.equal(false);
        expect(results[3].found).to.equal(true);
        expect(results[3].color!.color.toStringHexRGB()).to.equal("#7c7c7c");
        expect(results[3].color!.pixelCount).to.equal(102);
        expect(results[3].color!.colorVolume).to.equal(1);
        expect(results[4].found).to.equal(true);
        expect(results[4].color!.color.toStringHexRGB()).to.equal("#bdbdbd");
        expect(results[4].color!.pixelCount).to.equal(9);
        expect(results[4].color!.colorVolume).to.equal(42);
        expect(results[5].found).to.equal(true);
        expect(results[5].color!.color.toStringHexRGB()).to.equal("#444444");
        expect(results[5].color!.pixelCount).to.equal(321);
        expect(results[5].color!.colorVolume).to.equal(1);
    });
});
