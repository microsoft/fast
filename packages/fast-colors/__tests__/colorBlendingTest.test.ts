// tslint:disable:no-string-literal
// tslint:disable:no-console
// tslint:disable:forin

import {
    blendBurn,
    blendDarken,
    blendDodge,
    blendLighten,
    blendMultiply,
    blendOverlay,
    blendScreen,
    ColorRGBA64,
    computeAlphaBlend,
    darkenViaLAB,
    desaturateViaLCH,
    lightenViaLAB,
    saturateViaLCH,
} from "../src/colorlib";

import { testData } from "../testData";

const testPrecision: number = 4;

describe("Color blending functions", () => {
    test("saturateViaLCH", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).toBeDefined();

            for (const op of data.saturateViaLCH) {
                const final: ColorRGBA64 = saturateViaLCH(rgb!, op.factor);
                expect(final!.r).toBeCloseTo(op.r, testPrecision);
                expect(final!.g).toBeCloseTo(op.g, testPrecision);
                expect(final!.b).toBeCloseTo(op.b, testPrecision);
                expect(final!.a).toBe(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("desaturateViaLCH", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).toBeDefined();

            for (const op of data.desaturateViaLCH) {
                const final: ColorRGBA64 = desaturateViaLCH(rgb!, op.factor);
                expect(final!.r).toBeCloseTo(op.r, testPrecision);
                expect(final!.g).toBeCloseTo(op.g, testPrecision);
                expect(final!.b).toBeCloseTo(op.b, testPrecision);
                expect(final!.a).toBe(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("darkenViaLAB", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).toBeDefined();

            for (const op of data.darkenViaLAB) {
                const final: ColorRGBA64 = darkenViaLAB(rgb!, op.factor);
                expect(final!.r).toBeCloseTo(op.r, testPrecision);
                expect(final!.g).toBeCloseTo(op.g, testPrecision);
                expect(final!.b).toBeCloseTo(op.b, testPrecision);
                expect(final!.a).toBe(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("lightenViaLAB", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).toBeDefined();

            for (const op of data.lightenViaLAB) {
                const final: ColorRGBA64 = lightenViaLAB(rgb!, op.factor);
                expect(final!.r).toBeCloseTo(op.r, testPrecision);
                expect(final!.g).toBeCloseTo(op.g, testPrecision);
                expect(final!.b).toBeCloseTo(op.b, testPrecision);
                expect(final!.a).toBe(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("blendBurn", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendBurn(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendBurn.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendBurn.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendBurn.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendBurn.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendDarken", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendDarken(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendDarken.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendDarken.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendDarken.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendDarken.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendDodge", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendDodge(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendDodge.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendDodge.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendDodge.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendDodge.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendLighten", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendLighten(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendLighten.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendLighten.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendLighten.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendLighten.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendMultiply", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendMultiply(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendMultiply.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendMultiply.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendMultiply.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendMultiply.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendOverlay", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendOverlay(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendOverlay.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendOverlay.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendOverlay.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendOverlay.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendScreen", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = blendScreen(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.blendScreen.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.blendScreen.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.blendScreen.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.blendScreen.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("computeAlphaBlend", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).toBeDefined();
            expect(top).toBeDefined();

            const blended: ColorRGBA64 = computeAlphaBlend(bottom!, top!);
            expect(blended!.r).toBeCloseTo(data.alpha.r, testPrecision);
            expect(blended!.g).toBeCloseTo(data.alpha.g, testPrecision);
            expect(blended!.b).toBeCloseTo(data.alpha.b, testPrecision);
            expect(blended!.a).toBeCloseTo(data.alpha.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });
});
