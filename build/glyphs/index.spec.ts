import ConvertGlyphs from "./";
import { expect } from "chai";
import "mocha";

const path = require("path");
const fs = require("fs");

describe("Glyph string conversion", () => {
    it("should generate a file in a default location", () => {
        const glyphPath = path.resolve(__dirname, "./__tests__/");
        const glyphConverter = new ConvertGlyphs(glyphPath);

        // This will throw an error if the file does not exist
        fs.unlink(`${glyphPath}/index.js`, (err) => { if (err) { throw err } });
    });
    it("should generate a file in a specified location", () => {
        const glyphPath = path.resolve(__dirname, "./__tests__/");
        const indexDestinationPath = path.resolve(__dirname, "./__tests__/test-folder/");
        const glyphConverter = new ConvertGlyphs(glyphPath, void(0), indexDestinationPath);

        fs.unlink(`${glyphPath}/test-folder/index.js`, (err) => { if (err) { throw err } });
    });
    it("should have declared variables and exported strings", () => {
        const glyphPath = path.resolve(__dirname, "./__tests__/");
        const glyphConverter = new ConvertGlyphs(glyphPath);

        expect(glyphConverter.getIndex().match(/const/g).length).to.equal(6);
        expect(glyphConverter.getIndex().match(/export/g).length).to.equal(6);

        fs.unlink(`${glyphPath}/index.js`, (err) => { if (err) { throw err } });
    });
    it("should generate strings in a specified format", () => {
        const glyphPath = path.resolve(__dirname, "./__tests__/");
        const glyphConverter = new ConvertGlyphs(glyphPath);

        expect(
            glyphConverter.getIndex().match(/const\s[a-z|A-Z]+\s=\s`.*`;\nexport\s{\s.*\s}/g).length
        ).to.equal(6);

        fs.unlink(`${glyphPath}/index.js`, (err) => { if (err) { throw err } });
    });
    it("should generate a file with a .js or .ts extension", () => {
        const glyphPath = path.resolve(__dirname, "./__tests__/");
        const glyphConverter = new ConvertGlyphs(glyphPath, "ts");

        fs.unlink(`${glyphPath}/index.ts`, (err) => { if (err) { throw err } });
    });
});