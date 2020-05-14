import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralFill,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillSelected,
} from "./neutral-fill";
import { Palette } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";

describe("neutralFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(neutralFillRest({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillFocus({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillFocusDelta]
        );
        expect(neutralFillSelected({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillSelectedDelta]
        );
    });

    test("should switch from dark to light after 10 swatches", (): void => {
        expect(neutralFillRest(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillFocus(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillFocusDelta]
        );
        expect(neutralFillRest(() => neutralPalette[1])(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta + 1]
        );
        expect(neutralFillRest(() => neutralPalette[2])(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta + 2]
        );
        expect(neutralFillRest(() => neutralPalette[9])(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta + 9]
        );
        expect(neutralFillRest(() => neutralPalette[10])(fastDesignSystemDefaults)).toBe(
            neutralPalette[3]
        );
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillRest(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillHover(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillActive(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillFocus(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillSelected(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFill(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillRest(() => swatch)(fastDesignSystemDefaults);
            const hover: Swatch = neutralFillHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillFocus(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillSelected(() => swatch)(
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
