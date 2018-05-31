const extractSymbols = require("./dist/sketch-library.js").extractSymbols;
const fs = require("fs");

const foo = extractSymbols([
    {
        url: "http://localhost:7001/components/button/",
        selectors: "[data-example=\"example\"]"
    },
    {
        url: "http://localhost:7001/components/toggle/",
        selectors: "[data-example=\"example\"]"
    }
]).then((value) => {
    fs.writeFileSync(`toggle-symbols.json`, value);
});
