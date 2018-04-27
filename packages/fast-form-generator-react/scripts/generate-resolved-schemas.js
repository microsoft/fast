const fs = require("fs");
const mkdirp = require("mkdirp");
const glob = require("glob");
const path = require("path");
const permutator = require("@microsoft/fast-permutator");

/**
 * Find all schemas and resolve them for use as child schemas in the component editor
 */
mkdirp(`./.tmp/schemas/`, function(err) {
    if (err) {
        throw err;
    }

    const schemas = [];
    const packages = {};
    const resolvedSchemas = [];
    const classNames = [];
    const files = glob.sync("./node_modules/@microsoft/fast-components-schemas/**/*.schema.json");

    for (const file of files) {
        const filePathItems = file.split("/");
        const package = filePathItems[filePathItems.length - 2];

        if (!packages[package]) {
            packages[package] = [];
        }

        packages[package].push(JSON.parse(fs.readFileSync(file, "utf-8")));
    }

    Object.keys(packages).forEach((package) => {
        // Store path to generated export file
        const generatedExportPath = path.resolve(__dirname, `../.tmp/schemas/${package}/index.js`);
        let generatedString = "// Generated file from scriptes/generate-resolved-schemas.ts - Do not edit\n\n";

        mkdirp.sync(`./.tmp/schemas/${package}/`);

        for (const schema of packages[package]) {
            let schemaWithResolvedProps = permutator.resolveSchemaProps(schema, packages[package], ["allOf", "$ref"]);
            schemaWithResolvedProps = permutator.resolveRecursiveReferences(schemaWithResolvedProps);

            const id = schemaWithResolvedProps.id.replace(/\/(components|modules|layouts|component)\//g, "");
            const className = schemaWithResolvedProps.id.replace(/-/g, "").replace(/\//g, "");
            const JSONObj = JSON.stringify(schemaWithResolvedProps, null, 2);

            // write each schema file into the resolved schemas directory
            fs.writeFileSync(
                `./.tmp/schemas/${package}/${id}.schema.json`,
                JSONObj,
                "utf8"
            );

            // store class names and concat into the generated index file
            classNames.push(className);
            generatedString += `import ${className} from './${id}.schema.json';\n`;
        }

        generatedString += `\n\nexport default [`;

        for (const className of classNames) {
            generatedString += `\n${className},`;
        }

        generatedString += `\n];`;

        // write the generated index file for exporting the array of imported schemas
        fs.writeFile(
            generatedExportPath,
            generatedString,
            "utf8",
            function(err) {
                if (err) {
                    throw err;
                }
            }
        );
    });
});
