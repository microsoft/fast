import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system.js";
import {
    neutralFill,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillSelected,
} from "./neutral-fill.js";
import { Palette } from "./palette.js";
import { FillSwatchFamily, Swatch } from "./common.js";
import chai from "chai";
const { expect } = chai;

describe("neutralFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should operate on design system defaults", (): void => {
        expect(neutralFillRest({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillFocus({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillFocusDelta]
        );
        expect(neutralFillSelected({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillSelectedDelta]
        );
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it("should switch from dark to light after 10 swatches", (): void => {
        expect(neutralFillRest(fastDesignSystemDefaults)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta]
        );
        expect(neutralFillHover(fastDesignSystemDefaults)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillHoverDelta]
        );
        expect(neutralFillActive(fastDesignSystemDefaults)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillActiveDelta]
        );
        expect(neutralFillFocus(fastDesignSystemDefaults)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillFocusDelta]
        );
        expect(
            neutralFillRest(() => neutralPalette[1])(fastDesignSystemDefaults)
        ).to.equal(neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta + 1]);
        expect(
            neutralFillRest(() => neutralPalette[2])(fastDesignSystemDefaults)
        ).to.equal(neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta + 2]);
        expect(
            neutralFillRest(() => neutralPalette[9])(fastDesignSystemDefaults)
        ).to.equal(neutralPalette[fastDesignSystemDefaults.neutralFillRestDelta + 9]);
        expect(
            neutralFillRest(() => neutralPalette[10])(fastDesignSystemDefaults)
        ).to.equal(neutralPalette[3]);
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillRest(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillHover(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillActive(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillFocus(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillSelected(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
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

            expect(backplates.rest).to.equal(rest);
            expect(backplates.hover).to.equal(hover);
            expect(backplates.active).to.equal(active);
            expect(backplates.focus).to.equal(focus);
            expect(backplates.selected).to.equal(selected);
        });
    });
});
