import { mapCSSProperties } from "../.tmp/data-utilities/mapping.mdn-data";
import { css as mdnCSS } from "mdn-data";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import yargs from "yargs";
import { properties } from "../src/css-data";
import { isEqual } from "lodash-es";

const outFilePath = path.resolve(__dirname, "../src/css-data.js");
const today = new Date();
const comment = `/**
 * This file is generated from build/generate-mdn-data-files.js
 * any modifications will be overwritten.
 * 
 * Last modified: ${today.toLocaleDateString()}
 */
`;

/**
 * This file generates the file src/css-data.ts
 */

(function () {
    if (yargs.argv.test) {
        const updatedCSSProperties = mapCSSProperties({
            properties: mdnCSS.properties,
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
                mapCSSProperties({
                    properties: mdnCSS.properties,
                    syntaxes: mdnCSS.syntaxes,
                    types: mdnCSS.types,
                }),
                null,
                4
            )}`,
            {},
            error => {
                chalk.red(error);
            }
        );
    }
})();
