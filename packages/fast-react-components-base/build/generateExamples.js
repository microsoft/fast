const fs = require('fs');
const path = require('path');
const glob = require('glob');

const destDir = path.resolve(__dirname, '../app');
const destFile = `${destDir}/examples.ts`;
const examplePaths = glob.sync(path.resolve(__dirname, '../src/**/examples.data.ts'));

const convertToCamelCase = (itemName) => {
    itemName = `${itemName.charAt(0).toLowerCase()}${itemName.slice(1)}`;

    return itemName.replace(/-[a-z]/g, function(a) {
        return a.charAt(1).toUpperCase();
    });
};

if (Array.isArray(examplePaths)) {
    fs.writeFileSync(destFile, '// FILE IS AUTOMATICALLY GENERATED - DO NOT EDIT\n', (err) => {
        if (err) {
            throw err;
            return;
        }
    });

    for (let i = 0; i < examplePaths.length; i++) {
        let componentName, importPath, exportPath;
        
        componentName = examplePaths[i].split('/');
        componentName = `${componentName[componentName.length - 2]}`;
        importPath = `import ${convertToCamelCase(componentName)}Examples from "../src/${componentName}/examples.data";`
        exportPath = `export {${convertToCamelCase(componentName)}Examples};`;

        fs.appendFileSync(destFile, '\n' + importPath + '\n', (err) => {
            if (err) {
                throw err;
                return;
            }
        });

        fs.appendFileSync(destFile, exportPath + '\n', (err) => {
            if (err) {
                throw err;
                return;
            }
        });
    }
}