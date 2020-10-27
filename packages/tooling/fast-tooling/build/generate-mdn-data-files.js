import { mapCSSProperties } from "../.tmp/data-utilities/mapping.mdn-data";
import { css as mdnCSS } from "mdn-data";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const outFilePath = path.resolve(__dirname, "../src/css-data.ts");
const comment = `/**
 * This file is generated from build/generate-mdn-data-files.js
 * any modifications will be overwritten.
 */
`;

/**
 * This file generates the file src/css-data.ts
 */

(function () {
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
})();
