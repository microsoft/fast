import * as path from "path";
import * as fs from "fs";

/**
 * Verifies all components in source directory are exported
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile: string): any {
    const onlyPath: string = path.dirname(indexFile);
    const components: string[] = [];
    const componentExportFile: string = path.resolve(__dirname, indexFile);
    const srcSubdirectories: string[] = fs.readdirSync(onlyPath).map(
        (name: string) => path.join("src", name)).filter(
            (source: string) => fs.statSync(source).isDirectory());
    
    console.log("srcSubdirectories: ", srcSubdirectories);
    srcSubdirectories.forEach((entry: string) => {
        components.push(entry.slice(4));
    });

    console.log("Components: ", components);

    const data: any = fs.readFileSync(componentExportFile, "UTF-8");
    const found: any = [];
    // Common regEx between core and MSFT exports
    const regEx: RegExp = /\* from "(.*?)"/g;
    let currentMatch: any;

    // tslint:disable-next-line:no-conditional-assignment
    while (currentMatch = regEx.exec(data.split("\n"))) {
        found.push(currentMatch[1].replace(/\.\//g, ""));
    }

    return components.filter((component: string) => !found.includes(component));
}