/**
* Utility for converting README files to .tsx files.
* Usage: node build/convert-readme.js %path%
*/
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const argv = require("yargs").argv;
const MarkdownIt = require("markdown-it");

const srcDir = argv.src || "./src/**/README.md";

/**
 * Start and end file strings
 */
const startFile = `// Generated file from ../../build
/* tslint:disable */
import React from "react";
export default class Documentation extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>\n                `;

const endFile = `\n           </React.Fragment>
        );
    }
}\n`;

const emptyFile = `<p>No documentation provided.</p>`;

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true
});

/**
* All paths passed to the convert script
*/
const paths = argv._;

/**
 * Function to create string exports of a given path
 */
function exportReadme(readmePath) {
    const readmePaths = path.resolve(process.cwd(), srcDir);

    glob(readmePaths, void(0), function(error, files) {
        files.forEach((filePath) => {
            let documentation = startFile;
            const markdown = fs.readFileSync(filePath, "utf8");
            const exportPath = filePath.replace(/README\.md/, readmePath);

            if (markdown.length !== 0) {
                documentation += md.render(markdown);
            } else {
                documentation += emptyFile;
            }

            documentation += endFile;
            
            if (!fs.existsSync(exportPath)){
                fs.mkdirSync(exportPath);
            }

            fs.writeFileSync(path.resolve(exportPath, "documentation.tsx"), documentation);
        });
    });
}

/**
 * Convert all paths
 */
if (Array.isArray(paths)) {
    paths.forEach(exportReadme);
}
