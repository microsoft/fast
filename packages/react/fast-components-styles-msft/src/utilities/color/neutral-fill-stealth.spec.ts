import designSystemDefaults, { DesignSystem } from "../../design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../design-system";
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
    const neutralPalette: Palette = getNeutralPalette(designSystemDefaults);
    const accentPalette: Palette = getAccentPalette(designSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(neutralFillStealthRest({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthRestDelta]
        );
        expect(neutralFillStealthHover({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(neutralFillStealthActive({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthActiveDelta]
        );
        expect(neutralFillStealthFocus({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillStealthFocusDelta]
        );
        expect(neutralFillStealthSelected({} as DesignSystem)).toBe(
            neutralPalette[
                designSystemDefaults.neutralFillStealthRestDelta +
                    designSystemDefaults.neutralFillStealthSelectedDelta
            ]
        );
    });

    test("should switch from dark to light after 10 swatches", (): void => {
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
            neutralFillStealthHover(() => neutralPalette[9])(designSystemDefaults)
        ).toBe(neutralPalette[designSystemDefaults.neutralFillStealthHoverDelta + 9]);
        expect(
            neutralFillStealthHover(() => neutralPalette[10])(designSystemDefaults)
        ).toBe(neutralPalette[10 - designSystemDefaults.neutralFillStealthHoverDelta]);
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
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
            expect(neutralFillStealthFocus(() => swatch)(designSystemDefaults)).toBe(
                neutralFillStealthFocus(
                    Object.assign({}, designSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillStealthSelected(() => swatch)(designSystemDefaults)).toBe(
                neutralFillStealthSelected(
                    Object.assign({}, designSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
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
            const focus: Swatch = neutralFillStealthFocus(() => swatch)(
                designSystemDefaults
            );
            const selected: Swatch = neutralFillStealthSelected(() => swatch)(
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
