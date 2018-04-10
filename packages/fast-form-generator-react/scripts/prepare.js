const spawn = require("cross-spawn");

/**
 * Run all style and doc generation
 */
const options = {
    stdio: "inherit"
};

const resolveSchemas = spawn("node", ["scripts/generate-resolved-schemas.js"], options);
