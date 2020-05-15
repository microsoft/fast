import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system.js";
import { clamp, FillSwatchFamily, Swatch } from "./common.js";
import {
    neutralFillInput,
    neutralFillInputActive,
    neutralFillInputFocus,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillInputSelected,
} from "./neutral-fill-input.js";
import { isDarkMode, Palette } from "./palette.js";
import chai from "chai";
const { expect } = chai;

describe("neutralFillInput", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should operate on design system defaults", (): void => {
        expect(neutralFillInputRest({} as FASTDesignSystem)).to.equal(neutralPalette[0]);
        expect(neutralFillInputHover({} as FASTDesignSystem)).to.equal(neutralPalette[0]);
        expect(neutralFillInputActive({} as FASTDesignSystem)).to.equal(
            neutralPalette[0]
        );
        expect(neutralFillInputFocus({} as FASTDesignSystem)).to.equal(neutralPalette[0]);
        expect(neutralFillInputSelected({} as FASTDesignSystem)).to.equal(
            neutralPalette[0]
        );
    });

    it("should always be lighter than the background by the delta in light mode and darker in dark mode", (): void => {
        neutralPalette.forEach((swatch: Swatch, index: number): void => {
            const designSystem: FASTDesignSystem = {
                backgroundColor: neutralPalette[index],
            } as FASTDesignSystem;

            expect(neutralFillInputSelected(designSystem)).to.equal(
                neutralPalette[
                    clamp(
                        index -
                            fastDesignSystemDefaults.neutralFillInputRestDelta *
                                (isDarkMode(designSystem) ? -1 : 1),
                        0,
                        neutralPalette.length - 1
                    )
                ]
            );
        });
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillInputRest(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillInputRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillInputHover(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillInputHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillInputActive(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillInputActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillInputFocus(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillInputFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillInputSelected(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillInputSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFillInput(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillInputRest(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralFillInputHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillInputActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillInputFocus(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillInputSelected(() => swatch)(
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
