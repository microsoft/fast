import chai from "chai";
import { test } from "mocha";
import { test200ImageData } from "./__test__/test200.js";
import { Histogram } from "./histogram.js";
import { ArrayPixelBlob } from "./array-pixel-blob.js";
const expect = chai.expect;

describe("Generating a histogram from an image", (): void => {
    test("getHistogramIndex", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const histogram: Histogram = new Histogram(pixels);

        expect(histogram.getHistogramIndex(0, 0, 0)).to.equal(0);
        expect(histogram.getHistogramIndex(0, 0, 8)).to.equal(8);
        expect(histogram.getHistogramIndex(0, 0, 16)).to.equal(16);
        expect(histogram.getHistogramIndex(0, 0, 24)).to.equal(24);
        expect(histogram.getHistogramIndex(0, 8, 0)).to.equal(256);
        expect(histogram.getHistogramIndex(0, 8, 8)).to.equal(264);
        expect(histogram.getHistogramIndex(0, 8, 16)).to.equal(272);
        expect(histogram.getHistogramIndex(0, 8, 24)).to.equal(280);
        expect(histogram.getHistogramIndex(0, 16, 0)).to.equal(512);
        expect(histogram.getHistogramIndex(0, 16, 8)).to.equal(520);
        expect(histogram.getHistogramIndex(0, 16, 16)).to.equal(528);
        expect(histogram.getHistogramIndex(0, 16, 24)).to.equal(536);
        expect(histogram.getHistogramIndex(0, 24, 0)).to.equal(768);
        expect(histogram.getHistogramIndex(0, 24, 8)).to.equal(776);
        expect(histogram.getHistogramIndex(0, 24, 16)).to.equal(784);
        expect(histogram.getHistogramIndex(0, 24, 24)).to.equal(792);
        expect(histogram.getHistogramIndex(8, 0, 0)).to.equal(8192);
        expect(histogram.getHistogramIndex(8, 0, 8)).to.equal(8200);
        expect(histogram.getHistogramIndex(8, 0, 16)).to.equal(8208);
        expect(histogram.getHistogramIndex(8, 0, 24)).to.equal(8216);
        expect(histogram.getHistogramIndex(8, 8, 0)).to.equal(8448);
        expect(histogram.getHistogramIndex(8, 8, 8)).to.equal(8456);
        expect(histogram.getHistogramIndex(8, 8, 16)).to.equal(8464);
        expect(histogram.getHistogramIndex(8, 8, 24)).to.equal(8472);
        expect(histogram.getHistogramIndex(8, 16, 0)).to.equal(8704);
        expect(histogram.getHistogramIndex(8, 16, 8)).to.equal(8712);
        expect(histogram.getHistogramIndex(8, 16, 16)).to.equal(8720);
        expect(histogram.getHistogramIndex(8, 16, 24)).to.equal(8728);
        expect(histogram.getHistogramIndex(8, 24, 0)).to.equal(8960);
        expect(histogram.getHistogramIndex(8, 24, 8)).to.equal(8968);
        expect(histogram.getHistogramIndex(8, 24, 16)).to.equal(8976);
        expect(histogram.getHistogramIndex(8, 24, 24)).to.equal(8984);
        expect(histogram.getHistogramIndex(16, 0, 0)).to.equal(16384);
        expect(histogram.getHistogramIndex(16, 0, 8)).to.equal(16392);
        expect(histogram.getHistogramIndex(16, 0, 16)).to.equal(16400);
        expect(histogram.getHistogramIndex(16, 0, 24)).to.equal(16408);
        expect(histogram.getHistogramIndex(16, 8, 0)).to.equal(16640);
        expect(histogram.getHistogramIndex(16, 8, 8)).to.equal(16648);
        expect(histogram.getHistogramIndex(16, 8, 16)).to.equal(16656);
        expect(histogram.getHistogramIndex(16, 8, 24)).to.equal(16664);
        expect(histogram.getHistogramIndex(16, 16, 0)).to.equal(16896);
        expect(histogram.getHistogramIndex(16, 16, 8)).to.equal(16904);
        expect(histogram.getHistogramIndex(16, 16, 16)).to.equal(16912);
        expect(histogram.getHistogramIndex(16, 16, 24)).to.equal(16920);
        expect(histogram.getHistogramIndex(16, 24, 0)).to.equal(17152);
        expect(histogram.getHistogramIndex(16, 24, 8)).to.equal(17160);
        expect(histogram.getHistogramIndex(16, 24, 16)).to.equal(17168);
        expect(histogram.getHistogramIndex(16, 24, 24)).to.equal(17176);
        expect(histogram.getHistogramIndex(24, 0, 0)).to.equal(24576);
        expect(histogram.getHistogramIndex(24, 0, 8)).to.equal(24584);
        expect(histogram.getHistogramIndex(24, 0, 16)).to.equal(24592);
        expect(histogram.getHistogramIndex(24, 0, 24)).to.equal(24600);
        expect(histogram.getHistogramIndex(24, 8, 0)).to.equal(24832);
        expect(histogram.getHistogramIndex(24, 8, 8)).to.equal(24840);
        expect(histogram.getHistogramIndex(24, 8, 16)).to.equal(24848);
        expect(histogram.getHistogramIndex(24, 8, 24)).to.equal(24856);
        expect(histogram.getHistogramIndex(24, 16, 0)).to.equal(25088);
        expect(histogram.getHistogramIndex(24, 16, 8)).to.equal(25096);
        expect(histogram.getHistogramIndex(24, 16, 16)).to.equal(25104);
        expect(histogram.getHistogramIndex(24, 16, 24)).to.equal(25112);
        expect(histogram.getHistogramIndex(24, 24, 0)).to.equal(25344);
    });

    test("getHistogramValue", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const histogram: Histogram = new Histogram(pixels);

        expect(histogram.getHistogramValue(0, 4, 5)).to.equal(26);
        expect(histogram.getHistogramValue(0, 5, 6)).to.equal(59);
        expect(histogram.getHistogramValue(0, 6, 7)).to.equal(64);
        expect(histogram.getHistogramValue(0, 6, 8)).to.equal(40);
        expect(histogram.getHistogramValue(0, 7, 8)).to.equal(54);
        expect(histogram.getHistogramValue(0, 7, 9)).to.equal(35);
        expect(histogram.getHistogramValue(0, 8, 9)).to.equal(39);
        expect(histogram.getHistogramValue(0, 8, 10)).to.equal(56);
        expect(histogram.getHistogramValue(0, 9, 11)).to.equal(40);
        expect(histogram.getHistogramValue(0, 10, 12)).to.equal(34);
        expect(histogram.getHistogramValue(0, 11, 13)).to.equal(69);
        expect(histogram.getHistogramValue(1, 3, 3)).to.equal(23);
        expect(histogram.getHistogramValue(1, 4, 4)).to.equal(20);
        expect(histogram.getHistogramValue(1, 11, 13)).to.equal(22);
        expect(histogram.getHistogramValue(2, 2, 1)).to.equal(63);
        expect(histogram.getHistogramValue(3, 2, 2)).to.equal(45);
        expect(histogram.getHistogramValue(3, 3, 2)).to.equal(87);
        expect(histogram.getHistogramValue(3, 4, 2)).to.equal(42);
        expect(histogram.getHistogramValue(4, 2, 2)).to.equal(27);
        expect(histogram.getHistogramValue(4, 3, 2)).to.equal(27);
        expect(histogram.getHistogramValue(4, 3, 3)).to.equal(47);
        expect(histogram.getHistogramValue(4, 4, 2)).to.equal(22);
        expect(histogram.getHistogramValue(4, 4, 3)).to.equal(29);
        expect(histogram.getHistogramValue(5, 3, 3)).to.equal(58);
        expect(histogram.getHistogramValue(5, 4, 3)).to.equal(32);
        expect(histogram.getHistogramValue(5, 4, 4)).to.equal(34);
        expect(histogram.getHistogramValue(6, 4, 4)).to.equal(58);
        expect(histogram.getHistogramValue(6, 5, 4)).to.equal(33);
        expect(histogram.getHistogramValue(7, 5, 4)).to.equal(36);
        expect(histogram.getHistogramValue(7, 5, 5)).to.equal(28);
        expect(histogram.getHistogramValue(8, 6, 5)).to.equal(21);
        expect(histogram.getHistogramValue(13, 9, 9)).to.equal(20);
        expect(histogram.getHistogramValue(14, 10, 10)).to.equal(20);
        expect(histogram.getHistogramValue(15, 10, 10)).to.equal(28);
        expect(histogram.getHistogramValue(22, 23, 25)).to.equal(20);
        expect(histogram.getHistogramValue(23, 23, 25)).to.equal(24);
        expect(histogram.getHistogramValue(23, 24, 25)).to.equal(29);
        expect(histogram.getHistogramValue(25, 23, 24)).to.equal(26);
        expect(histogram.getHistogramValue(25, 24, 25)).to.equal(24);
        expect(histogram.getHistogramValue(26, 23, 24)).to.equal(22);
        expect(histogram.getHistogramValue(27, 19, 18)).to.equal(31);
        expect(histogram.getHistogramValue(28, 22, 22)).to.equal(20);
    });

    test("setHistogramValue", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const histogram: Histogram = new Histogram(pixels);

        expect(histogram.getHistogramValue(0, 4, 5)).to.equal(26);
        histogram.setHistogramValue(100, 0, 4, 5);
        expect(histogram.getHistogramValue(0, 4, 5)).to.equal(100);
    });

    test("Color bounds for different significant bits", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);

        const histogram1: Histogram = new Histogram(pixels, 1);
        expect(histogram1.total).to.equal(5320);
        expect(histogram1.minRed).to.equal(0);
        expect(histogram1.maxRed).to.equal(1);
        expect(histogram1.minGreen).to.equal(0);
        expect(histogram1.maxGreen).to.equal(1);
        expect(histogram1.minBlue).to.equal(0);
        expect(histogram1.maxBlue).to.equal(1);

        const histogram2: Histogram = new Histogram(pixels, 2);
        expect(histogram2.total).to.equal(5320);
        expect(histogram2.minRed).to.equal(0);
        expect(histogram2.maxRed).to.equal(3);
        expect(histogram2.minGreen).to.equal(0);
        expect(histogram2.maxGreen).to.equal(3);
        expect(histogram2.minBlue).to.equal(0);
        expect(histogram2.maxBlue).to.equal(3);

        const histogram3: Histogram = new Histogram(pixels, 3);
        expect(histogram3.total).to.equal(5320);
        expect(histogram3.minRed).to.equal(0);
        expect(histogram3.maxRed).to.equal(7);
        expect(histogram3.minGreen).to.equal(0);
        expect(histogram3.maxGreen).to.equal(6);
        expect(histogram3.minBlue).to.equal(0);
        expect(histogram3.maxBlue).to.equal(6);

        const histogram4: Histogram = new Histogram(pixels, 4);
        expect(histogram4.total).to.equal(5320);
        expect(histogram4.minRed).to.equal(0);
        expect(histogram4.maxRed).to.equal(15);
        expect(histogram4.minGreen).to.equal(0);
        expect(histogram4.maxGreen).to.equal(13);
        expect(histogram4.minBlue).to.equal(0);
        expect(histogram4.maxBlue).to.equal(13);

        const histogram5: Histogram = new Histogram(pixels, 5);
        expect(histogram5.total).to.equal(5320);
        expect(histogram5.minRed).to.equal(0);
        expect(histogram5.maxRed).to.equal(31);
        expect(histogram5.minGreen).to.equal(1);
        expect(histogram5.maxGreen).to.equal(26);
        expect(histogram5.minBlue).to.equal(0);
        expect(histogram5.maxBlue).to.equal(27);

        const histogram6: Histogram = new Histogram(pixels, 6);
        expect(histogram6.total).to.equal(5320);
        expect(histogram6.minRed).to.equal(0);
        expect(histogram6.maxRed).to.equal(63);
        expect(histogram6.minGreen).to.equal(2);
        expect(histogram6.maxGreen).to.equal(53);
        expect(histogram6.minBlue).to.equal(0);
        expect(histogram6.maxBlue).to.equal(55);

        const histogram7: Histogram = new Histogram(pixels, 7);
        expect(histogram7.total).to.equal(5320);
        expect(histogram7.minRed).to.equal(0);
        expect(histogram7.maxRed).to.equal(127);
        expect(histogram7.minGreen).to.equal(5);
        expect(histogram7.maxGreen).to.equal(107);
        expect(histogram7.minBlue).to.equal(1);
        expect(histogram7.maxBlue).to.equal(111);

        const histogram8: Histogram = new Histogram(pixels, 8);
        expect(histogram8.total).to.equal(5320);
        expect(histogram8.minRed).to.equal(1);
        expect(histogram8.maxRed).to.equal(255);
        expect(histogram8.minGreen).to.equal(10);
        expect(histogram8.maxGreen).to.equal(214);
        expect(histogram8.minBlue).to.equal(3);
        expect(histogram8.maxBlue).to.equal(223);
    });

    test("Color bounds for different pixel skipping rates", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);

        const histogram0: Histogram = new Histogram(pixels, 5, 0);
        expect(histogram0.total).to.equal(26600);
        expect(histogram0.minRed).to.equal(0);
        expect(histogram0.maxRed).to.equal(31);
        expect(histogram0.minGreen).to.equal(0);
        expect(histogram0.maxGreen).to.equal(26);
        expect(histogram0.minBlue).to.equal(0);
        expect(histogram0.maxBlue).to.equal(27);

        const histogram2: Histogram = new Histogram(pixels, 5, 2);
        expect(histogram2.total).to.equal(13300);
        expect(histogram2.minRed).to.equal(0);
        expect(histogram2.maxRed).to.equal(31);
        expect(histogram2.minGreen).to.equal(0);
        expect(histogram2.maxGreen).to.equal(26);
        expect(histogram2.minBlue).to.equal(0);
        expect(histogram2.maxBlue).to.equal(27);

        const histogram4: Histogram = new Histogram(pixels, 5, 4);
        expect(histogram4.total).to.equal(6650);
        expect(histogram4.minRed).to.equal(0);
        expect(histogram4.maxRed).to.equal(31);
        expect(histogram4.minGreen).to.equal(0);
        expect(histogram4.maxGreen).to.equal(26);
        expect(histogram4.minBlue).to.equal(0);
        expect(histogram4.maxBlue).to.equal(27);

        const histogram8: Histogram = new Histogram(pixels, 5, 8);
        expect(histogram8.total).to.equal(3325);
        expect(histogram8.minRed).to.equal(0);
        expect(histogram8.maxRed).to.equal(31);
        expect(histogram8.minGreen).to.equal(1);
        expect(histogram8.maxGreen).to.equal(26);
        expect(histogram8.minBlue).to.equal(0);
        expect(histogram8.maxBlue).to.equal(27);
    });

    test("Custom pixel filtering", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);

        const histogram: Histogram = new Histogram(
            pixels,
            5,
            0,
            (p: number[]): boolean => {
                if (p[2] > 128) {
                    // Filter out pixels with lots of blue
                    return false;
                }
                return true;
            }
        );

        expect(histogram.total).to.equal(20163);
        expect(histogram.minRed).to.equal(0);
        expect(histogram.maxRed).to.equal(31);
        expect(histogram.minGreen).to.equal(0);
        expect(histogram.maxGreen).to.equal(21);
        expect(histogram.minBlue).to.equal(0);
        expect(histogram.maxBlue).to.equal(16);
    });
});
