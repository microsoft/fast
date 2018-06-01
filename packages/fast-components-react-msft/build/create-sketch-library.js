/**
 * Generate the sketch library file for MSFT components.
 *
 * To use this script:
 * 1. Ensure you have the development site running - from the root of this project, run `npm start` and wait until the website is built
 * 2. run `node build/create-sketch-library.js`
 * 3. Load the output `toggle-symbols.json` file into sketch using the plugin from `https://github.com/brainly/html-sketchapp/releases/`
 * 4. Save out the file as a .sketch file to app/fast-dna-msft-design-kit.sketch
 */
const extractSymbolLibrary = require("@microsoft/fast-sketch-library").extractSymbolLibrary;
const fs = require("fs");

const sources = [
    "http://localhost:7001/components/button/",
    "http://localhost:7001/components/checkbox/",
    "http://localhost:7001/components/divider/",
    "http://localhost:7001/components/heading/",
    "http://localhost:7001/components/label/",
    "http://localhost:7001/components/toggle/",
    "http://localhost:7001/components/typography/",
    "http://localhost:7001/components/hypertext/",
].map(value => {
    return {
        url: value,
        selectors: "[data-sketch-symbol]"
    }
});

const config = {
    name: "Fast-dna MSFT design kit",
    pageWidth: 1600,
    pageHeight: 1600,
    sources
};

extractSymbolLibrary(config).then((value) => {
    fs.writeFileSync("toggle-symbols.json", value);
});
