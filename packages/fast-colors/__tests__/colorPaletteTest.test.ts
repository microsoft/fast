// tslint:disable:no-string-literal
// tslint:disable:no-console
// tslint:disable:prefer-for-of

import { ColorPalette, ColorRGBA64 } from "../src/colorlib";

import { testData } from "../testData";

const testPrecision: number = 4;

describe("Palette generation", () => {
    test("paletteGeneration", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 = ColorRGBA64.fromObject(data.rgba)!;
            const palette: ColorPalette = new ColorPalette(rgba, data.palette.length);

            for (let i: number = 0; i < data.palette.length; i++) {
                expect(palette.palette[i].r).toBeCloseTo(
                    data.palette[i].r,
                    testPrecision
                );
                expect(palette.palette[i].g).toBeCloseTo(
                    data.palette[i].g,
                    testPrecision
                );
                expect(palette.palette[i].b).toBeCloseTo(
                    data.palette[i].b,
                    testPrecision
                );
                expect(palette.palette[i].a).toBeCloseTo(
                    data.palette[i].a,
                    testPrecision
                );
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
});
