import designSystemDefaults, { DesignSystem } from "../../design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../design-system";
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
    const neutralPalette: Palette = getNeutralPalette(designSystemDefaults);
    const accentPalette: Palette = getAccentPalette(designSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(neutralFillRest({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillFocus({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillFocusDelta]
        );
        expect(neutralFillSelected({} as DesignSystem)).toBe(
            neutralPalette[designSystemDefaults.neutralFillSelectedDelta]
        );
    });

    test("should switch from dark to light after 10 swatches", (): void => {
        expect(neutralFillRest(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillFocus(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillFocusDelta]
        );
        expect(neutralFillRest(() => neutralPalette[1])(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta + 1]
        );
        expect(neutralFillRest(() => neutralPalette[2])(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta + 2]
        );
        expect(neutralFillRest(() => neutralPalette[9])(designSystemDefaults)).toBe(
            neutralPalette[designSystemDefaults.neutralFillRestDelta + 9]
        );
        expect(neutralFillRest(() => neutralPalette[10])(designSystemDefaults)).toBe(
            neutralPalette[3]
        );
    });

    test("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
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
            expect(neutralFillFocus(() => swatch)(designSystemDefaults)).toBe(
                neutralFillFocus(
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
        });
    });

    test("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFill(() => swatch)(
                designSystemDefaults
            );
            const rest: Swatch = neutralFillRest(() => swatch)(designSystemDefaults);
            const hover: Swatch = neutralFillHover(() => swatch)(designSystemDefaults);
            const active: Swatch = neutralFillActive(() => swatch)(designSystemDefaults);
            const focus: Swatch = neutralFillFocus(() => swatch)(designSystemDefaults);
            const selected: Swatch = neutralFillSelected(() => swatch)(
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
