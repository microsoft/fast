import chai from "chai";
import { SwatchRGB } from "../swatch.js";
import { _black, _white } from "../utilities/color-constants.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

const { expect } = chai;

describe("blackOrWhiteByContrast", (): void => {
    it("should return black when background does not meet contrast ratio", (): void => {
        const small = blackOrWhiteByContrast(_white, 4.5, false) as SwatchRGB;
        const large = blackOrWhiteByContrast(_white, 3, false) as SwatchRGB;

        expect(small.r).to.equal(_black.r);
        expect(small.g).to.equal(_black.g);
        expect(small.b).to.equal(_black.b);

        expect(large.r).to.equal(_black.r);
        expect(large.g).to.equal(_black.g);
        expect(large.b).to.equal(_black.b);
    });
});
