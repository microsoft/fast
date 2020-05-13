import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
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

const lightModeDesignSystem: FASTDesignSystem = Object.assign(
    {},
    fastDesignSystemDefaults,
    {
        baseLayerLuminance: StandardLuminance.LightMode,
    }
);

const darkModeDesignSystem: FASTDesignSystem = Object.assign(
    {},
    fastDesignSystemDefaults,
    {
        baseLayerLuminance: StandardLuminance.DarkMode,
    }
);

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
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L1]
            );
        });
        test("should return values from L1 when in dark mode", (): void => {
            expect(neutralLayerL1(darkModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L1]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL1((): string => "#000000")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L1]
            );
            expect(
                neutralLayerL1((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L1]
            );
        });
    });

    describe("L2", (): void => {
        test("should return values from L2 when in light mode", (): void => {
            expect(neutralLayerL2(lightModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L2]
            );
        });
        test("should return values from L2 when in dark mode", (): void => {
            expect(neutralLayerL2(darkModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L2]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL2((): string => "#000000")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L2]
            );
            expect(
                neutralLayerL2((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L2]
            );
        });
    });

    describe("L3", (): void => {
        test("should return values from L3 when in light mode", (): void => {
            expect(neutralLayerL3(lightModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L3]
            );
        });
        test("should return values from L3 when in dark mode", (): void => {
            expect(neutralLayerL3(darkModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L3]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL3((): string => "#000000")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L3]
            );
            expect(
                neutralLayerL3((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L3]
            );
        });
    });

    describe("L4", (): void => {
        test("should return values from L4 when in light mode", (): void => {
            expect(neutralLayerL4(lightModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L4]
            );
        });
        test("should return values from L4 when in dark mode", (): void => {
            expect(neutralLayerL4(darkModeDesignSystem)).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L4]
            );
        });
        test("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL4((): string => "#000000")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L4]
            );
            expect(
                neutralLayerL4((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).toBe(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L4]
            );
        });
    });

    describe("neutralLayerFloating", (): void => {
        test("should return a color from the neutral palette", (): void => {
            expect(
                fastDesignSystemDefaults.neutralPalette.includes(
                    neutralLayerFloating(fastDesignSystemDefaults)
                )
            ).toBeTruthy();
        });

        test("should operate on a provided background color", (): void => {
            const color: string = neutralLayerFloating((): string => "#000000")(
                fastDesignSystemDefaults
            );

            expect(color).not.toBe(neutralLayerFloating(fastDesignSystemDefaults));
            expect(fastDesignSystemDefaults.neutralPalette.includes(color)).toBeTruthy();
        });
    });
    describe("neutralLayerCardContainer", (): void => {
        test("should return a color from the neutral palette", (): void => {
            expect(
                fastDesignSystemDefaults.neutralPalette.includes(
                    neutralLayerCardContainer(fastDesignSystemDefaults)
                )
            ).toBeTruthy();
        });
        test("should operate on a provided background color", (): void => {
            const color: string = neutralLayerCardContainer((): string => "#000000")(
                fastDesignSystemDefaults
            );

            expect(color).not.toBe(neutralLayerCardContainer(fastDesignSystemDefaults));
            expect(fastDesignSystemDefaults.neutralPalette.includes(color)).toBeTruthy();
        });
    });
    describe("neutralLayerCard", (): void => {
        test("should return a color from the neutral palette", (): void => {
            expect(
                fastDesignSystemDefaults.neutralPalette.includes(
                    neutralLayerCard(fastDesignSystemDefaults)
                )
            ).toBeTruthy();
        });
        test("should operate on a provided background color", (): void => {
            const color: string = neutralLayerCard((): string => "#000000")(
                fastDesignSystemDefaults
            );

            expect(color).not.toBe(neutralLayerCard(fastDesignSystemDefaults));
            expect(fastDesignSystemDefaults.neutralPalette.includes(color)).toBeTruthy();
        });
    });
});
