// tslint:disable:prefer-for-of
import { Histogram } from "./histogram";
import { ArrayPixelBlob } from "./array-pixel-blob";
import { test200ImageData } from "../__test-images__/test200";

describe("Generating a histogram from an image", (): void => {
    test("getHistogramIndex", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const histogram: Histogram = new Histogram(pixels);

        expect(histogram.getHistogramIndex(0, 0, 0)).toBe(0);
        expect(histogram.getHistogramIndex(0, 0, 8)).toBe(8);
        expect(histogram.getHistogramIndex(0, 0, 16)).toBe(16);
        expect(histogram.getHistogramIndex(0, 0, 24)).toBe(24);
        expect(histogram.getHistogramIndex(0, 8, 0)).toBe(256);
        expect(histogram.getHistogramIndex(0, 8, 8)).toBe(264);
        expect(histogram.getHistogramIndex(0, 8, 16)).toBe(272);
        expect(histogram.getHistogramIndex(0, 8, 24)).toBe(280);
        expect(histogram.getHistogramIndex(0, 16, 0)).toBe(512);
        expect(histogram.getHistogramIndex(0, 16, 8)).toBe(520);
        expect(histogram.getHistogramIndex(0, 16, 16)).toBe(528);
        expect(histogram.getHistogramIndex(0, 16, 24)).toBe(536);
        expect(histogram.getHistogramIndex(0, 24, 0)).toBe(768);
        expect(histogram.getHistogramIndex(0, 24, 8)).toBe(776);
        expect(histogram.getHistogramIndex(0, 24, 16)).toBe(784);
        expect(histogram.getHistogramIndex(0, 24, 24)).toBe(792);
        expect(histogram.getHistogramIndex(8, 0, 0)).toBe(8192);
        expect(histogram.getHistogramIndex(8, 0, 8)).toBe(8200);
        expect(histogram.getHistogramIndex(8, 0, 16)).toBe(8208);
        expect(histogram.getHistogramIndex(8, 0, 24)).toBe(8216);
        expect(histogram.getHistogramIndex(8, 8, 0)).toBe(8448);
        expect(histogram.getHistogramIndex(8, 8, 8)).toBe(8456);
        expect(histogram.getHistogramIndex(8, 8, 16)).toBe(8464);
        expect(histogram.getHistogramIndex(8, 8, 24)).toBe(8472);
        expect(histogram.getHistogramIndex(8, 16, 0)).toBe(8704);
        expect(histogram.getHistogramIndex(8, 16, 8)).toBe(8712);
        expect(histogram.getHistogramIndex(8, 16, 16)).toBe(8720);
        expect(histogram.getHistogramIndex(8, 16, 24)).toBe(8728);
        expect(histogram.getHistogramIndex(8, 24, 0)).toBe(8960);
        expect(histogram.getHistogramIndex(8, 24, 8)).toBe(8968);
        expect(histogram.getHistogramIndex(8, 24, 16)).toBe(8976);
        expect(histogram.getHistogramIndex(8, 24, 24)).toBe(8984);
        expect(histogram.getHistogramIndex(16, 0, 0)).toBe(16384);
        expect(histogram.getHistogramIndex(16, 0, 8)).toBe(16392);
        expect(histogram.getHistogramIndex(16, 0, 16)).toBe(16400);
        expect(histogram.getHistogramIndex(16, 0, 24)).toBe(16408);
        expect(histogram.getHistogramIndex(16, 8, 0)).toBe(16640);
        expect(histogram.getHistogramIndex(16, 8, 8)).toBe(16648);
        expect(histogram.getHistogramIndex(16, 8, 16)).toBe(16656);
        expect(histogram.getHistogramIndex(16, 8, 24)).toBe(16664);
        expect(histogram.getHistogramIndex(16, 16, 0)).toBe(16896);
        expect(histogram.getHistogramIndex(16, 16, 8)).toBe(16904);
        expect(histogram.getHistogramIndex(16, 16, 16)).toBe(16912);
        expect(histogram.getHistogramIndex(16, 16, 24)).toBe(16920);
        expect(histogram.getHistogramIndex(16, 24, 0)).toBe(17152);
        expect(histogram.getHistogramIndex(16, 24, 8)).toBe(17160);
        expect(histogram.getHistogramIndex(16, 24, 16)).toBe(17168);
        expect(histogram.getHistogramIndex(16, 24, 24)).toBe(17176);
        expect(histogram.getHistogramIndex(24, 0, 0)).toBe(24576);
        expect(histogram.getHistogramIndex(24, 0, 8)).toBe(24584);
        expect(histogram.getHistogramIndex(24, 0, 16)).toBe(24592);
        expect(histogram.getHistogramIndex(24, 0, 24)).toBe(24600);
        expect(histogram.getHistogramIndex(24, 8, 0)).toBe(24832);
        expect(histogram.getHistogramIndex(24, 8, 8)).toBe(24840);
        expect(histogram.getHistogramIndex(24, 8, 16)).toBe(24848);
        expect(histogram.getHistogramIndex(24, 8, 24)).toBe(24856);
        expect(histogram.getHistogramIndex(24, 16, 0)).toBe(25088);
        expect(histogram.getHistogramIndex(24, 16, 8)).toBe(25096);
        expect(histogram.getHistogramIndex(24, 16, 16)).toBe(25104);
        expect(histogram.getHistogramIndex(24, 16, 24)).toBe(25112);
        expect(histogram.getHistogramIndex(24, 24, 0)).toBe(25344);
    });

    test("getHistogramValue", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const histogram: Histogram = new Histogram(pixels);

        expect(histogram.getHistogramValue(0, 4, 5)).toBe(26);
        expect(histogram.getHistogramValue(0, 5, 6)).toBe(59);
        expect(histogram.getHistogramValue(0, 6, 7)).toBe(64);
        expect(histogram.getHistogramValue(0, 6, 8)).toBe(40);
        expect(histogram.getHistogramValue(0, 7, 8)).toBe(54);
        expect(histogram.getHistogramValue(0, 7, 9)).toBe(35);
        expect(histogram.getHistogramValue(0, 8, 9)).toBe(39);
        expect(histogram.getHistogramValue(0, 8, 10)).toBe(56);
        expect(histogram.getHistogramValue(0, 9, 11)).toBe(40);
        expect(histogram.getHistogramValue(0, 10, 12)).toBe(34);
        expect(histogram.getHistogramValue(0, 11, 13)).toBe(69);
        expect(histogram.getHistogramValue(1, 3, 3)).toBe(23);
        expect(histogram.getHistogramValue(1, 4, 4)).toBe(20);
        expect(histogram.getHistogramValue(1, 11, 13)).toBe(22);
        expect(histogram.getHistogramValue(2, 2, 1)).toBe(63);
        expect(histogram.getHistogramValue(3, 2, 2)).toBe(45);
        expect(histogram.getHistogramValue(3, 3, 2)).toBe(87);
        expect(histogram.getHistogramValue(3, 4, 2)).toBe(42);
        expect(histogram.getHistogramValue(4, 2, 2)).toBe(27);
        expect(histogram.getHistogramValue(4, 3, 2)).toBe(27);
        expect(histogram.getHistogramValue(4, 3, 3)).toBe(47);
        expect(histogram.getHistogramValue(4, 4, 2)).toBe(22);
        expect(histogram.getHistogramValue(4, 4, 3)).toBe(29);
        expect(histogram.getHistogramValue(5, 3, 3)).toBe(58);
        expect(histogram.getHistogramValue(5, 4, 3)).toBe(32);
        expect(histogram.getHistogramValue(5, 4, 4)).toBe(34);
        expect(histogram.getHistogramValue(6, 4, 4)).toBe(58);
        expect(histogram.getHistogramValue(6, 5, 4)).toBe(33);
        expect(histogram.getHistogramValue(7, 5, 4)).toBe(36);
        expect(histogram.getHistogramValue(7, 5, 5)).toBe(28);
        expect(histogram.getHistogramValue(8, 6, 5)).toBe(21);
        expect(histogram.getHistogramValue(13, 9, 9)).toBe(20);
        expect(histogram.getHistogramValue(14, 10, 10)).toBe(20);
        expect(histogram.getHistogramValue(15, 10, 10)).toBe(28);
        expect(histogram.getHistogramValue(22, 23, 25)).toBe(20);
        expect(histogram.getHistogramValue(23, 23, 25)).toBe(24);
        expect(histogram.getHistogramValue(23, 24, 25)).toBe(29);
        expect(histogram.getHistogramValue(25, 23, 24)).toBe(26);
        expect(histogram.getHistogramValue(25, 24, 25)).toBe(24);
        expect(histogram.getHistogramValue(26, 23, 24)).toBe(22);
        expect(histogram.getHistogramValue(27, 19, 18)).toBe(31);
        expect(histogram.getHistogramValue(28, 22, 22)).toBe(20);
    });

    test("setHistogramValue", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);
        const histogram: Histogram = new Histogram(pixels);

        expect(histogram.getHistogramValue(0, 4, 5)).toBe(26);
        histogram.setHistogramValue(100, 0, 4, 5);
        expect(histogram.getHistogramValue(0, 4, 5)).toBe(100);
    });

    test("Color bounds for different signifigant bits", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);

        const histogram1: Histogram = new Histogram(pixels, 1);
        expect(histogram1.total).toBe(5320);
        expect(histogram1.minRed).toBe(0);
        expect(histogram1.maxRed).toBe(1);
        expect(histogram1.minGreen).toBe(0);
        expect(histogram1.maxGreen).toBe(1);
        expect(histogram1.minBlue).toBe(0);
        expect(histogram1.maxBlue).toBe(1);

        const histogram2: Histogram = new Histogram(pixels, 2);
        expect(histogram2.total).toBe(5320);
        expect(histogram2.minRed).toBe(0);
        expect(histogram2.maxRed).toBe(3);
        expect(histogram2.minGreen).toBe(0);
        expect(histogram2.maxGreen).toBe(3);
        expect(histogram2.minBlue).toBe(0);
        expect(histogram2.maxBlue).toBe(3);

        const histogram3: Histogram = new Histogram(pixels, 3);
        expect(histogram3.total).toBe(5320);
        expect(histogram3.minRed).toBe(0);
        expect(histogram3.maxRed).toBe(7);
        expect(histogram3.minGreen).toBe(0);
        expect(histogram3.maxGreen).toBe(6);
        expect(histogram3.minBlue).toBe(0);
        expect(histogram3.maxBlue).toBe(6);

        const histogram4: Histogram = new Histogram(pixels, 4);
        expect(histogram4.total).toBe(5320);
        expect(histogram4.minRed).toBe(0);
        expect(histogram4.maxRed).toBe(15);
        expect(histogram4.minGreen).toBe(0);
        expect(histogram4.maxGreen).toBe(13);
        expect(histogram4.minBlue).toBe(0);
        expect(histogram4.maxBlue).toBe(13);

        const histogram5: Histogram = new Histogram(pixels, 5);
        expect(histogram5.total).toBe(5320);
        expect(histogram5.minRed).toBe(0);
        expect(histogram5.maxRed).toBe(31);
        expect(histogram5.minGreen).toBe(1);
        expect(histogram5.maxGreen).toBe(26);
        expect(histogram5.minBlue).toBe(0);
        expect(histogram5.maxBlue).toBe(27);

        const histogram6: Histogram = new Histogram(pixels, 6);
        expect(histogram6.total).toBe(5320);
        expect(histogram6.minRed).toBe(0);
        expect(histogram6.maxRed).toBe(63);
        expect(histogram6.minGreen).toBe(2);
        expect(histogram6.maxGreen).toBe(53);
        expect(histogram6.minBlue).toBe(0);
        expect(histogram6.maxBlue).toBe(55);

        const histogram7: Histogram = new Histogram(pixels, 7);
        expect(histogram7.total).toBe(5320);
        expect(histogram7.minRed).toBe(0);
        expect(histogram7.maxRed).toBe(127);
        expect(histogram7.minGreen).toBe(5);
        expect(histogram7.maxGreen).toBe(107);
        expect(histogram7.minBlue).toBe(1);
        expect(histogram7.maxBlue).toBe(111);

        const histogram8: Histogram = new Histogram(pixels, 8);
        expect(histogram8.total).toBe(5320);
        expect(histogram8.minRed).toBe(1);
        expect(histogram8.maxRed).toBe(255);
        expect(histogram8.minGreen).toBe(10);
        expect(histogram8.maxGreen).toBe(214);
        expect(histogram8.minBlue).toBe(3);
        expect(histogram8.maxBlue).toBe(223);
    });

    test("Color bounds for different pixel skipping rates", () => {
        const pixels: ArrayPixelBlob = new ArrayPixelBlob(test200ImageData, 200, 133);

        const histogram0: Histogram = new Histogram(pixels, 5, 0);
        expect(histogram0.total).toBe(26600);
        expect(histogram0.minRed).toBe(0);
        expect(histogram0.maxRed).toBe(31);
        expect(histogram0.minGreen).toBe(0);
        expect(histogram0.maxGreen).toBe(26);
        expect(histogram0.minBlue).toBe(0);
        expect(histogram0.maxBlue).toBe(27);

        const histogram2: Histogram = new Histogram(pixels, 5, 2);
        expect(histogram2.total).toBe(13300);
        expect(histogram2.minRed).toBe(0);
        expect(histogram2.maxRed).toBe(31);
        expect(histogram2.minGreen).toBe(0);
        expect(histogram2.maxGreen).toBe(26);
        expect(histogram2.minBlue).toBe(0);
        expect(histogram2.maxBlue).toBe(27);

        const histogram4: Histogram = new Histogram(pixels, 5, 4);
        expect(histogram4.total).toBe(6650);
        expect(histogram4.minRed).toBe(0);
        expect(histogram4.maxRed).toBe(31);
        expect(histogram4.minGreen).toBe(0);
        expect(histogram4.maxGreen).toBe(26);
        expect(histogram4.minBlue).toBe(0);
        expect(histogram4.maxBlue).toBe(27);

        const histogram8: Histogram = new Histogram(pixels, 5, 8);
        expect(histogram8.total).toBe(3325);
        expect(histogram8.minRed).toBe(0);
        expect(histogram8.maxRed).toBe(31);
        expect(histogram8.minGreen).toBe(1);
        expect(histogram8.maxGreen).toBe(26);
        expect(histogram8.minBlue).toBe(0);
        expect(histogram8.maxBlue).toBe(27);
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

        expect(histogram.total).toBe(20163);
        expect(histogram.minRed).toBe(0);
        expect(histogram.maxRed).toBe(31);
        expect(histogram.minGreen).toBe(0);
        expect(histogram.maxGreen).toBe(21);
        expect(histogram.minBlue).toBe(0);
        expect(histogram.maxBlue).toBe(16);
    });
});
