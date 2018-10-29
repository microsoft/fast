import * as path from "path";
import * as fs from "fs";
import { pascalCase } from "../../packages/fast-web-utilities";

/**
 * Verifies all components in source directory are exported
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile: string): boolean | Error {
    /**
     * Get the folders in the indexFile directory to compare to export listing
     */
    const directoryPath: string = path.dirname(indexFile);
    const components: string[] = [];
    const sourceDirectories: string[] = fs.readdirSync(directoryPath).map(
        (name: string) => path.join(directoryPath, name)).filter(
            (source: string) => fs.statSync(source).isDirectory());

    sourceDirectories.forEach((entry: string) => {
        components.push(pascalCase(path.basename(entry)));
    });

    /**
     * Get the index.ts exports in common
     */
    const foundExports: any = Object.keys(require(path.resolve(__dirname, indexFile)));
    const missingExports: string[] = components.filter((component: string) => !foundExports.includes(component));

    if (missingExports.length === 0) {
        return true;
    } else {
        throw new Error(`Missing exports: ${missingExports}`);
    }
}