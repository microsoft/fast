import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { neutralFocus } from "./neutral-focus";
import { contrast } from "./common";
import { expect } from "chai";

describe("neutralFocus", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralFocus(fastDesignSystemDefaults)).to.equal("string");
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralFocus(() => "#FFF")).to.equal("function");
    });

    it("should operate on default design system if no design system is supplied", (): void => {
        expect(contrast(neutralFocus({} as FASTDesignSystem), "#FFF")).to.be.gte(3.5);
    });
});
