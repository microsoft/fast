# FAST React data utilities
React data utilities are used to map data to components and perform other actions that may be necessary to pass data to other FAST-DNA libraries for manipulation, data validation, or storage. It relies on the creation of relevant JSON schemas for components, JSON schemas for the purposes of React use additional keyword of `reactProperties` for React children with the "type" of "children".

## Installation
`npm i --save @microsoft/fast-data-utilities-react`

## Usage
### `mapDataToComponent`
The `mapDataToComponent` function can be used to map data to a React component. It uses JSON Schema, IDs, as well as data to create components from plain data.

An example of mapping data to a component from the `@microsoft/fast-data-utilities-react` package:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { Dialog } from "@microsoft/fast-components-react-msft";
import * as dialogSchema from "@microsoft/fast-components-react-base/dist/dialog/dialog.schema.json";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import * as paragraphSchema from "@microsoft/fast-components-react-msft/dist/paragraph/paragraph.schema.json";
import { mapDataToComponent } from "@microsoft/fast-data-utilities-react";

const data = {
    visible: true,
    children: [
        {
            id: headingSchema.id,
            props: {
                children: "Heading 1"
            }
        },
        {
            id: paragraphSchema.id,
            props: {
                children: "Lorem ipsum."
            }
        }
    ]
};

const childOptions = [
    { component: Heading, schema: headingSchema },
    { component: Paragraph, schema: paragraphSchema },
];

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render() {
    ReactDOM.render(
        <Dialog {...mapDataToComponent(dialogSchema, data, childOptions)} />,
        root
    );
}

render();
```

#### Plugins
As an optional argument to `mapDataToComponent`, plugins may be used. Plugins must be extended from the `Plugin` class export and provide a `resolver` method. In this way functional code can be mapped to a component.

React render prop plugin example:
```jsx
import { mapDataToComponent, Plugin } from "@microsoft/fast-data-utilities-react";

class MyPlugin extends Plugin {
    resolver(data, childOption) {
        return (className) => {
            return React.createElement(
                childOption.component,
                Object.assign({}, data.props, { className })
            );
        };
    }
}
```

Schema example for the React render prop plugin example:
```json
{
    "$schema": "http://json-schema.org/schema#",
    "title": "Component with custom properties",
    "type": "object",
    "id": "component-with-react-render-prop",
    "reactProperties": {
        "children": {
            "title": "Children",
            "type": "children",
            "pluginId": "my-plugin"
        }
    }
}
```

```jsx
/**
 * The plugins take a configuration that includes a string or an array of strings
 * mapping them to schema properties which also have a `pluginId`
 */
const plugins = [
    new MyPlugin({
        id: "my-plugin"
    })
];

mapDataToComponent(schema, data, childOptions, plugins);
```

### `getChildOptionBySchemaId`
The `getChildOptionBySchemaId` accepts a list of child options and returns the one that matches the schema ID.

```js
import { getChildOptionBySchemaId } from "@microsoft/fast-data-utilities-react";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import * as paragraphSchema from "@microsoft/fast-components-react-msft/dist/paragraph/paragraph.schema.json";

const childOptions = [
    { component: Heading, schema: headingSchema },
    { component: Paragraph, schema: paragraphSchema },
];

const headingChildOption = getChildOptionBySchemaId(headingSchema.id, childOptions); // should be { component: Heading, schema: headingSchema }
```

### `getDataLocationsOfChildren`
The `getDataLocationsOfChildren` returns any data locations of react children. This assumes that the 


```js
import { getDataLocationsOfChildren } from "@microsoft/fast-data-utilities-react";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";

const headingData = {
    children: "Hello world"
};

const dataLocationsOfChildren = getDataLocationsOfChildren(headingSchema, headingData, []); // should be ["children"]
```

### `getPartialData`
The `getPartialData` function returns partial data based on a location path using the `lodash` path syntax.

```js
import { getPartialData } from "@microsoft/fast-data-utilities-react";

const data = {
    foo: {
        bar: [
            {
                bat: "Hello world"
            }
        ]
    }
}

const location = "foo.bar.0";

const partialData = getPartialData(location, data); // should be { bat: "Hello world" }
```

### `mapSchemaLocationFromDataLocation`
The `mapSchemaLocationFromDataLocation` takes a `lodash` path to data, the data and the corresponding schema to determine the schemas path to that data.

```js
import { mapSchemaLocationFromDataLocation } from "@microsoft/fast-data-utilities-react";

const dataLocation = "children";
const data = {
    children: "Hello world"
};
const schema = {
    type: "object",
    reactProperties: {
        children: {
            type: "children"
        }
    }
}

const schemaLocation = mapSchemaLocationFromDataLocation(dataLocation, data, schema); // should be "reactProperties.children"
```

### `normalizeDataLocation`
The `normalizeDataLocation` converts all property locations to `lodash` path dot notation and all array item references to bracket notation

```js
import { normalizeDataLocation } from "@microsoft/fast-data-utilities-react";

const dataLocation = "foo.bar[0].bat";
const data = {
    foo: {
        bar: [
            {
                bat: "Hello world"
            }
        ]
    }
}
const normalizedDataLocation = normalizeDataLocation(dataLocation, data); // should be "foo.bar.0.bat"
```
