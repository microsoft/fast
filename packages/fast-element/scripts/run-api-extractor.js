import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiExtractorConfig(name) {
    return path.resolve(__dirname, `../api-extractor.${name}.json`);
}

export const exportPaths = [
    {
        path: "./context.js",
        docsFolder: "context",
        configPath: apiExtractorConfig("context"),
    },
    {
        path: "./declarative.js",
        docsFolder: "declarative",
        configPath: apiExtractorConfig("declarative"),
    },
    {
        path: "./declarative-utilities.js",
        docsFolder: "declarative-utilities",
        configPath: apiExtractorConfig("declarative-utilities"),
    },
    {
        path: "./di.js",
        docsFolder: "di",
        configPath: apiExtractorConfig("di"),
    },
    {
        path: "./attribute-map.js",
        docsFolder: "attribute-map",
        configPath: apiExtractorConfig("attribute-map"),
    },
    {
        path: "./observer-map.js",
        docsFolder: "observer-map",
        configPath: apiExtractorConfig("observer-map"),
    },
    {
        path: "./hydration.js",
        docsFolder: "hydration",
        configPath: apiExtractorConfig("hydration"),
    },
    {
        path: "./binding.js",
        docsFolder: "binding",
        configPath: apiExtractorConfig("binding"),
    },
    {
        path: "./two-way.js",
        docsFolder: "two-way",
        configPath: apiExtractorConfig("two-way"),
    },
    {
        path: "./signal.js",
        docsFolder: "signal",
        configPath: apiExtractorConfig("signal"),
    },
    {
        path: "./schema.js",
        docsFolder: "schema",
        configPath: apiExtractorConfig("schema"),
    },
    {
        path: "./dom.js",
        docsFolder: "dom",
        configPath: apiExtractorConfig("dom"),
    },
    {
        path: "./updates.js",
        docsFolder: "updates",
        configPath: apiExtractorConfig("updates"),
    },
    {
        path: "./styles.js",
        docsFolder: "styles",
        configPath: apiExtractorConfig("styles"),
    },
    {
        path: "./arrays.js",
        docsFolder: "arrays",
        configPath: apiExtractorConfig("arrays"),
    },
    {
        path: "./array-observer.js",
        docsFolder: "array-observer",
        configPath: apiExtractorConfig("array-observer"),
    },
    {
        path: "./observable.js",
        docsFolder: "observable",
        configPath: apiExtractorConfig("observable"),
    },
    {
        path: "./volatile.js",
        docsFolder: "volatile",
        configPath: apiExtractorConfig("volatile"),
    },
    {
        path: "./attr.js",
        docsFolder: "attr",
        configPath: apiExtractorConfig("attr"),
    },
    {
        path: "./css.js",
        docsFolder: "css",
        configPath: apiExtractorConfig("css"),
    },
    {
        path: "./html.js",
        docsFolder: "html",
        configPath: apiExtractorConfig("html"),
    },
    {
        path: "./templating.js",
        docsFolder: "templating",
        configPath: apiExtractorConfig("templating"),
    },
    {
        path: "./render.js",
        docsFolder: "render",
        configPath: apiExtractorConfig("render"),
    },
    {
        path: "./children.js",
        docsFolder: "children",
        configPath: apiExtractorConfig("children"),
    },
    {
        path: "./node-observation.js",
        docsFolder: "node-observation",
        configPath: apiExtractorConfig("node-observation"),
    },
    {
        path: "./ref.js",
        docsFolder: "ref",
        configPath: apiExtractorConfig("ref"),
    },
    {
        path: "./slotted.js",
        docsFolder: "slotted",
        configPath: apiExtractorConfig("slotted"),
    },
    {
        path: "./when.js",
        docsFolder: "when",
        configPath: apiExtractorConfig("when"),
    },
    {
        path: "./repeat.js",
        docsFolder: "repeat",
        configPath: apiExtractorConfig("repeat"),
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
