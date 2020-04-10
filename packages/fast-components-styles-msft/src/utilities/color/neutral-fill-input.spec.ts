import designSystemDefaults, { DesignSystem } from "../../design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../design-system";
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
    const neutralPalette: Palette = getNeutralPalette(designSystemDefaults);
    const accentPalette: Palette = getAccentPalette(designSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(neutralFillInputRest({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputHover({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputActive({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputFocus({} as DesignSystem)).toBe(neutralPalette[0]);
        expect(neutralFillInputSelected({} as DesignSystem)).toBe(neutralPalette[0]);
    });

    test("should always be lighter than the background by the delta in light mode and darker in dark mode", (): void => {
        neutralPalette.forEach((swatch: Swatch, index: number): void => {
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
        });
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
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
            expect(neutralFillInputFocus(() => swatch)(designSystemDefaults)).toBe(
                neutralFillInputFocus(
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
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFillInput(() => swatch)(
                designSystemDefaults
            );
            const rest: Swatch = neutralFillInputRest(() => swatch)(designSystemDefaults);
            const hover: Swatch = neutralFillInputHover(() => swatch)(
                designSystemDefaults
            );
            const active: Swatch = neutralFillInputActive(() => swatch)(
                designSystemDefaults
            );
            const focus: Swatch = neutralFillInputFocus(() => swatch)(
                designSystemDefaults
            );
            const selected: Swatch = neutralFillInputSelected(() => swatch)(
                designSystemDefaults
            );

            expect(backplates.rest).toBe(rest);
            expect(backplates.hover).toBe(hover);
            expect(backplates.active).toBe(active);
            expect(backplates.focus).toBe(focus);
            expect(backplates.selected).toBe(selected);
        });
    });
});
