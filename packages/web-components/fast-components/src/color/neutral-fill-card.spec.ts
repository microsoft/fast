import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import { neutralFillCard } from "./neutral-fill-card.js";
import { expect } from "chai";

describe("neutralFillCard", (): void => {
    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should operate on design system defaults", (): void => {
        expect(neutralFillCard({} as FASTDesignSystem)).to.equal(
            fastDesignSystemDefaults.neutralPalette[
                fastDesignSystemDefaults.neutralFillCardDelta
            ]
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
