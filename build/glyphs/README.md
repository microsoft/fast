# FAST glyph utility
This is a NodeJS utility for reading the glyphs as SVG files and providing a JavaScript export for them so they can be included in a JS package.

## Usage
The package can be used as a `ts-node` script and pointed to the directory containing SVGs.

### Default
This will create an `index.js` file which can be imported that holds named exports based on the file name of the SVG it has imported.

```js
    const glyphPath = path.resolve(__dirname, "path/to/file");
    const glyphConverter = new ConvertGlyphs(glyphPath);
```

### Change the output directory
This will create the export file in a different directory than that of the SVGs.

```js
    const glyphPath = path.resolve(__dirname, "path/to/file");
    const glyphConverter = new ConvertGlyphs(glyphPath, path.resolve(__dirname, void(0), "path/to/file"));
```

### Change the index file type
If you are using typescript you can specify `ts` as the index file type. The default is `js`.

```js
    const glyphPath = path.resolve(__dirname, "path/to/file", "ts");
    const glyphConverter = new ConvertGlyphs(glyphPath);
```