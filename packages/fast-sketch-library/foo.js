const extractSymbols = require("./dist/sketch-library.js").extractSymbols;
const fs = require("fs");

const foo = extractSymbols([
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
        selectors: "[data-example=\"example\"]"
    }
})).then((value) => {
    fs.writeFileSync(`toggle-symbols.json`, value);
});
