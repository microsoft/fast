import {
    neutralFill,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillSelected,
} from "./neutral-fill";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { palette, Palette, PaletteType } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";

describe("neutralFill", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(neutralFillRest({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillSelected({} as DesignSystem)).toBe(
            neutralPalette[
                designSystemDefaults.neutralFillRestDelta +
                    designSystemDefaults.neutralFillSelectedDelta
            ]
        );
    });

    test("should switch from dark to light after 4 swatches", (): void => {
        expect(neutralFillRest(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillRest(() => neutralPalette[1])(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta + 1]
        );
        expect(neutralFillRest(() => neutralPalette[2])(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta + 2]
        );
        expect(neutralFillRest(() => neutralPalette[3])(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta + 3]
        );
        expect(neutralFillRest(() => neutralPalette[4])(designSystemDefaults)).toBe(
            neutralPalette[0]
        );
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                expect(neutralFillRest(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillRest(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillHover(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillHover(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillActive(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillActive(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillSelected(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillSelected(
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
                const backplates: FillSwatchFamily = neutralFill(() => swatch)(
                    designSystemDefaults
                );
                const rest: Swatch = neutralFillRest(() => swatch)(designSystemDefaults);
                const hover: Swatch = neutralFillHover(() => swatch)(
                    designSystemDefaults
                );
                const active: Swatch = neutralFillActive(() => swatch)(
                    designSystemDefaults
                );
                const selected: Swatch = neutralFillSelected(() => swatch)(
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
