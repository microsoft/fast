import path from "path";
import fs from "fs";
import { pascalCase } from "../../packages/utilities/fast-web-utilities";
/**
 * Verifies all components in source directory are exported, directories listed in "excludes" parameter are ignored
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile, excludes) {
    // Get the folders in the indexFile directory to compare to export listing
    const directoryPath = path.dirname(indexFile);
    const components = fs
        .readdirSync(directoryPath)
        .map(name => path.join(directoryPath, name))
        .filter(source => fs.statSync(source).isDirectory())
        .map(entry => pascalCase(path.basename(entry)));
    // Get listing of all exports and compare against folder listings
    const foundExports = Object.keys(require(path.resolve(__dirname, indexFile)));
    const missingExports = components.filter(
        component =>
            !foundExports.includes(component) && excludes.indexOf(component) !== -1
    );
    if (missingExports.length === 0) {
        return true;
    } else {
        throw new Error(`Missing exports: ${missingExports}`);
    }
}
