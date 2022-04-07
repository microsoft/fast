/* eslint-disable */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const chalk = require("chalk");
const Ajv = require("ajv");
const openUISchema = require("../src/__test__/component.schema.json");
const vsCodeCustomDataSchema = require("vscode-html-languageservice/docs/customData.schema.json");
const url = require('url');

const ajv = new Ajv();
ajv.addSchema(vsCodeCustomDataSchema);
const validate = ajv.compile(openUISchema);
const openUIDisplayName = "Open UI";
const webComponentDisplayName = "Web Component";

function getDefinitionLocations(definitionLocations, definitionKeys) {
    return definitionLocations.reduce((accumulator, currentValue) => {
        const pathItems = currentValue.split("/");
        const definitionKey = pathItems[pathItems.length - 1].split(".")[0];
        accumulator[definitionKey] = currentValue;
        definitionKeys.push(definitionKey);

        return accumulator;
    }, {});
}

/**
 * This normalizes the Web Component definition so that it is acceptable
 * in the JSON schema
 *
 * Web component definitions must always have strings as attribute values,
 * right now numbers and booleans can be specified, this aids when converting
 * to a JSON schema that the fast-tooling can use.
 *
 * Here for our exported Open UI schema, it is changed to strings so that it will validate.
 */
function definitionNormalizer(definition) {
    return {
        ...definition,
        tags: Array.isArray(definition.tags)
            ? definition.tags.map(tag => {
                  return {
                      ...tag,
                      attributes: Array.isArray(tag.attributes)
                          ? tag.attributes.map(attribute => {
                                return {
                                    ...attribute,
                                    default:
                                        typeof attribute.default === "string"
                                            ? attribute.default
                                            : attribute.default === void 0
                                            ? void 0
                                            : `${attribute.default}`,
                                };
                            })
                          : void 0,
                  };
              })
            : void 0,
    };
}

/**
 * Get all json schema files from within the src directory
 */
const openUIDefinitionLocationPattern = path.resolve(
    __dirname,
    "../temp/**/*.open-ui.definition.js"
);
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
const webComponentDefinitionLocationPattern = path.resolve(
    __dirname,
    "../temp/**/*.vscode.definition.js"
);

const allWebComponentDefinitionLocations = glob.sync(
    webComponentDefinitionLocationPattern
);
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
        chalk.red(
            `The following components have ${firstDefinitionSetDisplayName} definitions but no ${secondDefinitionSetDisplayName} definition:\n> ${firstDefinitionSet
                .filter(value => {
                    return !secondDefinitionSet.includes(value);
                })
                .join("\n> ")}`
        )
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
allWebComponentDefinitionKeys.forEach(definitionKey => {
    if (dictionaryOfOpenUIDefinitionLocations[definitionKey]) {
        const definitionPath = path.resolve(__dirname, `../dist/esm/${definitionKey}/`);

        // Create directories if they don't exist
        // this assumes at minimum the dist/esm folder exists
        try {
            fs.accessSync(definitionPath);
        } catch (err) {
            fs.mkdir(definitionPath, {}, err => {
                if (err) {
                    throw err;
                }
            });
        }
        Promise.all([
            import(
                url.pathToFileURL(dictionaryOfOpenUIDefinitionLocations[definitionKey])
                    .href
            ),
            import(
                url.pathToFileURL(
                    dictionaryOfWebComponentDefinitionLocations[definitionKey]
                ).href
            ),
        ])
        .then(([openUIDefinition, schema]) => {
            openUIDefinition = openUIDefinition.default;
            schema = schema.default;

            const fileContents = {
                ...openUIDefinition,
                implementations: [
                    {
                        type: "web-component",
                        implementation: definitionNormalizer(schema),
                    },
                ],
            };

            // Test the file
            const valid = validate(fileContents);

            if (!valid) {
                throw new Error(JSON.stringify(validate.errors, null, 2));
            }

            // Write the file
            fs.writeFileSync(
                path.resolve(definitionPath, `${definitionKey}.open-ui.definition.js`),
                "export default " + JSON.stringify(fileContents, null, 2),
                "utf8",
                err => {
                    if (err) {
                        throw err;
                    }
                }
            );
        })
    } else {
        throw new Error(`Missing or mismatched definition: ${definitionKey}`);
    }
});
