import chai from "chai";
import { html, ViewTemplate } from "./template.js";
const { expect } = chai;

describe(`The html tag template helper`, () => {
    it(`transforms a string into a ViewTemplate.`, () => {
        const template = html`This is a simple HTML string.`;
        expect(template).instanceOf(ViewTemplate);
    });
});
