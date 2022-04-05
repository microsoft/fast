import Ajv from "ajv";
import vsCodeCustomDataSchema from "vscode-html-languageservice/docs/customData.schema.json";
import * as componentDefinitions from "dist/esm/component-definitions.js";

const ajv = new Ajv();
ajv.addSchema(vsCodeCustomDataSchema);

Object.entries(componentDefinitions).forEach(([, componentDefinition]) => {
    const valid = ajv.validate(componentDefinition);

    if (!valid) {
        throw ajv.errors;
    }
});
