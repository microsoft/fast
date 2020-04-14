import defaultDesignSystem, { DesignSystem } from "../../design-system";
import { neutralFillCard } from "./neutral-fill-card";

describe("neutralFillCard", (): void => {
    test("should operate on design system defaults", (): void => {
        expect(neutralFillCard({} as DesignSystem)).toBe(
            defaultDesignSystem.neutralPalette[defaultDesignSystem.neutralFillCardDelta]
        );
    });
    test("should get darker when the index of the backgroundColor is lower than the offset index", (): void => {
        for (let i: number = 0; i < defaultDesignSystem.neutralFillCardDelta; i++) {
            expect(
                defaultDesignSystem.neutralPalette.indexOf(
                    neutralFillCard(
                        Object.assign({}, defaultDesignSystem, {
                            backgroundColor: defaultDesignSystem.neutralPalette[i],
                        })
                    )
                )
            ).toBe(defaultDesignSystem.neutralFillCardDelta + i);
        }
    });
    test("should return the color at three steps lower than the background color", (): void => {
        for (let i: number = 3; i < defaultDesignSystem.neutralPalette.length; i++) {
            expect(
                defaultDesignSystem.neutralPalette.indexOf(
                    neutralFillCard(
                        Object.assign({}, defaultDesignSystem, {
                            backgroundColor: defaultDesignSystem.neutralPalette[i],
                        })
                    )
                )
            ).toBe(i - 3);
        }
    });
    test("should generate a color based on the background color returned by a provided callback", (): void => {
        expect(
            neutralFillCard(() => defaultDesignSystem.neutralPalette[4])(
                defaultDesignSystem
            )
        ).toBe(defaultDesignSystem.neutralPalette[1]);
    });
});
