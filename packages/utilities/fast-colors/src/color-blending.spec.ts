import chai from "chai";
import { test } from "mocha";
import { testData } from "./__test__/testData.js";
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
} from "./index.js";
const expect = chai.expect;
const testPrecision: number = 4;

describe("Color blending functions", () => {
    test("saturateViaLCH", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).not.to.be.undefined;

            for (const op of data.saturateViaLCH) {
                const final: ColorRGBA64 = saturateViaLCH(rgb!, op.factor);
                expect(final!.r).to.be.closeTo(op.r, testPrecision);
                expect(final!.g).to.be.closeTo(op.g, testPrecision);
                expect(final!.b).to.be.closeTo(op.b, testPrecision);
                expect(final!.a).to.equal(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("desaturateViaLCH", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).not.to.be.undefined;

            for (const op of data.desaturateViaLCH) {
                const final: ColorRGBA64 = desaturateViaLCH(rgb!, op.factor);
                expect(final!.r).to.be.closeTo(op.r, testPrecision);
                expect(final!.g).to.be.closeTo(op.g, testPrecision);
                expect(final!.b).to.be.closeTo(op.b, testPrecision);
                expect(final!.a).to.equal(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("darkenViaLAB", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).not.to.be.undefined;

            for (const op of data.darkenViaLAB) {
                const final: ColorRGBA64 = darkenViaLAB(rgb!, op.factor);
                expect(final!.r).to.be.closeTo(op.r, testPrecision);
                expect(final!.g).to.be.closeTo(op.g, testPrecision);
                expect(final!.b).to.be.closeTo(op.b, testPrecision);
                expect(final!.a).to.equal(1);
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("lightenViaLAB", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(rgb).not.to.be.undefined;

            for (const op of data.lightenViaLAB) {
                const final: ColorRGBA64 = lightenViaLAB(rgb!, op.factor);
                expect(final!.r).to.be.closeTo(op.r, testPrecision);
                expect(final!.g).to.be.closeTo(op.g, testPrecision);
                expect(final!.b).to.be.closeTo(op.b, testPrecision);
                expect(final!.a).to.equal(1);
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
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendBurn(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendBurn.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendBurn.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendBurn.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendBurn.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendDarken", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendDarken(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendDarken.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendDarken.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendDarken.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendDarken.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendDodge", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendDodge(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendDodge.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendDodge.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendDodge.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendDodge.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendLighten", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendLighten(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendLighten.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendLighten.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendLighten.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendLighten.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendMultiply", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendMultiply(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendMultiply.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendMultiply.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendMultiply.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendMultiply.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendOverlay", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendOverlay(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendOverlay.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendOverlay.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendOverlay.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendOverlay.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("blendScreen", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = blendScreen(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.blendScreen.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.blendScreen.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.blendScreen.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.blendScreen.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });

    test("computeAlphaBlend", () => {
        function testColor(data: any): void {
            const bottom: ColorRGBA64 | null = ColorRGBA64.fromObject(data.bottom);
            const top: ColorRGBA64 | null = ColorRGBA64.fromObject(data.top);
            expect(bottom).not.to.be.undefined;
            expect(top).not.to.be.undefined;

            const blended: ColorRGBA64 = computeAlphaBlend(bottom!, top!);
            expect(blended!.r).to.be.closeTo(data.alpha.r, testPrecision);
            expect(blended!.g).to.be.closeTo(data.alpha.g, testPrecision);
            expect(blended!.b).to.be.closeTo(data.alpha.b, testPrecision);
            expect(blended!.a).to.be.closeTo(data.alpha.a, testPrecision);
        }
        for (const data of testData.colorPairs) {
            testColor(data);
        }
    });
});
