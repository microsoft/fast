const tsNode = require("ts-node");

tsNode.register({
    transpileOnly: true,
    compilerOptions: {
        declaration: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        module: "commonJS",
        moduleResolution: "node",
        target: "ES6",
    },
    skipProject: true,
});
