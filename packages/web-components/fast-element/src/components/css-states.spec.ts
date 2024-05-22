import { expect } from "chai";
import { cssState } from "./css-states.js";
import { FASTElement, customElement } from "./fast-element.js";
import { uniqueElementName } from "../testing/fixture.js";

interface TestElement extends HTMLElement {
    elementInternals?: ElementInternals;
}

describe("CSS Custom States", () => {
    const name = uniqueElementName();
    @customElement(name)
    class Element extends FASTElement {
        @cssState state: boolean = false;
    }

    context("", () => {
        it("should attach internals if not already done manually", () => {

            const instance: TestElement = document.createElement(name);
            document.body.appendChild(instance);

            expect(instance.elementInternals).to.exist;
        });
    });

});
