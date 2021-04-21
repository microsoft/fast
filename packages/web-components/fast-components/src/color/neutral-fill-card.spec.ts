import { parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { PaletteRGB } from "../color-2/palette";
import { SwatchRGB } from "../color-2/swatch";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { neutralBaseColor } from "./color-constants";
import { neutralFillCard } from "./neutral-fill-card";
import { neutralFillCard as neutralFillCardNew } from "../color-2/recipes/neutral-fill-card"

describe("neutralFillCard", (): void => {
    it("should operate on design system defaults", (): void => {
        expect(fastDesignSystemDefaults.neutralPalette).to.include(
            neutralFillCard({} as FASTDesignSystem)
        );
    });
    it("should get darker when the index of the backgroundColor is lower than the offset index", (): void => {
        for (let i: number = 0; i < fastDesignSystemDefaults.neutralFillCardDelta; i++) {
            expect(
                fastDesignSystemDefaults.neutralPalette.indexOf(
                    neutralFillCard(
                        Object.assign({}, fastDesignSystemDefaults, {
                            backgroundColor: fastDesignSystemDefaults.neutralPalette[i],
                        })
                    )
                )
            ).to.equal(fastDesignSystemDefaults.neutralFillCardDelta + i);
        }
    });
    it("should return the color at three steps lower than the background color", (): void => {
        for (let i: number = 3; i < fastDesignSystemDefaults.neutralPalette.length; i++) {
            expect(
                fastDesignSystemDefaults.neutralPalette.indexOf(
                    neutralFillCard(
                        Object.assign({}, fastDesignSystemDefaults, {
                            backgroundColor: fastDesignSystemDefaults.neutralPalette[i],
                        })
                    )
                )
            ).to.equal(i - 3);
        }
    });
    it("should generate a color based on the background color returned by a provided callback", (): void => {
        expect(
            neutralFillCard(() => fastDesignSystemDefaults.neutralPalette[4])(
                fastDesignSystemDefaults
            )
        ).to.equal(fastDesignSystemDefaults.neutralPalette[1]);
    });
});
describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(neutralBaseColor)!)
    const palette = new PaletteRGB(new SwatchRGB(color.r, color.g, color.b));
    const { neutralFillCardDelta } = fastDesignSystemDefaults;
    palette.swatches.forEach(( newSwatch, index ) => {
            it(`should be the same for ${newSwatch}`, () => {
                expect(
                    neutralFillCard({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]})
                ).to.be.equal(neutralFillCardNew( palette, newSwatch, neutralFillCardDelta).toColorString().toUpperCase())
        });
    })
})