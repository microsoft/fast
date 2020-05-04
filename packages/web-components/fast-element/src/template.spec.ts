import { html, ViewTemplate } from "./template.js";
import chai from "chai";

const expect = chai.expect;

describe("The html tag template helper", () => {
    it("transforms a string into a ViewTemplate.", () => {
        const template = html`This is a simple HTML string.`;
        expect(template).instanceOf(ViewTemplate);
    });
});
