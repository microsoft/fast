import {
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    NeutralPaletteDarkModeLayers,
    NeutralPaletteLightModeLayers,
} from "./neutral-layer";
import designSystemDefaults, { DesignSystem } from "../../design-system";

const darkThemeDesignSystem: DesignSystem = Object.assign({}, designSystemDefaults, {
    backgroundColor: "#000000",
});

describe("neutralLayer", (): void => {
    describe("L1", (): void => {
        test("should return values from L1 when in light mode", (): void => {
            expect(neutralLayerL1(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeLayers.L1]
            );
        });
        test("should return values from L1 when in dark mode", (): void => {
            expect(neutralLayerL1(darkThemeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeLayers.L1]
            );
        });
    });

    describe("L1Alt", (): void => {
        test("should return values from L1Alt when in light mode", (): void => {
            expect(neutralLayerL1Alt(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeLayers.L1Alt]
            );
        });
        test("should return values from L1Alt when in dark mode", (): void => {
            expect(neutralLayerL1Alt(darkThemeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeLayers.L1Alt]
            );
        });
    });

    describe("L2", (): void => {
        test("should return values from L2 when in light mode", (): void => {
            expect(neutralLayerL2(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeLayers.L2]
            );
        });
        test("should return values from L2 when in dark mode", (): void => {
            expect(neutralLayerL2(darkThemeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeLayers.L2]
            );
        });
    });

    describe("L3", (): void => {
        test("should return values from L3 when in light mode", (): void => {
            expect(neutralLayerL3(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeLayers.L3]
            );
        });
        test("should return values from L3 when in dark mode", (): void => {
            expect(neutralLayerL3(darkThemeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeLayers.L3]
            );
        });
    });

    describe("L4", (): void => {
        test("should return values from L4 when in light mode", (): void => {
            expect(neutralLayerL4(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeLayers.L4]
            );
        });
        test("should return values from L4 when in dark mode", (): void => {
            expect(neutralLayerL4(darkThemeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeLayers.L4]
            );
        });
    });
});
