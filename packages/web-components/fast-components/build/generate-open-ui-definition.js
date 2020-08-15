import fs from "fs";
import path from "path";
import glob from "glob";
import chalk from "chalk";
import Ajv from "ajv";
import openUISchema from "../src/__test__/component.schema.json";
import webComponentDefinitionSchema from "@microsoft/fast-tooling/dist/schemas/web-component.schema";

const ajv = new Ajv();
ajv.addSchema(webComponentDefinitionSchema);
const validate = ajv.compile(openUISchema);
const openUIDisplayName = "Open UI";
const webComponentDisplayName = "Web Component";

function getDefinitionLocations(definitionLocations, definitionKeys) {
    return definitionLocations.reduce(
        (accumulator, currentValue) => {
            const pathItems = currentValue.split("/");
            const definitionKey = pathItems[pathItems.length - 1].split(".")[0];
            accumulator[definitionKey] = currentValue;
            definitionKeys.push(definitionKey);
    
            return accumulator;
        },
        {}
    );
}

/**
 * This normalizes the Web Component definition so that it is acceptable
 * in the JSON schema
 */
function definitionNormalizer(definition) {
    return {
        ...definition,
        tags: Array.isArray(definition.tags)
            ? definition.tags.map((tag) => {
                return {
                    ...tag,
                    attributes: Array.isArray(tag.attributes)
                        ? tag.attributes.map((attribute) => {
                            return {
                                ...attribute,
                                default: typeof attribute.default === "string"
                                    ? attribute.default
                                    : attribute.default === void 0
                                    ? void 0
                                    : `${attribute.default}`
                            }
                        })
                        : void 0
                }
            })
            : void 0
    };
}

/**
 * Get all json schema files from within the src directory
 */
const openUIDefinitionLocationPattern = path.resolve(__dirname, "../src/**/*.open-ui.definition.json");
const allOpenUIDefinitionLocations = glob.sync(openUIDefinitionLocationPattern);
const allOpenUIDefinitionKeys = [];

if (allOpenUIDefinitionLocations.length === 0) {
    throw new Error(`No ${openUIDisplayName} definitions found.`);
}

const dictionaryOfOpenUIDefinitionLocations = getDefinitionLocations(
    allOpenUIDefinitionLocations,
    allOpenUIDefinitionKeys
);

/**
 * Get all component definition files from within the src directory
 */
const webComponentDefinitionLocationPattern = path.resolve(__dirname, "../temp/**/*.definition.js");
const allWebComponentDefinitionLocations = glob.sync(webComponentDefinitionLocationPattern);
const allWebComponentDefinitionKeys = [];

if (allWebComponentDefinitionLocations.length === 0) {
    throw new Error(`No ${webComponentDisplayName} definitions found.`);
}

const dictionaryOfWebComponentDefinitionLocations = getDefinitionLocations(
    allWebComponentDefinitionLocations,
    allWebComponentDefinitionKeys
);

/**
 * Check to make sure there are no missing files,
 * a component definition must have a corresponding json schema file
 */

function throwErrorForMissingDefinition(
    firstDefinitionSet,
    firstDefinitionSetDisplayName,
    secondDefinitionSet,
    secondDefinitionSetDisplayName
) {
    throw new Error(
        chalk.red(`The following components have ${firstDefinitionSetDisplayName} definitions but no ${secondDefinitionSetDisplayName} definition:\n> ${firstDefinitionSet.filter(
            (value) => {
                return !secondDefinitionSet.includes(value);
            }
        ).join("\n> ")}`)
    );
}

if (allWebComponentDefinitionKeys.length > allOpenUIDefinitionKeys.length) {
    throwErrorForMissingDefinition(
        allWebComponentDefinitionKeys,
        webComponentDisplayName,
        allOpenUIDefinitionKeys,
        openUIDisplayName
    );
}

if (allWebComponentDefinitionKeys.length < allOpenUIDefinitionKeys.length) {
    throwErrorForMissingDefinition(
        allOpenUIDefinitionKeys,
        openUIDisplayName,
        allWebComponentDefinitionKeys,
        webComponentDisplayName
    );
}

/**
 * Compile them together into the dist folder
 */
allWebComponentDefinitionKeys.forEach((definitionKey) => {
    if (dictionaryOfOpenUIDefinitionLocations[definitionKey]) {
        const definitionPath = path.resolve(
            __dirname,
            `../dist/esm/${definitionKey}/`
        );

        // Create directories if they don't exist
        // this assumes at minimum the dist/esm folder exists
        try {
            fs.accessSync(definitionPath);
        } catch (err) {
            fs.mkdir(definitionPath, {}, (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        const openUIDefinition = JSON.parse(
            fs.readFileSync(
                dictionaryOfOpenUIDefinitionLocations[definitionKey],
                {
                    encoding: "utf8"
                }
            )
        );

        import(dictionaryOfWebComponentDefinitionLocations[definitionKey])
            .then((module) => {
                try {
                    const fileContents = {
                        ...openUIDefinition,
                        implementations: [
                            {
                                type: "web-component",
                                implementation: definitionNormalizer(module[Object.keys(module)[0]])
                            }
                        ]
                    };

                    // Test the file
                    const valid = validate(fileContents);

                    if (!valid) {
                        throw new Error(JSON.stringify(validate.errors, null, 2));
                    }

                    // Write the file
                    fs.writeFile(
                        path.resolve(
                            definitionPath,
                            `${definitionKey}.open-ui.definition.json`
                        ),
                        JSON.stringify(fileContents, null, 2),
                        "utf8",
                        (err) => {
                            if (err) {
                                throw err;
                            }
                        }
                    );
                } catch (e) {
                    throw e;
                }
            }, (reason) => {
                throw new Error(reason);
            })
            .catch((err) => {
                if (err) {
                    throw new Error(err.toString());
                }
            });
    } else {
        throw new Error(`Missing or mismatched definition: ${definitionKey}`);
    }
});
