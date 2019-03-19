import {
    neutralFillStealth,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
} from "./neutral-fill-stealth";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { palette, Palette, PaletteType } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";

describe("neutralFillStealth", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(neutralFillStealthRest({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthRestDelta]
        );
        expect(neutralFillStealthHover({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(neutralFillStealthActive({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthActiveDelta]
        );
        expect(neutralFillStealthSelected({} as DesignSystem)).toBe(
            neutralPalette[
                designSystemDefaults.neutralFillStealthRestDelta +
                    designSystemDefaults.neutralFillStealthSelectedDelta
            ]
        );
    });

    test("should switch from dark to light after 4 swatches", (): void => {
        expect(neutralFillStealthHover(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(
            neutralFillStealthHover(() => neutralPalette[1])(designSystemDefaults)
        ).toBe(neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta + 1]);
        expect(
            neutralFillStealthHover(() => neutralPalette[2])(designSystemDefaults)
        ).toBe(neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta + 2]);
        expect(
            neutralFillStealthHover(() => neutralPalette[3])(designSystemDefaults)
        ).toBe(neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta + 3]);
        expect(
            neutralFillStealthHover(() => neutralPalette[4])(designSystemDefaults)
        ).toBe(neutralPalette[4 - designSystemDefaults.neutralFillStealthHoverDelta]);
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                expect(neutralFillStealthRest(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillStealthRest(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillStealthHover(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillStealthHover(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(neutralFillStealthActive(() => swatch)(designSystemDefaults)).toBe(
                    neutralFillStealthActive(
                        Object.assign({}, designSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                );
                expect(
                    neutralFillStealthSelected(() => swatch)(designSystemDefaults)
                ).toBe(
                    neutralFillStealthSelected(
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
                const backplates: FillSwatchFamily = neutralFillStealth(() => swatch)(
                    designSystemDefaults
                );
                const rest: Swatch = neutralFillStealthRest(() => swatch)(
                    designSystemDefaults
                );
                const hover: Swatch = neutralFillStealthHover(() => swatch)(
                    designSystemDefaults
                );
                const active: Swatch = neutralFillStealthActive(() => swatch)(
                    designSystemDefaults
                );
                const selected: Swatch = neutralFillStealthSelected(() => swatch)(
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
