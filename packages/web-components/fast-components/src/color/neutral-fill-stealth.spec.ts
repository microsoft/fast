import { expect } from "chai";
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

    it("should operate on design system defaults", (): void => {
        [
            neutralFillStealthActive,
            neutralFillStealthFocus,
            neutralFillStealthHover,
            neutralFillStealthRest,
            neutralFillStealthSelected,
        ].forEach(fn => {
            expect(neutralPalette).to.include(fn({} as FASTDesignSystem));
        });
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
