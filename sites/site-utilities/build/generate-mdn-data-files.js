import { mapCSSProperties } from "@microsoft/fast-tooling/dist/cjs/data-utilities/mapping.mdn-data";
import { css as mdnCSS } from "mdn-data";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import yargs from "yargs";
import { properties } from "../src/css-data";
import { isEqual } from "lodash-es";

const outFilePath = path.resolve(__dirname, "../src/css-data.js");
const comment = `/**
 * This file is generated from build/generate-mdn-data-files.js
 * any modifications will be overwritten.
 */
`;

/**
 * This is the subset of CSS properties that will be used in the
 * Creator and Component Explorer sites
 */
const cssProperties = ["color", "background-color", "border"];

const mdnProperties = cssProperties.reduce((accumulatedProperty, currentProperty) => {
    accumulatedProperty[currentProperty] = mdnCSS.properties[currentProperty];
    return accumulatedProperty;
}, {});

/**
 * This function generates the file src/css-data.ts
 */

(function () {
    if (yargs.argv.test) {
        const updatedCSSProperties = mapCSSProperties({
            properties: mdnProperties,
            syntaxes: mdnCSS.syntaxes,
            types: mdnCSS.types,
        });

        if (isEqual(updatedCSSProperties, properties)) {
            console.log(
                chalk.green(
                    "The CSS data file is up to date with the properties from MDN."
                )
            );
        } else {
            console.log(
                chalk.yellow(
                    "The CSS properties from MDN have been updated, run `yarn convert:mdn-data` to update the CSS data file."
                )
            );
        }
    } else {
        fs.writeFile(
            outFilePath,
            `${comment}export const properties = ${JSON.stringify(
                mapCSSProperties(
                    {
                        properties: mdnProperties,
                        syntaxes: mdnCSS.syntaxes,
                        types: mdnCSS.types,
                    },
                    {
                        status: "standard",
                    }
                ),
                null,
                4
            )}`,
            {},
            error => {
                throw Error(error);
            }
        );
    }
})();
