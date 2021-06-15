import { expect } from "chai";
import { PaletteRGB } from "../palette";
import { StandardLuminance } from "../utilities/base-layer-luminance";
import { middleGrey } from "../utilities/color-constants";
import {
    neutralLayerFloating
} from './neutral-layer-floating';
import { neutralLayerL1 } from "./neutral-layer-L1";
import { neutralLayerL2 } from "./neutral-layer-L2";
import { neutralLayerL3 } from "./neutral-layer-L3";
import { neutralLayerL4 } from "./neutral-layer-L4";

const neutralPalette = PaletteRGB.create(middleGrey);

const enum NeutralPaletteLightModeOffsets {
    L1 = 0,
    L2 = 10,
    L3 = 13,
    L4 = 16,
}

const enum NeutralPaletteDarkModeOffsets {
    L1 = 76,
    L2 = 79,
    L3 = 82,
    L4 = 85,
}

describe("neutralLayer", (): void => {
    describe("L1", (): void => {
        it("should return values from L1 when in light mode", (): void => {
            expect(neutralLayerL1(neutralPalette, StandardLuminance.LightMode)).to.equal(neutralPalette.get(NeutralPaletteLightModeOffsets.L1))
        });
        it("should return values from L1 when in dark mode", (): void => {
            expect(neutralLayerL1(neutralPalette, StandardLuminance.DarkMode)).to.equal(neutralPalette.get(NeutralPaletteDarkModeOffsets.L1))
        });
    });

    describe("L2", (): void => {
        it("should return values from L2 when in light mode", (): void => {
            expect(neutralLayerL2(neutralPalette, StandardLuminance.LightMode, 3, 7, 10, 5)).to.equal(neutralPalette.get(NeutralPaletteLightModeOffsets.L2))
        });
        it("should return values from L2 when in dark mode", (): void => {
            expect(neutralLayerL2(neutralPalette, StandardLuminance.DarkMode, 3, 7, 10, 5)).to.equal(neutralPalette.get(NeutralPaletteDarkModeOffsets.L2))
        });
    });

    describe("L3", (): void => {
        it("should return values from L3 when in light mode", (): void => {
            expect(neutralLayerL3(neutralPalette, StandardLuminance.LightMode, 3, 7, 10, 5)).to.equal(neutralPalette.get(NeutralPaletteLightModeOffsets.L3))
        });
        it("should return values from L3 when in dark mode", (): void => {
            expect(neutralLayerL3(neutralPalette, StandardLuminance.DarkMode, 3, 7, 10, 5)).to.equal(neutralPalette.get(NeutralPaletteDarkModeOffsets.L3))
        });
    });

    describe("L4", (): void => {
        it("should return values from L4 when in light mode", (): void => {
            expect(neutralLayerL4(neutralPalette, StandardLuminance.LightMode, 3, 7, 10, 5)).to.equal(neutralPalette.get(NeutralPaletteLightModeOffsets.L4))
        });
        it("should return values from L4 when in dark mode", (): void => {
            expect(neutralLayerL4(neutralPalette, StandardLuminance.DarkMode, 3, 7, 10, 5)).to.equal(neutralPalette.get(NeutralPaletteDarkModeOffsets.L4))
        });
    });

    describe("neutralLayerFloating", (): void => {
        it("should return a color from the neutral palette", (): void => {
            expect(neutralPalette.swatches.includes(neutralLayerFloating(neutralPalette, StandardLuminance.LightMode, 3))).to.be.true;
        });
    });
});
