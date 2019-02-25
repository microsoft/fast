// tslint:disable:no-string-literal
// tslint:disable:no-console

import {
    ColorHSL,
    ColorHSV,
    ColorLAB,
    ColorLCH,
    ColorRGBA64,
    ColorXYZ,
    contrastRatio,
    hslToRGB,
    hsvToRGB,
    labToLCH,
    labToRGB,
    labToXYZ,
    lchToLAB,
    lchToRGB,
    rgbToHSL,
    rgbToHSV,
    rgbToLAB,
    rgbToLCH,
    rgbToLuminance,
    rgbToTemperature,
    rgbToXYZ,
    temperatureToRGB,
    xyzToLAB,
    xyzToRGB,
} from "../src/colorlib";

import { testData } from "../testData";

const testPrecision: number = 4;

describe("Color converter functions", () => {
    test("rgbToLuminance", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );
            expect(rgbToLuminance(rgb)).toBeCloseTo(data.lum, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("contrastRatio", () => {
        function testPair(data: any): void {
            const bottom: ColorRGBA64 = new ColorRGBA64(
                data.bottom.r,
                data.bottom.g,
                data.bottom.b,
                data.bottom.a
            );
            const top: ColorRGBA64 = new ColorRGBA64(
                data.top.r,
                data.top.g,
                data.top.b,
                data.top.a
            );
            expect(contrastRatio(bottom, top)).toBeCloseTo(data.contrast, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testPair(data);
        }
    });

    test("rgbToHSL", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );

            const hsl: ColorHSL = rgbToHSL(rgb);
            expect(hsl.h).toBeCloseTo(data.hsl.h, testPrecision);
            expect(hsl.s).toBeCloseTo(data.hsl.s, testPrecision);
            expect(hsl.l).toBeCloseTo(data.hsl.l, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("hslToRGB", () => {
        function testColor(data: any): void {
            const hsl: ColorHSL = new ColorHSL(data.hsl.h, data.hsl.s, data.hsl.l);

            const rgb: ColorRGBA64 = hslToRGB(hsl);
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("rgbToHSV", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );

            const hsv: ColorHSV = rgbToHSV(rgb);
            expect(hsv.h).toBeCloseTo(data.hsv.h, testPrecision);
            expect(hsv.s).toBeCloseTo(data.hsv.s, testPrecision);
            expect(hsv.v).toBeCloseTo(data.hsv.v, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("hsvToRGB", () => {
        function testColor(data: any): void {
            const hsv: ColorHSV = new ColorHSV(data.hsv.h, data.hsv.s, data.hsv.v);

            const rgb: ColorRGBA64 = hsvToRGB(hsv);
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("lchToLAB", () => {
        function testColor(data: any): void {
            const lch: ColorLCH = new ColorLCH(data.lch.l, data.lch.c, data.lch.h);

            const lab: ColorLAB = lchToLAB(lch);
            expect(lab.l).toBeCloseTo(data.lchToLabResult.l, testPrecision);
            expect(lab.a).toBeCloseTo(data.lchToLabResult.a, testPrecision);
            expect(lab.b).toBeCloseTo(data.lchToLabResult.b, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("labToLCH", () => {
        function testColor(data: any): void {
            const lab: ColorLAB = new ColorLAB(data.lab.l, data.lab.a, data.lab.b);

            const lch: ColorLCH = labToLCH(lab);
            expect(lch.l).toBeCloseTo(data.labToLCHResult.l, testPrecision);
            expect(lch.c).toBeCloseTo(data.labToLCHResult.c, testPrecision);
            expect(lch.h).toBeCloseTo(data.labToLCHResult.h, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("labToXYZ", () => {
        function testColor(data: any): void {
            const lab: ColorLAB = new ColorLAB(data.lab.l, data.lab.a, data.lab.b);

            const xyz: ColorXYZ = labToXYZ(lab);
            expect(xyz.x).toBeCloseTo(data.labToXYZResult.x, testPrecision);
            expect(xyz.y).toBeCloseTo(data.labToXYZResult.y, testPrecision);
            expect(xyz.z).toBeCloseTo(data.labToXYZResult.z, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("xyzToLAB", () => {
        function testColor(data: any): void {
            const xyz: ColorXYZ = new ColorXYZ(data.xyz.x, data.xyz.y, data.xyz.z);

            const lab: ColorLAB = xyzToLAB(xyz);
            expect(lab.l).toBeCloseTo(data.xyzToLABResult.l, testPrecision);
            expect(lab.a).toBeCloseTo(data.xyzToLABResult.a, testPrecision);
            expect(lab.b).toBeCloseTo(data.xyzToLABResult.b, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("rgbToXYZ", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );

            const xyz: ColorXYZ = rgbToXYZ(rgb);
            expect(xyz.x).toBeCloseTo(data.rgbToXYZResult.x, testPrecision);
            expect(xyz.y).toBeCloseTo(data.rgbToXYZResult.y, testPrecision);
            expect(xyz.z).toBeCloseTo(data.rgbToXYZResult.z, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("xyzToRGB", () => {
        function testColor(data: any): void {
            const xyz: ColorXYZ = new ColorXYZ(data.xyz.x, data.xyz.y, data.xyz.z);

            const rgb: ColorRGBA64 = xyzToRGB(xyz);
            expect(rgb.r).toBeCloseTo(data.xyzToRGBResult.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.xyzToRGBResult.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.xyzToRGBResult.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("rgbToLAB", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );

            const lab: ColorLAB = rgbToLAB(rgb);
            expect(lab.l).toBeCloseTo(data.rgbToLABResult.l, testPrecision);
            expect(lab.a).toBeCloseTo(data.rgbToLABResult.a, testPrecision);
            expect(lab.b).toBeCloseTo(data.rgbToLABResult.b, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("labToRGB", () => {
        function testColor(data: any): void {
            const lab: ColorLAB = new ColorLAB(data.lab.l, data.lab.a, data.lab.b);

            const rgb: ColorRGBA64 = labToRGB(lab);
            expect(rgb.r).toBeCloseTo(data.labToRGBResult.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.labToRGBResult.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.labToRGBResult.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("rgbToLCH", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );

            const lch: ColorLCH = rgbToLCH(rgb);
            expect(lch.l).toBeCloseTo(data.rgbToLCHResult.l, testPrecision);
            expect(lch.c).toBeCloseTo(data.rgbToLCHResult.c, testPrecision);
            expect(lch.h).toBeCloseTo(data.rgbToLCHResult.h, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("lchToRGB", () => {
        function testColor(data: any): void {
            const lch: ColorLCH = new ColorLCH(data.lch.l, data.lch.c, data.lch.h);

            const rgb: ColorRGBA64 = lchToRGB(lch);
            expect(rgb.r).toBeCloseTo(data.lchToRGBResult.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.lchToRGBResult.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.lchToRGBResult.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("temperatureToRGB", () => {
        function testColor(data: any): void {
            const temp: number = data.temp;

            const rgb: ColorRGBA64 = temperatureToRGB(temp);
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.temperatures) {
            testColor(data);
        }
    });

    test("rgbToTemperature", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );

            const temp: number = rgbToTemperature(rgb);
            expect(temp).toBeCloseTo(data.temp, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
});
