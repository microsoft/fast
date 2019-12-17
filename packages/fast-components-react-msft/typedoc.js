module.exports = {
    out: "./api",
    mode: "file",
    theme: "./typedoc-theme",
    readme: "none",
    plugin: "typedoc-plugin-markdown",
    includeDeclarations: true,
    target: "ES6",
    exclude: ["**/node_modules/**"],
};
