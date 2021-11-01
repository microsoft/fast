
import { expect } from "chai";
import { SwatchRGB, isSwatchRGB } from "./swatch";

const test: SwatchRGB = {
	r: 0,
	g: 0,
	b: 0,
	relativeLuminance: 0,
	contrast: () => 1,
	toColorString: () => ""
}

describe("isSwatchRGB", () => {
	it("should return true when called with the product of SwatchRGB.create()", () => {
		expect(isSwatchRGB(SwatchRGB.create(1, 1, 1))).to.be.true;
	});

	it("should return true when called with an object conforming to the interface", () => {
		expect(isSwatchRGB(test)).to.be.true;
	});

	(Object.keys(test) as [keyof SwatchRGB]).forEach(key => {
        it(`should return false when called with an object missing the ${key} property`, () => {
            const { [key]: _, ..._test } = test;

            expect(isSwatchRGB(_test)).to.be.false;
        });

		it(`should return false when called with an object with the ${key} property assigned to a mismatching type`, () => {
			const _test: SwatchRGB = {
				...test,
				[key]: "foobar"
			};

			expect(isSwatchRGB(_test)).to.be.false;
		})
	});
});
