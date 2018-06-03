/**
 * Generate the sketch library file for MSFT components.
 *
 * To use this script:
 * 1. Ensure you have the development site running - from the root of this project, run `npm start` and wait until the website is built
 * 2. run `node build/create-sketch-library.js`
 * 3. Load the output `fast-dna-msft-design-kit.json` file into sketch using the plugin from `https://github.com/brainly/html-sketchapp/releases/`
 * 4. Save out the file as a .sketch file to app/fast-dna-msft-design-kit.sketch
 */
const extractSymbolLibrary = require("@microsoft/fast-sketch-library").extractSymbolLibrary;
const fs = require("fs");

const sources = [
    "http://localhost:7001/components/button/examples/",
    "http://localhost:7001/components/checkbox/examples/",
    "http://localhost:7001/components/divider/examples/",
    "http://localhost:7001/components/heading/examples/",
    "http://localhost:7001/components/label/examples/",
    "http://localhost:7001/components/toggle/examples/",
    "http://localhost:7001/components/typography/examples/",
    "http://localhost:7001/components/hypertext/examples/",
].map(value => {
    return {
        url: value,
        selectors: "[data-sketch-symbol]"
    }
});

const config = {
    name: "FAST-DNA MSFT design kit",
    pageWidth: 1600,
    pageHeight: 1600,
    sources
};

extractSymbolLibrary(config).then((value) => {
    fs.writeFileSync("fast-dna-msft-design-kit.json", value);
});
