import ConvertGlyphs, { ConvertGlyphConfig } from "../utilities";
import * as path from "path";
import * as fs from "fs";

const glyphFolderPath: string = path.resolve(__dirname, "../glyphs/");
const indexFileDestination: string = path.resolve(__dirname, "../dist/");

fs.mkdir(indexFileDestination, () => {
    const glyphConverter: ConvertGlyphs = new ConvertGlyphs({
        glyphFolderPath,
        indexFileDestination
    } as ConvertGlyphConfig);
});
