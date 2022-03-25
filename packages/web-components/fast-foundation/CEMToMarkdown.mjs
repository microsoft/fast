import fs from 'fs';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

// Read the custom-elements.json file and parse the JSON
const fullManifest = JSON.parse(fs.readFileSync('dist/custom-elements.json', 'utf-8'));

// Loop through the manifest grouping modules from the same folder in order to produce one markdown file per component.
for(var i = 0; i < fullManifest.modules.length; i++)
{
    // We only care about javascript-modules.
    if(fullManifest.modules[i].kind === "javascript-module")
    {
        // Create a new manifest object just for this component.
        let componentManifest = {};
        componentManifest.schemaVersion = fullManifest.schemaVersion;
        componentManifest.readme = fullManifest.readme;
        componentManifest.modules = [];

        // Determine the component name from the path. This name will be used to group following modules.
        const currName = getComponentNameFromPath(fullManifest.modules[i].path);

        // Add it to the manifest.
        componentManifest.modules.push(fullManifest.modules[i]);

        // Continue looping through the main manifest, adding modules to the small manifest until we find a module with a different name.
        while(i<fullManifest.modules.length-1 && currName === getComponentNameFromPath(fullManifest.modules[i+1].path))
        {
            componentManifest.modules.push(fullManifest.modules[i+1]);
            i++;
        }

        // Convert out single component manifest into a markdown string.
        let markdown = customElementsManifestToMarkdown(componentManifest);

        // Clean up unneeded new lines within `` quotes as these tend to break rendering of the markdown.
        let index = 0;
        while(index<markdown.length)
        {
            const startIndex = markdown.indexOf('`',index);
            if(startIndex>=0 && startIndex<markdown.length)
            {
                const endIndex = markdown.indexOf('`',startIndex+1);
                if(endIndex>=0)
                {
                    const segment = markdown.substring(startIndex,endIndex);
                    markdown = markdown.replace(segment, segment.replaceAll('\r\n',' '));
                    index = endIndex+1;
                }
                else
                {
                    index=markdown.length+1;
                }
            }
            else
            {
                index=markdown.length+1;
            }
        }

        // Determine the output path and name for the markdown file.
        let path = fullManifest.modules[i].path + "";
        path = path.replace("src/","dist/esm/").replace(".ts",".cem.md");

        // Write out the markdown.
        fs.writeFileSync(path, markdown);

    }
}

function getComponentNameFromPath(path)
{
    return path.split('/')[1];
}
