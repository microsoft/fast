/**
 * Utility for converting README files to .tsx files.
 * Usage: node build/convert-readme.js %path%
 */
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const MarkdownIt = require("markdown-it");

const srcDir = "../../packages/web-components/fast-components/src/**/README.md";

/**
 * Start and end file strings
 */
const startFile = `// Generated file from ./build/convert-readme.js
import React from "react";
export default class guidance extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>\n                `;

const endFile = `\n           </React.Fragment>
        );
    }
}\n`;

const emptyFile = `<p>No guidance provided.</p>`;

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true,
});

/**
 * Function to create string exports of a given path
 */
(function exportReadme() {
    const readmePaths = path.resolve(process.cwd(), srcDir);
    console.log("readmePaths", readmePaths);

    glob(readmePaths, void 0, function(error, files) {
        files.forEach(filePath => {
            let guidance = startFile;
            const markdown = fs.readFileSync(filePath, "utf8");
            const exportPath = path.resolve(process.cwd(), "app/.tmp");
            const pathSegments = filePath.split("/");
            const componentFolderName = pathSegments[pathSegments.length - 2];

            if (markdown.length !== 0) {
                guidance += md.render(markdown);
            } else {
                guidance += emptyFile;
            }

            guidance += endFile;

            if (!fs.existsSync(exportPath)) {
                fs.mkdirSync(exportPath);
            }

            if (!fs.existsSync(path.resolve(exportPath, componentFolderName))) {
                fs.mkdirSync(path.resolve(exportPath, componentFolderName));
            }

            fs.writeFileSync(
                path.resolve(exportPath, componentFolderName, "guidance.tsx"),
                guidance
            );
        });
    });
})();
