import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system.js";
import {
    neutralFillStealth,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
} from "./neutral-fill-stealth.js";
import { Palette } from "./palette.js";
import { FillSwatchFamily, Swatch } from "./common.js";
import chai from "chai";
const { expect } = chai;

describe("neutralFillStealth", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should operate on design system defaults", (): void => {
        expect(neutralFillStealthRest({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthRestDelta]
        );
        expect(neutralFillStealthHover({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(neutralFillStealthActive({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthActiveDelta]
        );
        expect(neutralFillStealthFocus({} as FASTDesignSystem)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthFocusDelta]
        );
        expect(neutralFillStealthSelected({} as FASTDesignSystem)).to.equal(
            neutralPalette[
                fastDesignSystemDefaults.neutralFillStealthRestDelta +
                    fastDesignSystemDefaults.neutralFillStealthSelectedDelta
            ]
        );
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should switch from dark to light after 10 swatches", (): void => {
        expect(neutralFillStealthHover(fastDesignSystemDefaults)).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta]
        );
        expect(
            neutralFillStealthHover(() => neutralPalette[1])(fastDesignSystemDefaults)
        ).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta + 1]
        );
        expect(
            neutralFillStealthHover(() => neutralPalette[2])(fastDesignSystemDefaults)
        ).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta + 2]
        );
        expect(
            neutralFillStealthHover(() => neutralPalette[9])(fastDesignSystemDefaults)
        ).to.equal(
            neutralPalette[fastDesignSystemDefaults.neutralFillStealthHoverDelta + 9]
        );
        expect(
            neutralFillStealthHover(() => neutralPalette[10])(fastDesignSystemDefaults)
        ).to.equal(
            neutralPalette[10 - fastDesignSystemDefaults.neutralFillStealthHoverDelta]
        );
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                neutralFillStealthRest(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthHover(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthActive(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthFocus(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthSelected(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
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

            expect(backplates.rest).to.equal(rest);
            expect(backplates.hover).to.equal(hover);
            expect(backplates.active).to.equal(active);
            expect(backplates.focus).to.equal(focus);
            expect(backplates.selected).to.equal(selected);
        });
    });
});
