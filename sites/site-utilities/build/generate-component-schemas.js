import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import fs from "fs";
import path from "path";

const assetsOutFilePath = path.resolve(__dirname, "../statics/assets/");
const componentsOutFilePath = path.resolve(assetsOutFilePath, "components");
const componentList = [];

if (!fs.existsSync(componentsOutFilePath)) {
    fs.mkdirSync(componentsOutFilePath);
}

function writeFile(outFilePath, data) {
    fs.writeFile(outFilePath, data, {}, error => {
        if (error) {
            throw Error(error);
        }
    });
}

/**
 * Convert definitions to JSON schemas for use in sites
 */
Object.entries(fastComponentDefinitions).forEach(([, definition]) => {
    mapWebComponentDefinitionToJSONSchema(definition).forEach(definitionTagItem => {
        const filename = `${definitionTagItem.mapsToTagName}.schema.json`;
        const outFilePath = path.resolve(componentsOutFilePath, filename);
        componentList.push({
            $id: definitionTagItem.$id,
            schema_url: `https://static.fast.design/assets/components/${filename}`,
        });

        fs.readFile(outFilePath, {}, (err, data) => {
            if (
                (err && err.code === "ENOENT") ||
                data !== JSON.stringify(definitionTagItem, null, 2)
            ) {
                writeFile(outFilePath, JSON.stringify(definitionTagItem, null, 2));
            }
        });
    });
});

/**
 * Write the list of available components to list.json
 * which should have the following format:
 * [
 *     {
 *         $id: "my-component-id",
 *         schema_url: "https://static.fast.design/assets/components/my-component.schema.json"
 *     }
 * ]
 */
writeFile(
    path.resolve(componentsOutFilePath, "list.json"),
    JSON.stringify(componentList)
);
