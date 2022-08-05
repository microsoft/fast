/* eslint-disable */
const Ajv = require("ajv");
const vsCodeCustomDataSchema = require("vscode-html-languageservice/docs/customData.schema.json");
import("../dist/esm/component-definitions.js").then(componentDefinitions => {
    const ajv = new Ajv();
    ajv.addSchema(vsCodeCustomDataSchema);

    Object.entries(componentDefinitions).forEach(([, componentDefinition]) => {
        const valid = ajv.validate(componentDefinition);

        if (!valid) {
            throw ajv.errors;
        }
    });
})
