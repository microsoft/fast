import {
    neutralFillInput,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillInputSelected,
} from "./neutral-fill-input";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { isDarkMode, palette, Palette, PaletteType } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";
import { clamp } from "lodash-es";

describe("neutralFillInput", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(neutralFillInputRest({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputHover({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputActive({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputSelected({} as DesignSystem)).toBe(neutralPalette[0]);
    });

    test("should always be lighter than the background by the delta in light mode and darker in dark mode", (): void => {
        neutralPalette.forEach(
            (swatch: Swatch, index: number): void => {
                const designSystem: DesignSystem = {
                    backgroundColor: neutralPalette[index],
                } as DesignSystem;

                expect(neutralFillInputSelected(designSystem)).toBe(
                    neutralPalette[
                        clamp(
                            index -
                                designSystemDefaults.neutralFillInputRestDelta *
                                    (isDarkMode(designSystem) ? -1 : 1),
                            0,
                            neutralPalette.length - 1
                        )
                    ]
                );
            }
        );
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                expect(neutralFillInputRest(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillInputRest(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillInputHover(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillInputHover(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillInputActive(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillInputActive(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillInputSelected(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillInputSelected(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
            }
        );
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                const backplates: FillSwatchFamily = neutralFillInput(() => swatch)(
                    designSystemDefaults
                );
                const rest: Swatch = neutralFillInputRest(() => swatch)(
                    designSystemDefaults
                );
                const hover: Swatch = neutralFillInputHover(() => swatch)(
                    designSystemDefaults
                );
                const active: Swatch = neutralFillInputActive(() => swatch)(
                    designSystemDefaults
                );
                const selected: Swatch = neutralFillInputSelected(() => swatch)(
                    designSystemDefaults
                );

                expect(backplates.rest).toBe(rest);
                expect(backplates.hover).toBe(hover);
                expect(backplates.active).toBe(active);
                expect(backplates.selected).toBe(selected);
            }
        );
    });
});
