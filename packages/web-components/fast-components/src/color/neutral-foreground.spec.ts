import { parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { PaletteRGB } from "../color-vNext/palette";
import { neutralForeground } from "../color-vNext/recipes/neutral-foreground";
import { SwatchRGB } from "../color-vNext/swatch";
import { fastDesignSystemDefaults } from "../fast-design-system";
import { neutralBaseColor } from "./color-constants";
import { contrast } from "./common";
import {
    neutralForegroundActive_DEPRECATED,
    neutralForegroundHover_DEPRECATED,
    neutralForegroundRest_DEPRECATED
} from "./neutral-foreground";

describe("neutralForeground", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralForegroundRest_DEPRECATED(fastDesignSystemDefaults)).to.equal("string");
        expect(typeof neutralForegroundHover_DEPRECATED(fastDesignSystemDefaults)).to.equal(
            "string"
        );
        expect(typeof neutralForegroundActive_DEPRECATED(fastDesignSystemDefaults)).to.equal(
            "string"
        );
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralForegroundRest_DEPRECATED(() => "#FFF")).to.equal("function");
        expect(typeof neutralForegroundHover_DEPRECATED(() => "#FFF")).to.equal("function");
        expect(typeof neutralForegroundActive_DEPRECATED(() => "#FFF")).to.equal("function");
    });

    it("should return a function when invoked with a string", (): void => {
        expect(typeof neutralForegroundRest_DEPRECATED("#FFF")).to.equal("function");
        expect(typeof neutralForegroundHover_DEPRECATED("#FFF")).to.equal("function");
        expect(typeof neutralForegroundActive_DEPRECATED("#FFF")).to.equal("function");
    });

    it("should operate on default design system if no design system is supplied", (): void => {
        const palette = fastDesignSystemDefaults.neutralPalette;
        const limitColor = palette[palette.length - 1];

        expect(contrast(neutralForegroundRest_DEPRECATED(undefined as any), limitColor)).to.be.gte(
            14
        );
        expect(
            contrast(
                neutralForegroundRest_DEPRECATED(() => undefined as any)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
        expect(
            contrast(
                neutralForegroundRest_DEPRECATED(() => limitColor)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
        expect(
            contrast(
                neutralForegroundRest_DEPRECATED(() => limitColor)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);

        expect(contrast(neutralForegroundHover_DEPRECATED(undefined as any), limitColor)).to.be.gte(
            14
        );
        expect(
            contrast(
                neutralForegroundHover_DEPRECATED(() => undefined as any)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
        expect(
            contrast(
                neutralForegroundHover_DEPRECATED(() => limitColor)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
        expect(
            contrast(
                neutralForegroundHover_DEPRECATED(() => limitColor)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);

        expect(contrast(neutralForegroundActive_DEPRECATED(undefined as any), limitColor)).to.be.gte(
            14
        );
        expect(
            contrast(
                neutralForegroundActive_DEPRECATED(() => undefined as any)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
        expect(
            contrast(
                neutralForegroundActive_DEPRECATED(() => limitColor)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
        expect(
            contrast(
                neutralForegroundActive_DEPRECATED(() => limitColor)(undefined as any),
                limitColor
            )
        ).to.be.gte(14);
    });

    it("should return correct result with default design system values", (): void => {
        expect(
            contrast(
                neutralForegroundRest_DEPRECATED(fastDesignSystemDefaults),
                fastDesignSystemDefaults.neutralPalette[
                    fastDesignSystemDefaults.neutralPalette.length - 1
                ]
            )
        ).to.be.gte(14);
    });

    it("should return #FFFFFF with a dark background", (): void => {
        expect(
            contrast(
                neutralForegroundRest_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: "#000",
                    })
                ),
                "#000"
            )
        ).to.be.gte(14);
    });
});

describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(neutralBaseColor)!)
    const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
    palette.swatches.forEach(( newSwatch, index ) => {
            it(`should be the same for ${newSwatch.toColorString()}`, () => {
                expect(neutralForegroundRest_DEPRECATED({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]})).to.be.equal(neutralForeground( palette, newSwatch).toColorString().toUpperCase())
        });
    })
})