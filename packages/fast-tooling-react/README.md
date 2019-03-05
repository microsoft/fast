# FAST Tooling React

The tooling available in FAST Tooling React can be used together to create UI for manipulating serializable data and viewing React components.

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) &nbsp; ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge) &nbsp; ![TypeScript](https://img.shields.io/badge/WAAPI-Supported-purple.svg?style=for-the-badge)

- [Benefits](#benefits)
- [Installation](#installation)
- [Concepts](#concepts)
    - [JSON Schema](#json-schema)
    - [Data structures for React Children](#data-structures-for-react-children)
- [Data utilities](#data-utilities)
    - [Mapping data to a React component](#mapping-data-to-a-react-component)
        - [Child options](#child-options)
        - [Using plugins](#using-plugins)
    - [Generating data from a JSON schema](#generating-data-from-a-json-schema) 

## Benefits

The FAST Tooling can be used in any combination for the following scenarios:
- Mapping serializable data to a React component in an application
- Editing data using a form generated from a JSON schema
- Viewing a React component in an isolated iframe environment
- Using a navigation generated from a components data
- All of the above to create a live editing UI

## Installation

`npm i --save @microsoft/fast-tooling-react`

## Concepts

### JSON Schema

[JSON schema](http://json-schema.org/) has been extended on for various libraries in FAST tooling, they help identify nesting structures for components and their children as well as provide additional hooks for plugin systems in the FAST tool libraries.

To identify React children in the JSON schemas, the JSON schema has been extended for the purposes of the FAST tooling libraries. This is optional, if your component does not accept children there is no need to add them to your components JSON schema. If it does, the children properties will need to be in their own properties section `reactProperties` and identified with the type "children".

Example JSON Schema with React children properties:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "title": "Component with react children-properties",
    "type": "object",
    "id": "component-with-two-children-properties",
    "reactProperties": {
        "children": {
            "title": "Children",
            "type": "children"
        },
        "otherChildren": {
            "title": "Children",
            "type": "children"
        }
    }
}
```

### Data structures for React children

React children are represented in a serializable structure which is then re-interpreted by FAST tooling. A React components children are represented by either an object (for a single child) or an array of objects (for multiple children) in the following structure:

```js
{
    "id": "my-component-id",
    "props": {
        // componentProps
    }
}
```

The `id` represents the JSON schema id and the `props` are the properties to map to the component.

## Data utilities

React data utilities are used to map data to components and perform other actions that may be necessary to pass data to other FAST tooling for manipulation, data validation, or storage.

### Mapping data to a React component

The `mapDataToComponent` function can be used to map data to a React component. It uses JSON Schema in conjunction with data that is meant to be serializable.

An example of mapping data to a component from the `@microsoft/fast-tooling-react` package:

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Heading } from "@microsoft/fast-components-react-msft";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import { mapDataToComponent } from "@microsoft/fast-tooling-react";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render() {
    ReactDOM.render(
        <Heading {...mapDataToComponent(headingSchema, { children: "Hello world" })} />,
        root
    );
}

render();
```

#### Child options

Using the `childOptions` argument allows the `mapDataToComponent` function to create nested structures. Child components will be identified by the provided `id` and the props will be applied to the appropriate component.

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialog } from "@microsoft/fast-components-react-msft";
import * as dialogSchema from "@microsoft/fast-components-react-base/dist/dialog/dialog.schema.json";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import * as paragraphSchema from "@microsoft/fast-components-react-msft/dist/paragraph/paragraph.schema.json";
import { mapDataToComponent } from "@microsoft/fast-tooling-react";

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

#### Using plugins
Using the `plugins` argument allows the `mapDataToComponent` to use plugins in place of the standard data mapping. Plugins must be extended from the `Plugin` class export and provide a `resolver` method. Plugins can use this method to transform provided data into another data type, for example converting a child component to a React render prop.

To enable the identification of data that should be handled by a plugin the following must be done: 
- Provide a `pluginId` to the JSON schema in the section related to the data.
- Initialize the plugin with the id (or array of ids) that correspond to one or more `pluginId`s.

React render prop plugin example:
```jsx
import { mapDataToComponent, Plugin } from "@microsoft/fast-tooling-react";

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

### Generating data from a JSON schema

Data may be generated from a JSON schema using the `getDataFromSchema` export. This will only generate the required items as dictated by the JSON schema, and will always choose the first potential match in any situation, for example if a property is an enum and is required, it will add the first value in the enum list.

An example of generating data from the `@microsoft/fast-tooling-react` package:

```javascript
import { getDataFromSchema } from "@microsoft/fast-tooling-react";
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";

const data = getDataFromSchema(schema);
```

#### Adding children as options

Children can also be auto-generated provided that they are not accompanied by `default` or `defaults` in the schema, which will be used first to add children. The first child in a list of provided `ids` will be used to create React children.

An example of generating data with other React children:

```javascript
import { getDataFromSchema } from "@microsoft/fast-tooling-react";
import * as contextMenu from "@microsoft/fast-components-react-msft/dist/context-menu/context-menu.schema.json";
import * as contextMenuItem from "@microsoft/fast-components-react-msft/dist/context-menu-item/context-menu-item.schema.json";

const childOptions = [
    {
        schema: contextMenuItem,
        component: null
    }
];

const data = getDataFromSchema(schema, childOptions);
```
