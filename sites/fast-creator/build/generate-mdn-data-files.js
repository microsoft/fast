import { mapCSSProperties } from "@microsoft/fast-tooling/dist/cjs/data-utilities/mapping.mdn-data";
import { css as mdnCSS } from "mdn-data";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const outFilePath = path.resolve(__dirname, "../app/css-data.js");
const today = new Date();
const comment = `/**
 * This file is generated from build/generate-mdn-data-files.js
 * any modifications will be overwritten.
 * 
 * Last modified: ${today.toLocaleDateString()}
 */
`;
// A subset of the MDN properties to be used in the Creator
const subsetOfProperties = [
    "display",
    "overflow",
    "padding",
    "margin",
    "background-color",
];
// a subset of CSS generated from the list of properties above
const subsetOfCSSProperties = Object.entries(mdnCSS.properties).reduce(
    (previousProperties, [currentKey, currentValue]) => {
        if (subsetOfProperties.includes(currentKey)) {
            previousProperties[currentKey] = currentValue;
        }

        return previousProperties;
    },
    {}
);

/**
 * This function generates the file app/css-data.ts
 */

(function () {
    fs.writeFile(
        outFilePath,
        `${comment}export const properties = ${JSON.stringify(
            mapCSSProperties(
                {
                    properties: subsetOfCSSProperties,
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
            chalk.red(error);
        }
    );
})();
