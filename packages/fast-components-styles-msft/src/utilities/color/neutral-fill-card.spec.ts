import { Palette } from "./palette";
import { neutralPalette } from "../design-system";
import { neutralFillCardRest } from "./neutral-fill-card";
import defaultDesignSystem, { DesignSystem } from "../../design-system";

describe("neutralFillCard", (): void => {
    test("should opperate on design system defaults", (): void => {
        expect(neutralFillCardRest({} as DesignSystem)).toBe(
            defaultDesignSystem.neutralPalette[0]
        );
    });
    test("should return the color at designSystem.neutralPalette[0] when background color is the first or second step in the neutral ramp", (): void => {
        expect(
            defaultDesignSystem.neutralPalette.indexOf(
                neutralFillCardRest(
                    Object.assign({}, defaultDesignSystem, {
                        backgroundColor: defaultDesignSystem[0],
                    })
                )
            )
        ).toBe(0);
        expect(
            defaultDesignSystem.neutralPalette.indexOf(
                neutralFillCardRest(
                    Object.assign({}, defaultDesignSystem, {
                        backgroundColor: defaultDesignSystem[1],
                    })
                )
            )
        ).toBe(0);
    });
    test("should return the color at two steps lower than the background color", (): void => {
        for (let i: number = 2; i < defaultDesignSystem.neutralPalette.length; i++) {
            expect(
                defaultDesignSystem.neutralPalette.indexOf(
                    neutralFillCardRest(
                        Object.assign({}, defaultDesignSystem, {
                            backgroundColor: defaultDesignSystem.neutralPalette[i],
                        })
                    )
                )
            ).toBe(i - 2);
        }
    });
    test("should generate a color based on the background color returned by a provided callback", (): void => {
        expect(
            neutralFillCardRest(() => defaultDesignSystem.neutralPalette[4])(
                defaultDesignSystem
            )
        ).toBe(defaultDesignSystem.neutralPalette[2]);
    });
});
