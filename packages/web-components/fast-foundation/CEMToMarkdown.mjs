import fs from "fs";
import { default as os } from "os";
import { customElementsManifestToMarkdown } from "@custom-elements-manifest/to-markdown";

// new line and double new line shorthands
const LF = os.EOL;
const LF2 = LF + LF;

// Read the custom-elements.json file and parse the JSON
const fullManifest = JSON.parse(fs.readFileSync("dist/custom-elements.json", "utf-8"));

// Filter out template modules and ensure that they are in alphabetical order
const modules = fullManifest.modules
    .filter(module => module.path.indexOf("template.ts") === -1)
    .sort((a, b) =>
        getComponentNameFromPath(a.path).localeCompare(getComponentNameFromPath(b.path))
    );

// Loop through the manifest grouping modules from the same folder in order to produce one markdown file per component.
for (var i = 0, modulesLength = modules.length; i < modulesLength; i++) {
    // We only care about javascript-modules.
    if (modules[i].kind === "javascript-module") {
        // Create a new manifest object just for this component.
        let componentManifest = {};
        componentManifest.schemaVersion = fullManifest.schemaVersion;
        componentManifest.readme = fullManifest.readme;
        componentManifest.modules = [];

        // Determine the component name from the path. This name will be used to group following modules.
        const currName = getComponentNameFromPath(modules[i].path);
        const componentIndex = i;

        componentManifest.modules.push(modules[i]);

        // Continue looping through the main manifest, adding modules to the small manifest until we find a module with a different name.
        // Include modules with names like "component-item" so components like Accordion and Accordion-item are included in the same file.
        // Include modules with names like "component-label" so components like Slider and Slider-label are included in the same file.
        while (
            i < modules.length - 1 &&
            (currName === getComponentNameFromPath(modules[i + 1].path) ||
                currName + "-item" === getComponentNameFromPath(modules[i + 1].path) ||
                currName + "-label" === getComponentNameFromPath(modules[i + 1].path))
        ) {
            componentManifest.modules.push(modules[i + 1]);
            i++;
        }

        // Special logic for the "tab" components.
        // If the current module is "tabs" include the previous two modules which should be "tab" and "tab-panel".
        if (currName === "tabs") {
            componentManifest.modules.push(modules[i - 1]);
            componentManifest.modules.push(modules[i - 2]);
        }

        // enclose html tags in `` to prevent tags in comments from confusing docusaurus
        // and remove new line characters from descriptions
        componentManifest.modules.forEach(module => {
            module.declarations?.forEach(dec => {
                if (dec.description) {
                    dec.description = replaceJSDOCLinksWithMDLinks(
                        fixTagsInText(dec.description.replaceAll(LF, " "))
                    );
                }
                if (dec.default) {
                    dec.default = replaceJSDOCLinksWithMDLinks(
                        fixTagsInText(dec.default.replaceAll(LF, " "))
                    );
                }
                if (dec.type) {
                    dec.type.text = cleanUpVariableTypes(dec.type.text);
                }
                dec.members?.forEach(member => {
                    if (member.description) {
                        member.description = replaceJSDOCLinksWithMDLinks(
                            fixTagsInText(member.description.replaceAll(LF, " "))
                        );
                    }
                    if (member.default) {
                        member.default = replaceJSDOCLinksWithMDLinks(
                            fixTagsInText(member.default.replaceAll(LF, " "))
                        );
                    }
                    if (member.return?.type?.text) {
                        // these are already rendered inside of back-ticks so we only need to remove new lines
                        member.return.type.text = member.return.type.text.replaceAll(
                            LF,
                            " "
                        );
                    }
                });
                dec.attributes?.forEach(attr => {
                    if (attr.description) {
                        attr.description = replaceJSDOCLinksWithMDLinks(
                            fixTagsInText(attr.description.replaceAll(LF, " "))
                        );
                    }
                });
            });
        });

        // Convert the single component manifest into a markdown string.
        let markdown = customElementsManifestToMarkdown(componentManifest, {
            headingOffset: 1,
            private: "hidden",
            omitDeclarations: ["exports"],
            omitSections: ["static-methods"],
        });

        // Replace our < and > markers with backticks and < >
        // This is necessary because customElementsManifestToMarkdown escapes the backticks during the conversion
        // and we don't want that because then docusaurus will see the tags as real tags instead of just text.
        markdown = markdown.replaceAll("REPLACELT", "`<").replaceAll("REPLACEGT", ">`");

        // Clean up some additional formatting issues
        // Remove the file source header
        markdown = markdown.replaceAll(/## `src.*`:/g, "");
        // Fix escape of colon in urls
        markdown = markdown.replaceAll("https\\:", "https:");
        // Fix escape of . in some urls
        markdown = markdown.replaceAll("www\\.w3", "www.w3");
        // Fix escape of open bracket on links
        markdown = markdown.replaceAll("\\[", "[");
        // Fix escape of open paren on links
        markdown = markdown.replaceAll("\\(", "(");

        // Replace \| with 'or'
        markdown = markdown.replaceAll("\\|", "or");

        // Get the README.md file
        let path = modules[componentIndex].path.split("/");
        path[path.length - 1] = "README.md";
        path = path.join("/");

        // If a README.md file exists
        if (fs.existsSync(path)) {
            // Read the contents of the file
            let readMe = fs.readFileSync(path, "utf-8");

            // Find the location of the "## API" section
            let apiLoc = readMe.indexOf("## API");

            // Find the location of the "## Additional resources" section
            let resourcesLoc = readMe.indexOf("## Additional resources");

            // If the API section does not exist then create it either just
            // above the Additional Resources section or at the end of the file.
            if (apiLoc === -1) {
                // no API section yet so add it
                if (resourcesLoc > 0) {
                    // add API section above Additional Resources
                    readMe = readMe.replace(
                        "## Additional resources",
                        "## API" + LF2 + "## Additional resources"
                    );
                } else {
                    // add API to the end
                    readMe += LF2 + "## API";
                }

                // Get the updated locations
                apiLoc = readMe.indexOf("## API");
                resourcesLoc = readMe.indexOf("## Additional resources");
            }

            // customElementsManifestToMarkdown() hard codes line endings as '/n'. This causes GIT to detect changes
            // to the file on windows environments even if nothing but the line endings change. If the os.EOL is '\r\n'
            // then replace all '\n' in the markdown with '\r\n'.
            if (LF === "\r\n") {
                markdown = markdown.replaceAll("\n", "\r\n");
            }

            // Replace everything in between the API and Additional Resources sections with the
            // updated markdown.
            const startIndex = apiLoc;
            const endIndex = resourcesLoc >= 0 ? resourcesLoc : readMe.length;
            readMe = readMe.replace(
                readMe.slice(startIndex, endIndex),
                "## API" + LF2 + markdown + LF2
            );

            // Replace the README.md file with the new content.
            fs.writeFileSync(path, readMe);
        }
    }
}

function getComponentNameFromPath(path) {
    return path.split("/")[1];
}

function fixTagsInText(text) {
    // replace < and > characters in text with something that can be easily replaced later.
    return text.replaceAll(/<.*>/gi, match => {
        return match.replace("<", "REPLACELT").replace(">", "REPLACEGT");
    });
}

function replaceJSDOCLinksWithMDLinks(text) {
    // Replace jsdoc links with markdown links
    // [TEXT]{@link URL} => [TEXT](URL)
    // {@link URL} => URL
    // {@link URL TEXT} => [TEXT](URL)
    // {@link URL | TEXT} => [TEXT](URL)
    return text
        .replace(/\[(.*)\]\{@link (\S*)\}/gm, "[$1]($2)")
        .replace(/\{@link (\S*)\}/gm, "$1")
        .replace(/\{@link (\S*)\s*\|?\s*([^}]+?)\s*\}/gm, "[$2]($1)");
}

function cleanUpVariableTypes(text) {
    // Remove block comments
    text = text.replace(/\/\*(.|\s)*?\*\//gm, "");
    // Remove inline comments, line breaks, and extra spaces
    return text
        .replace(/\/\/.*$/gm, "")
        .replace(/\s+/gm, " ");
}
