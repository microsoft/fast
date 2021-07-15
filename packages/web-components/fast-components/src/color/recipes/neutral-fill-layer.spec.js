import { expect } from "chai";
import { PaletteRGB } from "../palette";
import { middleGrey } from "../utilities/color-constants";
import { neutralFillLayer } from "./neutral-fill-layer";
const neutralPalette = PaletteRGB.create(middleGrey);
describe("neutralFillCard", () => {
    it("should get darker when the index of the backgroundColor is lower than the offset index", () => {
        const delta = 3;
        for (let i = 0; i < delta; i++) {
            const color = neutralFillLayer(neutralPalette, neutralPalette.get(i), delta);
            const resolved = neutralPalette.get(delta + i);
            expect(color).to.equal(resolved);
        }
    });
    it("should return the color at three steps lower than the background color", () => {
        const delta = 3;
        for (let i = delta; i < neutralPalette.swatches.length; i++) {
            expect(
                neutralPalette.swatches.indexOf(
                    neutralFillLayer(neutralPalette, neutralPalette.get(i), delta)
                )
            ).to.equal(i - 3);
        }
    });
});
