const path = require("path");
const fs = require("fs");

/**
 * Verifies all components in source directory are exported
 */
export function includesAllSubdirectoriesAsNamedExports(indexFile: string) {
    const srcSubdirectories: string[] = fs.readdirSync("src").map(
        (name) => path.join("src", name)).filter(
            (source) => fs.lstatSync(source).isDirectory());
    const components: string[] = [];
    const componentExportFile: string = path.resolve(__dirname, indexFile);

    srcSubdirectories.forEach((entry: string) => {
        components.push(entry.slice(4));
    });

    const data: any = fs.readFileSync(componentExportFile, "UTF-8");
    const found: any = [];
    // Common regEx between core and MSFT exports
    const regEx: RegExp = /\* from "(.*?)"/g;
    let currentMatch: any;

    while (currentMatch = regEx.exec(data.split("\n"))) {
        found.push(currentMatch[1].replace(/\.\//g, ""));
    }

    return components.filter((component: string) => !found.includes(component));
}