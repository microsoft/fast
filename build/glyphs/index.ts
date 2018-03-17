const fs = require("fs");

export type ExportFileType = "ts" | "js";

export interface IGlyph {
    name: string;
    svg: string;
}

export default class ConvertGlyphs {
    private _glyphs: IGlyph[];
    private _index: string;
    private _indexFileType: ExportFileType;
    private _indexFileDestination: string;

    constructor(
        glyphFolderPath: string,
        indexFileType?: ExportFileType,
        indexFileDestination?: string
    ) {
        this._glyphs = this.getGlyphs(glyphFolderPath, "svg");
        this._index = this.getIndex();
        this._indexFileType = indexFileType || "js";
        this._indexFileDestination = indexFileDestination
            ? `${indexFileDestination}/index.${this._indexFileType}`
            : `${glyphFolderPath}/index.${this._indexFileType}`;

        this.writeIndexFile();
    }

    private writeIndexFile(): void {
        fs.writeFileSync(this._indexFileDestination, this._index, "UTF-8");
    }

    private normalizeName(glyphName: string): string {
        return `glyph${glyphName.charAt(0).toUpperCase()}${glyphName.slice(1, glyphName.length - 4).replace(/[^0-9a-zA-Z]/g, "")}`;
    }

    public getGlyphs(glyphFolderPath: string, glyphFileExtension: string): IGlyph[] {
        let glyphs: IGlyph[] = [];
        let files = fs.readdirSync(glyphFolderPath);

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

    public getIndex(): string {
        let index = "";

        this._glyphs.forEach((glyph: IGlyph) => {
            index += `const ${glyph.name} = \`${glyph.svg}\`;\n`;
            index += `export { ${glyph.name} };\n`
        });

        return index;
    }
}