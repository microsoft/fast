import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralFillStealth,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
} from "./neutral-fill-stealth";
import { Palette } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";

describe("neutralFillStealth", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(neutralFillStealthRest({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthRestDelta]
        );
        expect(neutralFillStealthHover({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(neutralFillStealthActive({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthActiveDelta]
        );
        expect(neutralFillStealthFocus({} as FASTDesignSystem)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthFocusDelta]
        );
        expect(neutralFillStealthSelected({} as FASTDesignSystem)).toBe(
            neutralPalette[
                fastDesignSystemDefaults.neutralFillStealthRestDelta +
                    fastDesignSystemDefaults.neutralFillStealthSelectedDelta
            ]
        );
    });

    test("should switch from dark to light after 10 swatches", (): void => {
        expect(neutralFillStealthHover(fastDesignSystemDefaults)).toBe(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(
            neutralFillStealthHover(() => neutralPalette[1])(fastDesignSystemDefaults)
        ).toBe(neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta + 1]);
        expect(
            neutralFillStealthHover(() => neutralPalette[2])(fastDesignSystemDefaults)
        ).toBe(neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta + 2]);
        expect(
            neutralFillStealthHover(() => neutralPalette[9])(fastDesignSystemDefaults)
        ).toBe(neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta + 9]);
        expect(
            neutralFillStealthHover(() => neutralPalette[10])(fastDesignSystemDefaults)
        ).toBe(
            neutralPalette[10 - fastDesignSystemDefaults.neutralFillStealthHoverDelta]
        );
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillStealthRest(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillStealthRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillStealthHover(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillStealthHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillStealthActive(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillStealthActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillStealthFocus(() => swatch)(fastDesignSystemDefaults)).toBe(
                neutralFillStealthFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthSelected(() => swatch)(fastDesignSystemDefaults)
            ).toBe(
                neutralFillStealthSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFillStealth(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillStealthRest(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralFillStealthHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillStealthActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillStealthFocus(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillStealthSelected(() => swatch)(
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
