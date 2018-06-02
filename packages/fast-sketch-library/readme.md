# FAST sketch library
`@microsoft/fast-sketch-library` is a tool for quickly extracting sketch libraries from a website. It uses [https://github.com/brainly/html-sketchapp/](https://github.com/brainly/html-sketchapp/) to create an "almost sketch" JSON file which can be loaded into sketch using the plugin provided by `html-sketchapp`.

## Usage
Install the package
`npm i -D @microsoft/fast-sketch-library`

Set up a node script to extract symbols from a library

```js
const extractSymbolLibrary = require("@microsoft/fast-sketch-library").extractSymbolLibrary;
const fs = require("fs");

const config = {
    name: "Your name",
    pageWidth: 1600,
    pageHeight: 1600,
    sources: [
        {
            url: "http://your-website.com",
            selectors: ".some-element-selector"
        }
    ]
};

extractSymbolLibrary(config).then((value) => {
    fs.writeFileSync("destination.json", value);
});
```

### Config options
`extractSymbolLibrary` expects a configuration object with the following:

- *name*: `string` - the name of the sketch page
- *pageWidth*: `number` - the width of the created sketch page
- *pageHeight*: `number` - the width of the created sketch page
- *sources*: `object | array` a single object or array of:
    - *url*: `string` - the url to extract symbols from
    - *selectors*: `string | string[]` - CSS selectors to source symbols from

