import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { neutralFillCard } from "./neutral-fill-card";

describe("neutralFillCard", (): void => {
    test("should operate on design system defaults", (): void => {
        expect(neutralFillCard({} as FASTDesignSystem)).toBe(
            fastDesignSystemDefaults.neutralPalette[
                fastDesignSystemDefaults.neutralFillCardDelta
            ]
        );
    });
    test("should get darker when the index of the backgroundColor is lower than the offset index", (): void => {
        for (let i: number = 0; i < fastDesignSystemDefaults.neutralFillCardDelta; i++) {
            expect(
                fastDesignSystemDefaults.neutralPalette.indexOf(
                    neutralFillCard(
                        Object.assign({}, fastDesignSystemDefaults, {
                            backgroundColor: fastDesignSystemDefaults.neutralPalette[i],
                        })
                    )
                )
            ).toBe(fastDesignSystemDefaults.neutralFillCardDelta + i);
        }
    });
    test("should return the color at three steps lower than the background color", (): void => {
        for (let i: number = 3; i < fastDesignSystemDefaults.neutralPalette.length; i++) {
            expect(
                fastDesignSystemDefaults.neutralPalette.indexOf(
                    neutralFillCard(
                        Object.assign({}, fastDesignSystemDefaults, {
                            backgroundColor: fastDesignSystemDefaults.neutralPalette[i],
                        })
                    )
                )
            ).toBe(i - 3);
        }
    });
    test("should generate a color based on the background color returned by a provided callback", (): void => {
        expect(
            neutralFillCard(() => fastDesignSystemDefaults.neutralPalette[4])(
                fastDesignSystemDefaults
            )
        ).toBe(fastDesignSystemDefaults.neutralPalette[1]);
    });
});
