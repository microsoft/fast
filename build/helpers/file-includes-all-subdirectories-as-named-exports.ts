import * as path from "path";
import * as fs from "fs";

/**
 * Verifies all components in source directory are exported
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile: string): any {
    /**
     * Get the folders in the indexFile directory to compare to export listing
     */
    const directoryPath: string = path.dirname(indexFile);
    const components: string[] = [];
    const sourceDirectories: string[] = fs.readdirSync(directoryPath).map(
        (name: string) => path.join(directoryPath, name)).filter(
            (source: string) => fs.statSync(source).isDirectory());
    
    sourceDirectories.forEach((entry: string) => {
        components.push(path.basename(entry));
    });

    /**
     * Get the index.ts exports in common
     * Cannot use require(foo) because export syntax varies
     */
    const componentExportFile: string = path.resolve(__dirname, indexFile);
    const data: any = fs.readFileSync(componentExportFile, "UTF-8");
    const found: any = [];
    const regEx: RegExp = /\* from "(.*?)"/g;
    let currentMatch: RegExpExecArray;

    // tslint:disable-next-line:no-conditional-assignment
    while (currentMatch = regEx.exec(data.split("\n"))) {
        found.push(currentMatch[1].replace(/\.\//g, ""));
    }

    const missingExports: string[] = components.filter((component: string) => !found.includes(component));

    if (missingExports.length === 0) {
        return true;
    } else {
        throw new Error(`Missing exports: ${missingExports}`);
    }
}