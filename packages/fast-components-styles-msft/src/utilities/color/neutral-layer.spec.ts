import designSystemDefaults, { DesignSystem } from "../../design-system";
import {
    neutralLayerCard,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralLayerL1,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    StandardLuminance,
} from "./neutral-layer";

const lightModeDesignSystem: DesignSystem = Object.assign({}, designSystemDefaults, {
    baseLayerLuminance: StandardLuminance.LightMode,
});

const darkModeDesignSystem: DesignSystem = Object.assign({}, designSystemDefaults, {
    baseLayerLuminance: StandardLuminance.DarkMode,
});

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
        test("should return values from L1 when in light mode", (): void => {
            expect(neutralLayerL1(lightModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L1]
            );
        });
        test("should return values from L1 when in dark mode", (): void => {
            expect(neutralLayerL1(darkModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L1]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(neutralLayerL1((): string => "#000000")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L1]
            );
            expect(neutralLayerL1((): string => "#FFFFFF")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L1]
            );
        });
    });

    describe("L2", (): void => {
        test("should return values from L2 when in light mode", (): void => {
            expect(neutralLayerL2(lightModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L2]
            );
        });
        test("should return values from L2 when in dark mode", (): void => {
            expect(neutralLayerL2(darkModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L2]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(neutralLayerL2((): string => "#000000")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L2]
            );
            expect(neutralLayerL2((): string => "#FFFFFF")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L2]
            );
        });
    });

    describe("L3", (): void => {
        test("should return values from L3 when in light mode", (): void => {
            expect(neutralLayerL3(lightModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L3]
            );
        });
        test("should return values from L3 when in dark mode", (): void => {
            expect(neutralLayerL3(darkModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L3]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(neutralLayerL3((): string => "#000000")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L3]
            );
            expect(neutralLayerL3((): string => "#FFFFFF")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L3]
            );
        });
    });

    describe("L4", (): void => {
        test("should return values from L4 when in light mode", (): void => {
            expect(neutralLayerL4(lightModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L4]
            );
        });
        test("should return values from L4 when in dark mode", (): void => {
            expect(neutralLayerL4(darkModeDesignSystem)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L4]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(neutralLayerL4((): string => "#000000")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L4]
            );
            expect(neutralLayerL4((): string => "#FFFFFF")(designSystemDefaults)).toBe(
                designSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L4]
            );
        });
    });

    describe("neutralLayerFloating", (): void => {
        test("should return a color from the neutral palette", (): void => {
            expect(
                designSystemDefaults.neutralPalette.includes(
                    neutralLayerFloating(designSystemDefaults)
                )
            ).toBeTruthy();
        });

        test("should operate on a provided background color", (): void => {
            const color: string = neutralLayerFloating((): string => "#000000")(
                designSystemDefaults
            );

            expect(color).not.toBe(neutralLayerFloating(designSystemDefaults));
            expect(designSystemDefaults.neutralPalette.includes(color)).toBeTruthy();
        });
    });
    describe("neutralLayerCardContainer", (): void => {
        test("should return a color from the neutral palette", (): void => {
            expect(
                designSystemDefaults.neutralPalette.includes(
                    neutralLayerCardContainer(designSystemDefaults)
                )
            ).toBeTruthy();
        });
        test("should operate on a provided background color", (): void => {
            const color: string = neutralLayerCardContainer((): string => "#000000")(
                designSystemDefaults
            );

            expect(color).not.toBe(neutralLayerCardContainer(designSystemDefaults));
            expect(designSystemDefaults.neutralPalette.includes(color)).toBeTruthy();
        });
    });
    describe("neutralLayerCard", (): void => {
        test("should return a color from the neutral palette", (): void => {
            expect(
                designSystemDefaults.neutralPalette.includes(
                    neutralLayerCard(designSystemDefaults)
                )
            ).toBeTruthy();
        });
        test("should operate on a provided background color", (): void => {
            const color: string = neutralLayerCard((): string => "#000000")(
                designSystemDefaults
            );

            expect(color).not.toBe(neutralLayerCard(designSystemDefaults));
            expect(designSystemDefaults.neutralPalette.includes(color)).toBeTruthy();
        });
    });
});
