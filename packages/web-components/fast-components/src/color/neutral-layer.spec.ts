import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    neutralLayerCard_DEPRECATED,
    neutralLayerCardContainer_DEPRECATED,
    neutralLayerFloating_DEPRECATED,
    neutralLayerL1_DEPRECATED,
    neutralLayerL2_DEPRECATED,
    neutralLayerL3_DEPRECATED,
    neutralLayerL4_DEPRECATED,
} from "./neutral-layer";
import {
    neutralLayerFloating as neutralLayerFloatingNew
} from '../color-vNext/recipes/neutral-layer-floating';
import { neutralLayerL1 as neutralLayerL1New } from "../color-vNext/recipes/neutral-layer-L1";
import { neutralLayerL2 as neutralLayerL2New } from "../color-vNext/recipes/neutral-layer-L2";
import { neutralLayerL3 as neutralLayerL3New } from "../color-vNext/recipes/neutral-layer-L3";
import { neutralLayerL4 as neutralLayerL4New } from "../color-vNext/recipes/neutral-layer-L4";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { neutralBaseColor } from "./color-constants";
import { PaletteRGB } from "../color-vNext/palette";
import { SwatchRGB } from "../color-vNext/swatch";
import { StandardLuminance } from "../color-vNext/utilities/base-layer-luminance";

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
        it("should return values from L1 when in light mode", (): void => {
            expect(neutralLayerL1_DEPRECATED(lightModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L1]
            );
        });
        it("should return values from L1 when in dark mode", (): void => {
            expect(neutralLayerL1_DEPRECATED(darkModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L1]
            );
        });
        it("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL1_DEPRECATED((): string => "#000000")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L1]
            );
            expect(
                neutralLayerL1_DEPRECATED((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L1]
            );
        });
        it("should have a new implementation that matches the old implementation", () => {
             const color = (parseColorHexRGB(neutralBaseColor)!)
            const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
            expect(neutralLayerL1_DEPRECATED(lightModeDesignSystem)).to.equal(neutralLayerL1New(palette, StandardLuminance.LightMode).toColorString().toUpperCase())
            expect(neutralLayerL1_DEPRECATED(darkModeDesignSystem)).to.equal(neutralLayerL1New(palette, StandardLuminance.DarkMode).toColorString().toUpperCase())
        })
    });

    describe("L2", (): void => {
        it("should return values from L2 when in light mode", (): void => {
            expect(neutralLayerL2_DEPRECATED(lightModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L2]
            );
        });
        it("should return values from L2 when in dark mode", (): void => {
            expect(neutralLayerL2_DEPRECATED(darkModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L2]
            );
        });
        it("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL2_DEPRECATED((): string => "#000000")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L2]
            );
            expect(
                neutralLayerL2_DEPRECATED((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L2]
            );
        });
        it("should have a new implementation that matches the old implementation", () => {
            const color = (parseColorHexRGB(neutralBaseColor)!)
            const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
            expect(neutralLayerL2_DEPRECATED(lightModeDesignSystem)).to.equal(neutralLayerL2New(
                palette,
                StandardLuminance.LightMode,
                lightModeDesignSystem.neutralFillCardDelta,
                lightModeDesignSystem.neutralFillRestDelta,
                lightModeDesignSystem.neutralFillHoverDelta,
                lightModeDesignSystem.neutralFillActiveDelta,
                ).toColorString().toUpperCase())
            expect(neutralLayerL2_DEPRECATED(darkModeDesignSystem)).to.equal(neutralLayerL2New(
                palette,
                StandardLuminance.DarkMode,
                darkModeDesignSystem.neutralFillCardDelta,
                darkModeDesignSystem.neutralFillRestDelta,
                darkModeDesignSystem.neutralFillHoverDelta,
                darkModeDesignSystem.neutralFillActiveDelta,
                ).toColorString().toUpperCase())
        });
    });

    describe("L3", (): void => {
        it("should return values from L3 when in light mode", (): void => {
            expect(neutralLayerL3_DEPRECATED(lightModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L3]
            );
        });
        it("should return values from L3 when in dark mode", (): void => {
            expect(neutralLayerL3_DEPRECATED(darkModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L3]
            );
        });
        it("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL3_DEPRECATED((): string => "#000000")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L3]
            );
            expect(
                neutralLayerL3_DEPRECATED((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L3]
            );
        });
        it("should have a new implementation that matches the old implementation", () => {
            const color = (parseColorHexRGB(neutralBaseColor)!)
            const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
            expect(neutralLayerL3_DEPRECATED(lightModeDesignSystem)).to.equal(neutralLayerL3New(
                palette,
                StandardLuminance.LightMode,
                lightModeDesignSystem.neutralFillCardDelta,
                lightModeDesignSystem.neutralFillRestDelta,
                lightModeDesignSystem.neutralFillHoverDelta,
                lightModeDesignSystem.neutralFillActiveDelta,
                ).toColorString().toUpperCase())
            expect(neutralLayerL3_DEPRECATED(darkModeDesignSystem)).to.equal(neutralLayerL3New(
                palette,
                StandardLuminance.DarkMode,
                darkModeDesignSystem.neutralFillCardDelta,
                darkModeDesignSystem.neutralFillRestDelta,
                darkModeDesignSystem.neutralFillHoverDelta,
                darkModeDesignSystem.neutralFillActiveDelta,
                ).toColorString().toUpperCase())
        });
    });

    describe("L4", (): void => {
        it("should return values from L4 when in light mode", (): void => {
            expect(neutralLayerL4_DEPRECATED(lightModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L4]
            );
        });
        it("should return values from L4 when in dark mode", (): void => {
            expect(neutralLayerL4_DEPRECATED(darkModeDesignSystem)).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L4]
            );
        });
        it("should operate on a provided background color", (): void => {
            expect(
                neutralLayerL4_DEPRECATED((): string => "#000000")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteDarkModeOffsets.L4]
            );
            expect(
                neutralLayerL4_DEPRECATED((): string => "#FFFFFF")(fastDesignSystemDefaults)
            ).to.equal(
                fastDesignSystemDefaults.neutralPalette[NeutralPaletteLightModeOffsets.L4]
            );
        });
        it("should have a new implementation that matches the old implementation", () => {
            const color = (parseColorHexRGB(neutralBaseColor)!)
            const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
            expect(neutralLayerL4_DEPRECATED(lightModeDesignSystem)).to.equal(neutralLayerL4New(
                palette,
                StandardLuminance.LightMode,
                lightModeDesignSystem.neutralFillCardDelta,
                lightModeDesignSystem.neutralFillRestDelta,
                lightModeDesignSystem.neutralFillHoverDelta,
                lightModeDesignSystem.neutralFillActiveDelta,
                ).toColorString().toUpperCase())
            expect(neutralLayerL4_DEPRECATED(darkModeDesignSystem)).to.equal(neutralLayerL4New(
                palette,
                StandardLuminance.DarkMode,
                darkModeDesignSystem.neutralFillCardDelta,
                darkModeDesignSystem.neutralFillRestDelta,
                darkModeDesignSystem.neutralFillHoverDelta,
                darkModeDesignSystem.neutralFillActiveDelta,
                ).toColorString().toUpperCase())
        });
    });

    describe("neutralLayerFloating", (): void => {
        it("should return a color from the neutral palette", (): void => {
            expect(
                fastDesignSystemDefaults.neutralPalette.includes(
                    neutralLayerFloating_DEPRECATED(fastDesignSystemDefaults)
                )
            ).to.be.ok;
        });

        it("should operate on a provided background color", (): void => {
            const color: string = neutralLayerFloating_DEPRECATED((): string => "#FFFFFF")(
                fastDesignSystemDefaults
            );

            expect(color).not.to.equal(neutralLayerFloating_DEPRECATED(fastDesignSystemDefaults));
            expect(fastDesignSystemDefaults.neutralPalette.includes(color)).to.be.ok;
        });
        
        it("should have a new implementation that matches the old implementation", () => {
             const color = (parseColorHexRGB(neutralBaseColor)!)
            const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
            expect(neutralLayerFloating_DEPRECATED(lightModeDesignSystem)).to.equal(neutralLayerFloatingNew(palette, StandardLuminance.LightMode, lightModeDesignSystem.neutralFillCardDelta).toColorString().toUpperCase())
            expect(neutralLayerFloating_DEPRECATED(darkModeDesignSystem)).to.equal(neutralLayerFloatingNew(palette, StandardLuminance.DarkMode, lightModeDesignSystem.neutralFillCardDelta).toColorString().toUpperCase())
        })
    });
    describe("neutralLayerCardContainer", (): void => {
        it("should return a color from the neutral palette", (): void => {
            expect(
                fastDesignSystemDefaults.neutralPalette.includes(
                    neutralLayerCardContainer_DEPRECATED(fastDesignSystemDefaults)
                )
            ).to.be.ok;
        });
        it("should operate on a provided background color", (): void => {
            const color: string = neutralLayerCardContainer_DEPRECATED((): string => "#FFFFFF")(
                fastDesignSystemDefaults
            );

            expect(color).not.to.equal(
                neutralLayerCardContainer_DEPRECATED(fastDesignSystemDefaults)
            );
            expect(fastDesignSystemDefaults.neutralPalette.includes(color)).to.be.ok;
        });
    });
    describe("neutralLayerCard", (): void => {
        it("should return a color from the neutral palette", (): void => {
            expect(
                fastDesignSystemDefaults.neutralPalette.includes(
                    neutralLayerCard_DEPRECATED(fastDesignSystemDefaults)
                )
            ).to.be.ok;
        });
        it("should operate on a provided background color", (): void => {
            const color: string = neutralLayerCard_DEPRECATED((): string => "#FFFFFF")(
                fastDesignSystemDefaults
            );

            expect(color).not.to.equal(neutralLayerCard_DEPRECATED(fastDesignSystemDefaults));
            expect(fastDesignSystemDefaults.neutralPalette.includes(color)).to.be.ok;
        });
    });
});
