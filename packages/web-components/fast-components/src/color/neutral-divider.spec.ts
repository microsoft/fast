import { fastDesignSystemDefaults } from "../fast-design-system.js";
import { neutralDividerRest } from "./neutral-divider.js";
import { expect } from "chai";

describe("neutralDividerRest", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralDividerRest(fastDesignSystemDefaults)).to.equal("string");
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralDividerRest(() => "#FFF")).to.equal("function");
    });
});
