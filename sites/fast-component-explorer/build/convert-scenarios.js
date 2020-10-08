/**
 * This build script takes scenarios written in the @microsoft/fast-components
 * package and converts them into the @microsoft/fast-tooling DataDictionary format
 */

const path = require("path");
const glob = require("glob");
const fs = require("fs");
const jsdom = require("jsdom");

const srcDir = "../../packages/web-components/fast-components/src/**/scenarios/*.html";

/**
 * Start file string
 */
const startFile = `// Generated file from ./build/convert-scenarios.js
export default `;

/**
 * Function to convert scenarios into a format that can be imported and should look like:
 *
 * {
 *     "displayName": "Scenario description",
 *     "html": "<div>Scenario</div>"
 * }
 */
(function convertScenarios() {
    const scenarioPaths = path.resolve(process.cwd(), srcDir);

    glob(scenarioPaths, void 0, function (error, files) {
        const exportPath = path.resolve(process.cwd(), "app/.tmp");

        if (!fs.existsSync(exportPath)) {
            fs.mkdirSync(exportPath);
        }

        files.forEach(filePath => {
            const html = fs.readFileSync(filePath, "utf8");
            const dom = new jsdom.JSDOM(html);
            const pathSegments = filePath.split("/");
            const componentFolderName = pathSegments[pathSegments.length - 3];
            const templates = dom.window.document.querySelectorAll("template");

            if (templates.length && templates.length > 0) {
                const scenarios = [];

                if (!fs.existsSync(path.resolve(exportPath, componentFolderName))) {
                    fs.mkdirSync(path.resolve(exportPath, componentFolderName));
                }

                templates.forEach(template => {
                    scenarios.push({
                        displayName: template.getAttribute("title"),
                        html: template.innerHTML,
                    });
                });

                fs.writeFileSync(
                    path.resolve(exportPath, componentFolderName, "scenario.js"),
                    `${startFile} ${JSON.stringify(scenarios, null, 2)}`
                );
            } else {
                throw `No available templates in: ${filePath}`;
            }
        });
    });
})();
