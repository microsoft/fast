/**
 * Utility for converting README files to .tsx files.
 * Usage: node build/convert-readme.js %path%
 */
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
const MarkdownItAnchor = require("markdown-it-anchor");

const srcDirs = {
    tooling: "../../packages/tooling/fast-tooling/README.md",
    "tooling-react": "../../packages/tooling/fast-tooling-react/README.md",
};

/**
 * Start and end file strings
 */
const startFile = `// Generated file from ./build/convert-readme.js
/* eslint-disable no-irregular-whitespace */
export default \`<div class="guidance">`;
const endFile = `</div>\`;`;

const emptyFile = `<p>No guidance provided.</p>`;

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true,
}).use(MarkdownItAnchor);

/**
 * Function to create string exports of a given path
 */
(function exportReadme() {
    const srcDirEntries = Object.entries(srcDirs);
    const readmePaths = srcDirEntries.map(([, directory]) => {
        return path.resolve(process.cwd(), directory);
    });
    const destDirectory = srcDirEntries.map(([key]) => {
        return key;
    });

    readmePaths.forEach((readmePath, index) => {
        let guidance = startFile;
        const markdown = fs.readFileSync(readmePath, "utf8");
        const exportPath = path.resolve(process.cwd(), "app/.tmp");

        if (markdown.length !== 0) {
            guidance += md.render(markdown).replace(/`/g, "'");
        } else {
            guidance += emptyFile;
        }

        guidance += endFile;

        if (!fs.existsSync(exportPath)) {
            fs.mkdirSync(exportPath);
        }

        fs.writeFileSync(
            path.resolve(exportPath, `${destDirectory[index]}-guidance.ts`),
            guidance
        );
    });
})();
