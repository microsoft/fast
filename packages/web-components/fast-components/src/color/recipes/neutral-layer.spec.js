import { expect } from "chai";
import { PaletteRGB } from "../palette";
import { StandardLuminance } from "../utilities/base-layer-luminance";
import { middleGrey } from "../utilities/color-constants";
import { neutralLayerFloating } from "./neutral-layer-floating";
import { neutralLayer1 } from "./neutral-layer-1";
import { neutralLayer2 } from "./neutral-layer-2";
import { neutralLayer3 } from "./neutral-layer-3";
import { neutralLayer4 } from "./neutral-layer-4";
const neutralPalette = PaletteRGB.create(middleGrey);
describe("neutralLayer", () => {
    describe("1", () => {
        it("should return values from 1 when in light mode", () => {
            expect(neutralLayer1(neutralPalette, StandardLuminance.LightMode)).to.equal(
                neutralPalette.get(0 /* L1 */)
            );
        });
        it("should return values from 1 when in dark mode", () => {
            expect(neutralLayer1(neutralPalette, StandardLuminance.DarkMode)).to.equal(
                neutralPalette.get(76 /* L1 */)
            );
        });
    });
    describe("2", () => {
        it("should return values from 2 when in light mode", () => {
            expect(
                neutralLayer2(neutralPalette, StandardLuminance.LightMode, 3, 7, 10, 5)
            ).to.equal(neutralPalette.get(10 /* L2 */));
        });
        it("should return values from 2 when in dark mode", () => {
            expect(
                neutralLayer2(neutralPalette, StandardLuminance.DarkMode, 3, 7, 10, 5)
            ).to.equal(neutralPalette.get(79 /* L2 */));
        });
    });
    describe("3", () => {
        it("should return values from 3 when in light mode", () => {
            expect(
                neutralLayer3(neutralPalette, StandardLuminance.LightMode, 3, 7, 10, 5)
            ).to.equal(neutralPalette.get(13 /* L3 */));
        });
        it("should return values from 3 when in dark mode", () => {
            expect(
                neutralLayer3(neutralPalette, StandardLuminance.DarkMode, 3, 7, 10, 5)
            ).to.equal(neutralPalette.get(82 /* L3 */));
        });
    });
    describe("4", () => {
        it("should return values from 4 when in light mode", () => {
            expect(
                neutralLayer4(neutralPalette, StandardLuminance.LightMode, 3, 7, 10, 5)
            ).to.equal(neutralPalette.get(16 /* L4 */));
        });
        it("should return values from 4 when in dark mode", () => {
            expect(
                neutralLayer4(neutralPalette, StandardLuminance.DarkMode, 3, 7, 10, 5)
            ).to.equal(neutralPalette.get(85 /* L4 */));
        });
    });
    describe("neutralLayerFloating", () => {
        it("should return a color from the neutral palette", () => {
            expect(
                neutralPalette.swatches.includes(
                    neutralLayerFloating(neutralPalette, StandardLuminance.LightMode, 3)
                )
            ).to.be.true;
        });
    });
});
