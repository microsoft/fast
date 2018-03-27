import ConvertGlyphs, { IConvertGlyphOptions } from "./";
import * as path from "path";
import * as fs from "fs";

describe("Glyph string conversion", () => {
    const glyphFolderPath: string = path.resolve(__dirname, "./__tests__/");
    afterAll(() => {
        fs.unlinkSync(`${glyphFolderPath}/index.js`);
        fs.unlinkSync(`${glyphFolderPath}/index.ts`);
        fs.unlinkSync(`${glyphFolderPath}/test-folder/index.js`);
    });
    it("should generate a file in a default location", () => {
        const glyphFolderPath: string = path.resolve(__dirname, "./__tests__/");
        const glyphConverter: ConvertGlyphs = new ConvertGlyphs(({glyphFolderPath} as IConvertGlyphOptions));

        // This will throw an error if the file does not exist
        fs.readFile(`${glyphFolderPath}/index.js`, (err: Error) => {
            if (err) {
                throw err;
            }
        });
    });
    it("should generate a file in a specified location", () => {
        const glyphFolderPath: string = path.resolve(__dirname, "./__tests__/");
        const indexFileDestination: string = path.resolve(__dirname, "./__tests__/test-folder/");
        const glyphConverter: ConvertGlyphs = new ConvertGlyphs(({glyphFolderPath, indexFileDestination} as IConvertGlyphOptions));
    });
    it("should have declared variables and exported strings", () => {
        const glyphFolderPath: string = path.resolve(__dirname, "./__tests__/");
        const glyphConverter: ConvertGlyphs = new ConvertGlyphs(({glyphFolderPath} as IConvertGlyphOptions));

        expect(glyphConverter.getIndexFileContents().match(/const/g).length).toEqual(6);
        expect(glyphConverter.getIndexFileContents().match(/export/g).length).toEqual(6);
    });
    it("should generate strings in a specified format", () => {
        const glyphFolderPath: string = path.resolve(__dirname, "./__tests__/");
        const glyphConverter: ConvertGlyphs = new ConvertGlyphs(({glyphFolderPath} as IConvertGlyphOptions));

        expect(
            glyphConverter.getIndexFileContents().match(/const\s[a-z|A-Z]+\s=\s`.*`;\nexport\s{\s.*\s}/g).length
        ).toEqual(6);
    });
    it("should generate a file with a .js or .ts extension", () => {
        const glyphFolderPath: string = path.resolve(__dirname, "./__tests__/");
        const glyphConverter: ConvertGlyphs = new ConvertGlyphs(({glyphFolderPath, indexFileType: "ts"} as IConvertGlyphOptions));
    });
});
