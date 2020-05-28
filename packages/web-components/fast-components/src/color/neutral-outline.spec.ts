import { isColorStringHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralOutline,
    neutralOutlineActive,
    neutralOutlineFocus,
    neutralOutlineHover,
    neutralOutlineRest,
} from "./neutral-outline";
import { Palette } from "./palette";
import { Swatch, SwatchFamily } from "./common";

describe("neutralOutline", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    it("should return by default", (): void => {
        [
            neutralOutlineActive,
            neutralOutlineFocus,
            neutralOutlineHover,
            neutralOutlineRest,
        ].forEach(fn => {
            expect(neutralPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should always return a color", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                isColorStringHexRGB(
                    neutralOutlineRest(() => swatch)({} as FASTDesignSystem)
                )
            ).to.equal(true);
        });
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralOutlineRest(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineHover(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineActive(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineFocus(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: SwatchFamily = neutralOutline(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralOutlineRest(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralOutlineHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralOutlineActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralOutlineFocus(() => swatch)(
                fastDesignSystemDefaults
            );

            expect(backplates.rest).to.equal(rest);
            expect(backplates.hover).to.equal(hover);
            expect(backplates.active).to.equal(active);
            expect(backplates.focus).to.equal(focus);
        });
    });
});
