const fs = require("node:fs/promises");
const path = require("node:path");

async function writeVersionEntryPoint(versionRoot, publicVersion) {
    const introductionUrl = `/docs/${publicVersion}/introduction/`;
    const content = [
        "---",
        `permalink: "/docs/${publicVersion}/index.html"`,
        "eleventyExcludeFromCollections: true",
        "---",
        `<meta http-equiv="refresh" content="0; url=${introductionUrl}">`,
        `<link rel="canonical" href="${introductionUrl}">`,
        `<p><a href="${introductionUrl}">Continue to the FAST ${publicVersion} documentation.</a></p>`,
        "",
    ].join("\n");

    await fs.writeFile(path.join(versionRoot, "index.md"), content);
}

module.exports = {
    writeVersionEntryPoint,
};
