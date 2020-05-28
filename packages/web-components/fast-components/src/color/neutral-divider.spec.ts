import { expect } from "chai";
import { fastDesignSystemDefaults } from "../fast-design-system";
import { neutralDividerRest } from "./neutral-divider";

describe("neutralDividerRest", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralDividerRest(fastDesignSystemDefaults)).to.equal("string");
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralDividerRest(() => "#FFF")).to.equal("function");
    });
});
