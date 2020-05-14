import { isColorStringHexRGB } from "@microsoft/fast-colors";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralOutline,
    neutralOutlineActive,
    neutralOutlineFocus,
    neutralOutlineHover,
    neutralOutlineRest,
} from "./neutral-outline";
import { Palette } from "./palette";
import { Swatch, SwatchFamily } from "./common";

describe("neutralOutline", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    xtest("should return by default", (): void => {
        expect(neutralOutlineRest({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralOutlineRestDelta]
        );
        expect(neutralOutlineHover({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralOutlineHoverDelta]
        );
        expect(neutralOutlineActive({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralOutlineActiveDelta]
        );
        expect(neutralOutlineFocus({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralOutlineFocusDelta]
        );
    });

    test("should always return a color", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                isColorStringHexRGB(
                    neutralOutlineRest(() => swatch)({} as FASTDesignSystem)
                )
            ).toBe(true);
        });
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralOutlineRest(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralOutlineRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineHover(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralOutlineHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineActive(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralOutlineActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineFocus(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralOutlineFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: SwatchFamily = neutralOutline(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralOutlineRest(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralOutlineHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralOutlineActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralOutlineFocus(() => swatch)(
                fastDesignSystemDefaults
            );

            expect(backplates.rest).toBe(rest);
            expect(backplates.hover).toBe(hover);
            expect(backplates.active).toBe(active);
            expect(backplates.focus).toBe(focus);
        });
    });
});
