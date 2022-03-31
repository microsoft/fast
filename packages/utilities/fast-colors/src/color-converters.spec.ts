import chai from "chai";
import { test } from "mocha";
import { testData } from "./__test__/testData.js";
import {
    calculateOverlayColor,
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
    rgbToRelativeLuminance,
    rgbToTemperature,
    rgbToXYZ,
    temperatureToRGB,
    xyzToLAB,
    xyzToRGB,
} from "./index.js";
const expect = chai.expect;

const testPrecision: number = 4;

describe("Color converter functions", () => {
    test("rgbToRelativeLuminance", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 = new ColorRGBA64(
                data.rgba.r,
                data.rgba.g,
                data.rgba.b,
                data.rgba.a
            );
            expect(rgbToRelativeLuminance(rgb)).to.be.closeTo(data.lum, testPrecision);
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
            expect(contrastRatio(bottom, top)).to.be.closeTo(
                data.contrast,
                testPrecision
            );
        }
        for (const data of testData.colorPairs) {
            testPair(data);
        }
    });

    test("calculateOverlayColor", () => {
        function testPair(data: any): void {
            const match: ColorRGBA64 = new ColorRGBA64(
                data.match.r,
                data.match.g,
                data.match.b,
                1
            );
            const background: ColorRGBA64 = new ColorRGBA64(
                data.background.r,
                data.background.g,
                data.background.b,
                1
            );
            const rgb: ColorRGBA64 = calculateOverlayColor(match, background);
            expect(rgb.r).to.be.closeTo(data.overlayColorResult.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.overlayColorResult.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.overlayColorResult.b, testPrecision);
            expect(rgb.a).to.be.closeTo(data.overlayColorResult.a, testPrecision);
        }
        for (const data of testData.overlayPairs) {
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
            expect(hsl.h).to.be.closeTo(data.hsl.h, testPrecision);
            expect(hsl.s).to.be.closeTo(data.hsl.s, testPrecision);
            expect(hsl.l).to.be.closeTo(data.hsl.l, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("hslToRGB", () => {
        function testColor(data: any): void {
            const hsl: ColorHSL = new ColorHSL(data.hsl.h, data.hsl.s, data.hsl.l);

            const rgb: ColorRGBA64 = hslToRGB(hsl);
            expect(rgb.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb.a).to.equal(1);
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
            expect(hsv.h).to.be.closeTo(data.hsv.h, testPrecision);
            expect(hsv.s).to.be.closeTo(data.hsv.s, testPrecision);
            expect(hsv.v).to.be.closeTo(data.hsv.v, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("hsvToRGB", () => {
        function testColor(data: any): void {
            const hsv: ColorHSV = new ColorHSV(data.hsv.h, data.hsv.s, data.hsv.v);

            const rgb: ColorRGBA64 = hsvToRGB(hsv);
            expect(rgb.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb.a).to.equal(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("lchToLAB", () => {
        function testColor(data: any): void {
            const lch: ColorLCH = new ColorLCH(data.lch.l, data.lch.c, data.lch.h);

            const lab: ColorLAB = lchToLAB(lch);
            expect(lab.l).to.be.closeTo(data.lchToLabResult.l, testPrecision);
            expect(lab.a).to.be.closeTo(data.lchToLabResult.a, testPrecision);
            expect(lab.b).to.be.closeTo(data.lchToLabResult.b, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("labToLCH", () => {
        function testColor(data: any): void {
            const lab: ColorLAB = new ColorLAB(data.lab.l, data.lab.a, data.lab.b);

            const lch: ColorLCH = labToLCH(lab);
            expect(lch.l).to.be.closeTo(data.labToLCHResult.l, testPrecision);
            expect(lch.c).to.be.closeTo(data.labToLCHResult.c, testPrecision);
            expect(lch.h).to.be.closeTo(data.labToLCHResult.h, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("labToXYZ", () => {
        function testColor(data: any): void {
            const lab: ColorLAB = new ColorLAB(data.lab.l, data.lab.a, data.lab.b);

            const xyz: ColorXYZ = labToXYZ(lab);
            expect(xyz.x).to.be.closeTo(data.labToXYZResult.x, testPrecision);
            expect(xyz.y).to.be.closeTo(data.labToXYZResult.y, testPrecision);
            expect(xyz.z).to.be.closeTo(data.labToXYZResult.z, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("xyzToLAB", () => {
        function testColor(data: any): void {
            const xyz: ColorXYZ = new ColorXYZ(data.xyz.x, data.xyz.y, data.xyz.z);

            const lab: ColorLAB = xyzToLAB(xyz);
            expect(lab.l).to.be.closeTo(data.xyzToLABResult.l, testPrecision);
            expect(lab.a).to.be.closeTo(data.xyzToLABResult.a, testPrecision);
            expect(lab.b).to.be.closeTo(data.xyzToLABResult.b, testPrecision);
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
            expect(xyz.x).to.be.closeTo(data.rgbToXYZResult.x, testPrecision);
            expect(xyz.y).to.be.closeTo(data.rgbToXYZResult.y, testPrecision);
            expect(xyz.z).to.be.closeTo(data.rgbToXYZResult.z, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("xyzToRGB", () => {
        function testColor(data: any): void {
            const xyz: ColorXYZ = new ColorXYZ(data.xyz.x, data.xyz.y, data.xyz.z);

            const rgb: ColorRGBA64 = xyzToRGB(xyz);
            expect(rgb.r).to.be.closeTo(data.xyzToRGBResult.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.xyzToRGBResult.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.xyzToRGBResult.b, testPrecision);
            expect(rgb.a).to.equal(1);
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
            expect(lab.l).to.be.closeTo(data.rgbToLABResult.l, testPrecision);
            expect(lab.a).to.be.closeTo(data.rgbToLABResult.a, testPrecision);
            expect(lab.b).to.be.closeTo(data.rgbToLABResult.b, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("labToRGB", () => {
        function testColor(data: any): void {
            const lab: ColorLAB = new ColorLAB(data.lab.l, data.lab.a, data.lab.b);

            const rgb: ColorRGBA64 = labToRGB(lab);
            expect(rgb.r).to.be.closeTo(data.labToRGBResult.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.labToRGBResult.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.labToRGBResult.b, testPrecision);
            expect(rgb.a).to.equal(1);
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
            expect(lch.l).to.be.closeTo(data.rgbToLCHResult.l, testPrecision);
            expect(lch.c).to.be.closeTo(data.rgbToLCHResult.c, testPrecision);
            expect(lch.h).to.be.closeTo(data.rgbToLCHResult.h, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("lchToRGB", () => {
        function testColor(data: any): void {
            const lch: ColorLCH = new ColorLCH(data.lch.l, data.lch.c, data.lch.h);

            const rgb: ColorRGBA64 = lchToRGB(lch);
            expect(rgb.r).to.be.closeTo(data.lchToRGBResult.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.lchToRGBResult.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.lchToRGBResult.b, testPrecision);
            expect(rgb.a).to.equal(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("temperatureToRGB", () => {
        function testColor(data: any): void {
            const temp: number = data.temp;

            const rgb: ColorRGBA64 = temperatureToRGB(temp);
            expect(rgb.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb.a).to.equal(1);
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
            expect(temp).to.be.closeTo(data.temp, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
});
