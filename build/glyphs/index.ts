import * as fs from "fs";

export type ExportFileType = "ts" | "js";

export interface IGlyph {
    name: string;
    svg: string;
}

export interface IConvertGlyphOptions {
    glyphFolderPath: string;
    indexFileType?: ExportFileType;
    indexFileDestination?: string;
}

export default class ConvertGlyphs {
    private glyphs: IGlyph[];
    private index: string;
    private indexFileType: ExportFileType;
    private indexFileDestination: string;

    constructor(
        options: IConvertGlyphOptions
    ) {
        this.glyphs = this.getGlyphs(options.glyphFolderPath, "svg");
        this.index = this.getIndexFileContents();
        this.indexFileType = options.indexFileType || "js";
        this.indexFileDestination = options.indexFileDestination
            ? `${options.indexFileDestination}/index.${this.indexFileType}`
            : `${options.glyphFolderPath}/index.${this.indexFileType}`;

        this.writeIndexFile();
    }

    /**
     * Gets an object containing the glyph names and a string which represents the SVG
     */
    public getGlyphs(glyphFolderPath: string, glyphFileExtension: string): IGlyph[] {
        const glyphs: IGlyph[] = [];
        const files: string[] = fs.readdirSync(glyphFolderPath);

        files.forEach((fileName: string): void => {
            if (fileName.slice(fileName.length - glyphFileExtension.length, fileName.length) === glyphFileExtension) {
                glyphs.push({
                    name: this.normalizeName(fileName),
                    svg: fs.readFileSync(`${glyphFolderPath}/${fileName}`, "UTF-8")
                });
            }
        });

        return glyphs;
    }

    /**
     * Creates and returns the content to be used in the index file
     */
    public getIndexFileContents(): string {
        let index: string = "";

        this.glyphs.forEach((glyph: IGlyph) => {
            index += `const ${glyph.name} = \`${glyph.svg}\`;\n`;
            index += `export { ${glyph.name} };\n`;
        });

        return index;
    }

    /**
     * Saves the index file containing the SVG string exports to disk
     */
    private writeIndexFile(): void {
        fs.writeFileSync(this.indexFileDestination, this.index, "UTF-8");
    }

    /**
     * Normalizes the name of the glyph so that it does not use any characters
     * that JavaScript cannot use in a variable name
     */
    private normalizeName(glyphName: string): string {
        return `glyph${glyphName.charAt(0).toUpperCase()}${glyphName.slice(1, glyphName.length - 4).replace(/[^0-9a-zA-Z]/g, "")}`;
    }
}
