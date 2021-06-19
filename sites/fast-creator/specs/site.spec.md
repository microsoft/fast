# Creator specifications

This file contains all specifications in regards to the Creator app's architecture and planning. Additional information may be referred to from supplemental markdown files.

- [Projects](#projects)
    - [Web component libraries](#web-component-libraries)
        - [Adding a library](#adding-a-library)

## Projects

Projects are the serializable data that users create and modify in the FAST Creator app. They consist of multi-page layouts representing sites.

### Web component libraries

A project can include web component libraries such as FAST components, these are opt-in.

#### Adding a library

Libraries are available in the component tab in the left pane, they can be enabled and this will give the user autocompletion in the `<Form />` linked data field as well as providing a list of components that can be drag and dropped onto the preview area. Adding a library will allow the components in the library to be rendered in the preview.

Each library will be defined by a configuration which includes the web components themselves, data examples that will be used when a component is added, the tag name of the components and the display name. See the [typings](./app/configs/typings.ts) file for the interface.

When a user adds a library to a project, this library configuration will be dynamically imported. Available libraries will be referenced by a JSON file, this file will be used to create a UI and should be auto-generated. The `examples`, `schema` and `displayName` should be provided by the library.

Available libraries JSON file:
```json
[
    {
        "id": "my-components",
        "displayName": "My Components",
        "import": "./my-components.min.js",
        "components": {
            "my-button": {
                "displayName": "My Button",
                "schema": {
                    "id": "my-button",
                    "$id": "my-button",
                    "type": "object",
                    "properties": {
                        "disabled": {
                            "type": "boolean"
                        }
                    }
                },
                "example": {
                    "disabled": true
                }
            }
        }
    }
]
```

Importing the library in `creator.tsx`:
```tsx
import availableLibraries from "./available-libraries.json";

function handleAddLibrary(library) {
    return (e: React.MouseEvent<HTMLButton>) => {
        // Send a message to the preview
        this.fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            options: {
                originatorId: "fast-creator::root",
                action: "library::add",
            },
            data: library.import,
        }
    };
}

function renderAddLibraryButtons(): React.ReactNode {
    return availableLibraries.map((library) => {
        return (
            <button onChange={handleAddLibrary(library)}>
                + {library.displayName}
            </button>
        );
    });
}
```

Defining the library in `preview.tsx`:
```tsx
function handleMessageSystem(message: MessageEvent) {
    // check that the available library is being added
    // using the custom type and the options to determine the action
    async () => {
        await import(message.data);

        // notify the Creator that the library has been loaded
        window.postMessage(
            {
                type: MessageSystemType.custom,
                options: {
                    originatorId: "fast-creator::preview",
                    action: "library::added"
                },
                data: message.id,
            },
            "*"
        );
    }
}
```

This will then change the look of the buttons in `creator.tsx` to reflect that the library has been added.
