import * as path from "path";
import * as fs from "fs";
import { pascalCase } from "../../packages/fast-web-utilities";

/**
 * Verifies all components in source directory are exported
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile: string): boolean {
    // Get the folders in the indexFile directory to compare to export listing
    const directoryPath: string = path.dirname(indexFile);
    const components: string[] = fs.readdirSync(directoryPath)
        .map((name: string) => path.join(directoryPath, name))
        .filter((source: string) => fs.statSync(source).isDirectory())
        .map((entry: string) => pascalCase(path.basename(entry)));

    // Get listing of all exports and compare against folder listings
    const foundExports: any = Object.keys(require(path.resolve(__dirname, indexFile)));
    const missingExports: string[] = components.filter((component: string) => !foundExports.includes(component));

    if (missingExports.length === 0) {
        return true;
    } else {
        throw new Error(`Missing exports: ${missingExports}`);
    }
}