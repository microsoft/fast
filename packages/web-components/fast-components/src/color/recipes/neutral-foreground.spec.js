import { expect } from "chai";
import { PaletteRGB } from "../palette";
import { neutralForeground } from "./neutral-foreground";
import { middleGrey, white } from "../utilities/color-constants";
describe("neutralForeground", () => {
    const neutralPalette = PaletteRGB.create(middleGrey);
    it("should return correct result with default design system values", () => {
        expect(
            neutralForeground(neutralPalette, neutralPalette.get(88)).contrast(
                neutralPalette.get(neutralPalette.swatches.length - 1)
            )
        ).to.be.gte(14);
    });
    it("should return #FFFFFF with a dark background", () => {
        expect(neutralForeground(neutralPalette, white).contrast(white)).to.be.gte(14);
    });
});
