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
        const componentIndex = i;

        // Add it to the manifest.
        componentManifest.modules.push(fullManifest.modules[i]);

        // Continue looping through the main manifest, adding modules to the small manifest until we find a module with a different name.
        while(i<fullManifest.modules.length-1 &&
            (
                currName === getComponentNameFromPath(fullManifest.modules[i+1].path) ||
                currName+"-item" === getComponentNameFromPath(fullManifest.modules[i+1].path)
            )
        )
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

        // Get the README.md file
        let path = fullManifest.modules[componentIndex].path.split('/');
        path[path.length-1] = "README.md";
        path = path.join('/');
        if(fs.existsSync(path))
        {
            let readMe = fs.readFileSync(path, 'utf-8');
            let apiLoc = readMe.indexOf("## API");
            let resourcesLoc = readMe.indexOf("## Additional resources");
            if(apiLoc===-1)
            {
                // no API section yet so add it
                if(resourcesLoc>0)
                {
                    // add API section above Additional Resources
                    readMe = readMe.replace("## Additional resources","## API\r\n\r\n## Additional resources");
                }
                else
                {
                    // add API to the end
                    readMe+="\r\n\r\n## API";
                }
                apiLoc = readMe.indexOf("## API");
                resourcesLoc = readMe.indexOf("## Additional resources")
            }
            const startIndex = apiLoc;
            const endIndex = resourcesLoc >=0 ? resourcesLoc : readMe.length-1;

            readMe = readMe.replace(readMe.slice(startIndex,endIndex),"## API\r\n\r\n"+markdown+"\r\n\r\n");

            fs.writeFileSync(path, readMe);
        }

    }
}

function getComponentNameFromPath(path)
{
    return path.split('/')[1];
}
