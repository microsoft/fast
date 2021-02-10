import { expect } from "chai";
import { whitespaceFilter } from "./whitespace-filter";

describe("Utilities", () => {
    describe("The whitespaceFilter", () => { 
        const spanEl: HTMLSpanElement = document.createElement("span");
        spanEl.innerText = "span";

        const whitespaceTextNode: Node = document.createTextNode("   ")
        const textNode: Node = document.createTextNode("text")

        it("should return true when given an element node", () => {
            expect(whitespaceFilter(spanEl,0,[spanEl])).to.be.true;
        })

        it("should return false when given an whitespace text node", () => {
            expect(whitespaceFilter(whitespaceTextNode,0,[whitespaceTextNode])).to.be.false;
        })

        it("should return true when given a text node", () => {
            expect(whitespaceFilter(textNode,0,[textNode])).to.be.true;
        })
    })
})