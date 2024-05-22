import { expect } from "chai";
import { cssState } from "./css-states.js";
import { FASTElement } from "./fast-element.js";

describe("CSS Custom States", () => {
    it("should attach internals if not already done manually", () => {
        abstract class BaseElement extends FASTElement {
            @cssState state: boolean = false;
        }

        const element = new BaseElement();

        expect(element.elementInternals);
    });
});
