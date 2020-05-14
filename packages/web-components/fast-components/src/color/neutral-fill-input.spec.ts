import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import { clamp, FillSwatchFamily, Swatch } from "./common";
import {
    neutralFillInput,
    neutralFillInputActive,
    neutralFillInputFocus,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillInputSelected,
} from "./neutral-fill-input";
import { isDarkMode, Palette } from "./palette";

describe("neutralFillInput", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(neutralFillInputRest({} as FASTDesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputHover({} as FASTDesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputActive({} as FASTDesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputFocus({} as FASTDesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputSelected({} as FASTDesignSystem)).toBe(neutralPalette[0]);
    });

    test("should always be lighter than the background by the delta in light mode and darker in dark mode", (): void => {
        neutralPalette.forEach((swatch: Swatch, index: number): void => {
            const designSystem: FASTDesignSystem = {
                backgroundColor: neutralPalette[index],
            } as FASTDesignSystem;

            expect(neutralFillInputSelected(designSystem)).toBe(
                neutralPalette[
                    clamp(
                        index -
                            fastDesignSystemDefaults.neutralFillInputRestDelta *
                                (isDarkMode(designSystem) ? -1 : 1),
                        0,
                        neutralPalette.length - 1
                    )
                ]
            );
        });
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillInputRest(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillInputRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillInputHover(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillInputHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillInputActive(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillInputActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillInputFocus(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillInputFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillInputSelected(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillInputSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFillInput(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillInputRest(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralFillInputHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillInputActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillInputFocus(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillInputSelected(() => swatch)(
                fastDesignSystemDefaults
            );

            expect(backplates.rest).toBe(rest);
            expect(backplates.hover).toBe(hover);
            expect(backplates.active).toBe(active);
            expect(backplates.focus).toBe(focus);
            expect(backplates.selected).toBe(selected);
        });
    });
});
