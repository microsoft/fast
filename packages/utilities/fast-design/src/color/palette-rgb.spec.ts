import chai from "chai";
import { PaletteRGB } from "./palette-rgb.js";
import { SwatchRGB } from "./swatch.js";

const { expect } = chai;

const test: SwatchRGB = SwatchRGB.create(0, 0, 0);

describe("PaletteRGB.from", () => {
	it("should create a palette from the provided swatch if it matches a SwatchRGB implementation", () => {
		const palette = PaletteRGB.from(test);

		expect(palette.source === test).to.be.true;
	})

	it("should create a palette from a rgb object", () => {
		const source = {r: 1, g: 1, b: 1};
		const palette = PaletteRGB.from(source);

		expect(palette.source === source).to.be.false;
		expect(palette.source instanceof SwatchRGB).to.be.true;
	})
});
