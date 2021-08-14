
import { expect } from "chai";
import { PaletteRGB } from "./palette";
import { SwatchRGB, isSwatchRGB } from "./swatch";

const test: SwatchRGB = {
	r: 0,
	g: 0,
	b: 0,
	relativeLuminance: 0,
	contrast: () => 1,
	toColorString: () => ""
}

describe("PaletteRGB.from", () => {
	it("should create a palette from the provided swatch if it matches a SwatchRGB implementation", () => {
		const palette = PaletteRGB.from(test);

		expect(palette.source === test).to.be.true;
	})
});
