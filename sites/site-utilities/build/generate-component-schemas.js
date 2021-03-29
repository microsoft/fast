import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import fs from "fs";
import path from "path";

const assetsOutFilePath = path.resolve(__dirname, "../statics/assets/");
const componentsOutFilePath = path.resolve(assetsOutFilePath, "components");

if (!fs.existsSync(componentsOutFilePath)) {
    fs.mkdirSync(componentsOutFilePath);
}

function writeSchemaFile(outFilePath, data) {
    fs.writeFile(outFilePath, data, {}, error => {
        if (error) {
            throw Error(error);
        }
    });
}

/**
 * This converts definitions to JSON schemas for use in sites
 */
Object.entries(fastComponentDefinitions).forEach(([, definition]) => {
    mapWebComponentDefinitionToJSONSchema(definition).forEach(definitionTagItem => {
        const outFilePath = path.resolve(
            componentsOutFilePath,
            `${definitionTagItem.mapsToTagName}.schema.json`
        );

        fs.readFile(outFilePath, {}, (err, data) => {
            if (
                (err && err.code === "ENOENT") ||
                data !== JSON.stringify(definitionTagItem, null, 2)
            ) {
                writeSchemaFile(outFilePath, JSON.stringify(definitionTagItem, null, 2));
            }
        });
    });
});
