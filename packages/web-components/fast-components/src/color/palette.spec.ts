
import { expect } from "chai";
import { PaletteRGB } from "./palette.js";
import { SwatchRGB, isSwatchRGB } from "./swatch.js";

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

	it("should create a palette from a rgb object", () => {
		const source = {r: 1, g: 1, b: 1};
		const palette = PaletteRGB.from(source);

		expect(palette.source === source).to.be.false;
		expect(isSwatchRGB(palette.source)).to.be.true;
	})
});
