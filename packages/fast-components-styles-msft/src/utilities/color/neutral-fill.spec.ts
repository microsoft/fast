import {
    neutralFill,
    neutralFillActive,
    neutralFillDeltaActive,
    neutralFillDeltaHover,
    neutralFillDeltaRest,
    neutralFillHover,
    neutralFillRest,
} from "./neutral-fill";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { palette, Palette, PaletteType, Swatch } from "./palette";
import { StatefulSwatch } from "./common";

describe("neutralFill", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(neutralFillRest({} as DesignSystem)).toBe(
            neutralPalette[neutralFillDeltaRest]
        );
        expect(neutralFillHover({} as DesignSystem)).toBe(
            neutralPalette[neutralFillDeltaHover]
        );
        expect(neutralFillActive({} as DesignSystem)).toBe(
            neutralPalette[neutralFillDeltaActive]
        );
    });

    test("should switch from dark to light after 4 swatches", (): void => {
        expect(neutralFillRest(designSystemDefaults)).toBe("#EFEFEF");
        expect(neutralFillHover(designSystemDefaults)).toBe("#F3F3F3");
        expect(neutralFillActive(designSystemDefaults)).toBe("#F7F7F7");
        expect(neutralFillRest(() => neutralPalette[1])(designSystemDefaults)).toBe(
            "#EAEAEA"
        );
        expect(neutralFillRest(() => neutralPalette[2])(designSystemDefaults)).toBe(
            "#E6E6E6"
        );
        expect(neutralFillRest(() => neutralPalette[3])(designSystemDefaults)).toBe(
            "#E2E2E2"
        );
        expect(neutralFillRest(() => neutralPalette[4])(designSystemDefaults)).toBe(
            "#FFFFFF"
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
            }
        );
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach(
            (swatch: Swatch): void => {
                const backplates: StatefulSwatch = neutralFill(() => swatch)(
                    designSystemDefaults
                );
                const rest: Swatch = neutralFillRest(() => swatch)(designSystemDefaults);
                const hover: Swatch = neutralFillHover(() => swatch)(
                    designSystemDefaults
                );
                const active: Swatch = neutralFillActive(() => swatch)(
                    designSystemDefaults
                );

                expect(backplates.rest).toBe(rest);
                expect(backplates.hover).toBe(hover);
                expect(backplates.active).toBe(active);
            }
        );
    });
});
