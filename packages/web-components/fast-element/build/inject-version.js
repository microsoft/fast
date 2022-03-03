const package = require("../package.json");
const fs = require("fs");

const sourceCode = fs.readFileSync("./src/platform.ts", "utf8");

const semVerPattern = /"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?"/gm;
const alteredCode = sourceCode.replace(semVerPattern, `"${package.version}"`);

fs.writeFileSync("./src/platform.ts", alteredCode, "utf8");
