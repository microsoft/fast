import path from "path";
import fs from "fs";
import { pascalCase } from "../../packages/fast-web-utilities";

/**
 * Verifies all components in source directory are exported, directories listed in "excludes" parameter are ignored
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile: string, excludes?: string[]): boolean {
    // Get the folders in the indexFile directory to compare to export listing
    const directoryPath: string = path.dirname(indexFile);
    const components: string[] = fs.readdirSync(directoryPath)
        .map((name: string) => path.join(directoryPath, name))
        .filter((source: string) => fs.statSync(source).isDirectory())
        .map((entry: string) => pascalCase(path.basename(entry)));

    // Get listing of all exports and compare against folder listings
    const foundExports: any = Object.keys(require(path.resolve(__dirname, indexFile)));
    const missingExports: string[] = components.filter((component: string) => !foundExports.includes(component) && excludes.indexOf(component) !== -1);

    if (missingExports.length === 0) {
        return true;
    } else {
        throw new Error(`Missing exports: ${missingExports}`);
    }
}