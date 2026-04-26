import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportPaths = [
    {
        path: "./context.js",
        docsFolder: "context",
        configPath: path.resolve(__dirname, "../api-extractor.context.json"),
    },
    {
        path: "./declarative.js",
        docsFolder: "declarative",
        configPath: path.resolve(__dirname, "../api-extractor.declarative.json"),
    },
    {
        path: "./di.js",
        docsFolder: "di",
        configPath: path.resolve(__dirname, "../api-extractor.di.json"),
    },
    {
        path: "./extensions/attribute-map.js",
        docsFolder: "extensions/attribute-map",
        configPath: path.resolve(
            __dirname,
            "../api-extractor.extensions.attribute-map.json",
        ),
    },
    {
        path: "./extensions/observer-map.js",
        docsFolder: "extensions/observer-map",
        configPath: path.resolve(
            __dirname,
            "../api-extractor.extensions.observer-map.json",
        ),
    },
    {
        path: "./hydration.js",
        docsFolder: "hydration",
        configPath: path.resolve(__dirname, "../api-extractor.hydration.json"),
    },
    {
        path: "./updates.js",
        docsFolder: "updates",
        configPath: path.resolve(__dirname, "../api-extractor.updates.json"),
    },
    {
        path: "./styles.js",
        docsFolder: "styles",
        configPath: path.resolve(__dirname, "../api-extractor.styles.json"),
    },
    {
        path: "./arrays.js",
        docsFolder: "arrays",
        configPath: path.resolve(__dirname, "../api-extractor.arrays.json"),
    },
    {
        path: "./array-observer.js",
        docsFolder: "array-observer",
        configPath: path.resolve(__dirname, "../api-extractor.array-observer.json"),
    },
    {
        path: "./observable.js",
        docsFolder: "observable",
        configPath: path.resolve(__dirname, "../api-extractor.observable.json"),
    },
    {
        path: "./volatile.js",
        docsFolder: "volatile",
        configPath: path.resolve(__dirname, "../api-extractor.volatile.json"),
    },
    {
        path: "./attr.js",
        docsFolder: "attr",
        configPath: path.resolve(__dirname, "../api-extractor.attr.json"),
    },
    {
        path: "./css.js",
        docsFolder: "css",
        configPath: path.resolve(__dirname, "../api-extractor.css.json"),
    },
    {
        path: "./html.js",
        docsFolder: "html",
        configPath: path.resolve(__dirname, "../api-extractor.html.json"),
    },
    {
        path: "./directives/children.js",
        docsFolder: "directives/children",
        configPath: path.resolve(__dirname, "../api-extractor.directives.children.json"),
    },
    {
        path: "./directives/ref.js",
        docsFolder: "directives/ref",
        configPath: path.resolve(__dirname, "../api-extractor.directives.ref.json"),
    },
    {
        path: "./directives/slotted.js",
        docsFolder: "directives/slotted",
        configPath: path.resolve(__dirname, "../api-extractor.directives.slotted.json"),
    },
    {
        path: "./directives/when.js",
        docsFolder: "directives/when",
        configPath: path.resolve(__dirname, "../api-extractor.directives.when.json"),
    },
    {
        path: "./directives/repeat.js",
        docsFolder: "directives/repeat",
        configPath: path.resolve(__dirname, "../api-extractor.directives.repeat.json"),
    },
];

(function () {
    exportPaths.forEach(exportPath => {
        const docsFolder = path.resolve(__dirname, `../docs/${exportPath.docsFolder}`);
        // Create folders in the docs directory
        if (!fs.existsSync(docsFolder)) {
            fs.mkdirSync(docsFolder, { recursive: true });
        }

        // Load and parse the api-extractor.json file
        const extractorConfig = ExtractorConfig.loadFileAndPrepare(exportPath.configPath);

        // Invoke API Extractor
        const extractorResult = Extractor.invoke(extractorConfig, {
            // Equivalent to the "--local" command-line parameter
            localBuild: process.argv[2] !== "ci",
        });

        if (extractorResult.succeeded) {
            console.log(
                `API Extractor completed successfully for ${exportPath.configPath}`,
            );
        } else {
            console.error(
                `API Extractor completed with ${extractorResult.errorCount} errors` +
                    ` and ${extractorResult.warningCount} warnings for ${exportPath.configPath}`,
            );
        }
    });
})();
