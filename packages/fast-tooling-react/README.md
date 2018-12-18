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
- [Navigation](#navigation)
- [Viewer](#viewer)
    - [Setting width and height](#setting-width-and-height)
    - [Custom messaging](#custom-messaging)
    - [Viewer content](#viewer-content)
    - [Select device](#select-device)
        - [Devices](#devices)
    - [Rotate](#rotate)
- [CSS Editor](#css-editor)
    - [Spacing](#spacing)
    - [Position](#position)
- [Form](#form)
    - [Using form plugins](#using-form-plugins)
    - [React children as options](#react-children-as-options)
    - [Controlling the visible section](#controlling-the-visible-section)
    - [JSON schema metadata](#json-schema-metadata)
        - [Title](#title)
        - [Disabled](#disabled)
        - [Examples & default](#examples-&-default)
    - [JSON schema keywords](#json-schema-keywords)
        - [oneOf & anyOf](#oneof-&-anyof)
        - [Enums](#enums)
        - [React children](#react-children)
        - [allOf & $ref](#allof-&-ref)


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
import React from "react";
import ReactDOM from "react-dom";
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
import React from "react";
import ReactDOM from "react-dom";
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

Children can also be auto-generated provided that they are not accompanied by `default`, `examples` or `defaults` in the schema, which will be used first to add children. The first child in a list of provided `ids` will be used to create React children.

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

## Navigation

The `Navigation` component uses data structures as specified by the [children](#data-structures-for-react-children) data structure to create a tree view. It includes a callback for updating the data location if you are using it with other exports from this package and can be controlled or uncontrolled.

**Schemas used by the examples below can be found [here](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-tooling-react/app/configs/children.schema.json) and [here](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-tooling-react/app/configs/no-children.schema.json)**

**Uncontrolled example**:

```jsx
import React from "react";
import { Navigation } from "@microsoft/fast-tooling-react";
import noChildrenSchema from "./no-children.schema.json";
import childrenSchema from "./children.schema.json";

export class Example extends React.Component {
    render() {
        return (
            <Navigation
                data={this.getData()}
                schema={childrenSchema}
                childOptions={this.getChildOptions()}
            />
        );
    }

    getData() {
        return {
            children: [
                {
                    id: get(childrenSchema, "id"),
                    props: {
                        children: {
                            id: get(noChildrenSchema, "id"),
                            props: noChildren,
                        }
                    }
                }
            ]
        };
    }

    getChildOptions() {
        return [
            {
                component: null,
                schema: noChildrenSchema,
            },
            {
                component: null,
                schema: childrenSchema,
            },
        ];
    }
}
```

**Controlled example**:
Both the `dataLocation` and `onLocationUpdate` props are optional, including both of them will allow the component to be fully controlled.

```jsx
import React from "react";
import { Navigation } from "@microsoft/fast-tooling-react";
import noChildrenSchema from "./no-children.schema.json";
import childrenSchema from "./children.schema.json";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLocation: ""
        };
    }

    render() {
        return (
            <Navigation
                data={this.getData()}
                schema={childrenSchema}
                childOptions={this.getChildOptions()}
                dataLocation={this.state.dataLocation}
                onLocationUpdate={this.handleLocationUpdate}
            />
        );
    }

    getData() {
        return {
            children: [
                {
                    id: get(childrenSchema, "id"),
                    props: {
                        children: {
                            id: get(noChildrenSchema, "id"),
                            props: noChildren,
                        }
                    }
                }
            ]
        };
    }

    getChildOptions() {
        return [
            {
                component: null,
                schema: noChildrenSchema,
            },
            {
                component: null,
                schema: childrenSchema,
            },
        ];
    }

    handleLocationUpdate = (newDataLocation) => {
        this.setState({
            dataLocation: newDataLocation
        });
    }
}
```

## Viewer

The `Viewer` component creates an iframe, it can pass props to a communication system and listen for any messages posted to the iframe window. It can have a fixed or adjustable width and height and can be used independently or as a set with the `ViewerContent`, `SelectDevice` and `Rotate` components.

Example:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import Viewer from "@microsoft/fast-tooling-react";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render() {
    ReactDOM.render(
        <Viewer iframeSrc={"/example-content"} />,
        root
    );
}

render();
```

### Setting width and height

The `width` and `height` can be set on the `Viewer` component which will be used as pixel values:

Example:

```jsx
<Viewer
    iframeSrc={"/example-content"}
    width={500}
    height={300}
/>
```

To create a responsive width an height, the `width` and `height` can be tied to values in state and combined with the `onUpdateHeight`, `onUpdateWidth` and `responsive` props. This creates draggable borders around the iframe.

Exampe:

```jsx
<Viewer
    iframeSrc={"/example-content"}
    width={this.state.viewerWidth}
    height={this.state.viewerHeight}
    responsive={true}
    onUpdateHeight={this.handleUpdateViewerHeight}
    onUpdateWidth={this.handleUpdateViewerWidth}
/>

// handlers for the `onUpdateHeight` and `onUpdateWidth` callbacks
handleUpdateViewerHeight = (newViewerHeight) => {
    this.setState({
        viewerHeight: newViewerHeight
    });
}

handleUpdateViewerWidth = (newViewerWidth) => {
    this.setState({
        viewerWidth: newViewerWidth
    });
}

```

### Custom messaging

A custom post message may be sent through the viewer to the iframe via the `viewerMessage` prop. Anytime this prop is update a message will be sent.

### Viewer content

Using the `Viewer` when the provided `iframeSrc` is pointing to a route that contains the `ViewerContent` component.

Example:

```jsx
<Viewer
    iframeSrc={"/example-content"}
    viewerContentProps={[{id: "example", props: {}}]}
/>
```

Using the `ViewerContent` on the route provided to the `Viewer` will allow for the dynamic creation of provided components.

Example component provided in the "/example-content" route for the `Viewer` impplementation example:

```jsx
import as React from "react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import MyComponent from "./my-component";

class ExampleContent extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return <ViewerContent components={[{id: "example", component: MyComponent }]} />;
    }
}

export default UpdatePropsViewerContent;
```

### Select device

Use the `SelectDevice` component to select from provided default devices or provide your own custom device configurations. This component accepts a list of configured devices via the `devices` prop, some default devices are included with the package as a secondary export. It also accepts an `activeDeviceId` prop which maps to the current device id of the provided devices. In addition there is a callback `onUpdateDevice` which will fire a provided function with the new device id selected.

Example:

```jsx
import {
    defaultDevices,
    SelectDevice,
} from "@microsoft/fast-tooling-react";

<SelectDevice
    devices={defaultDevices}
    onUpdateDevice={this.handleDeviceUpdate}
    activeDeviceId={this.state.activeDevice.id}
/>
```

#### Devices

A device can be either "responsive" or "fixed", if it is responsive it does not take a width and height. The current active device can be used to activate the `responsive` prop on the `Viewer` component.

Example of custom devices passed to the `devices` prop:

```json
[
    {
        "id": "responsive",
        "displayName": "Responsive display",
        "display": "responsive"
    },
    {
        "id": "phoneDevice",
        "displayName": "Phone device",
        "display": "fixed",
        "height": 800,
        "width": 320
    }
]
```

### Rotate

Use the `Rotate` component to switch between landscape and portrait view. This component accepts an `orientation` prop which can be either "landscape" or "portrait". It also accepts an `onUpdateOrientation` callback which will fire a provided function with the new orientation selected.

Example:

```jsx
import {
    Rotate,
} from "@microsoft/fast-tooling-react";

<Rotate
    orientation={this.state.orientation}
    onUpdateOrientation={this.handleOrientationUpdate}
/>
```

## CSS Editor

```jsx
import React from "react";
import CSSEditor from "@microsoft/fast-tooling-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            CSSValues: {
                position: "absolute",
                left: "0"
            }
        }
    }

    render() {
        return (
            <CSSEditor
                {...this.state.CSSValues}
                onPositionUpdate={this.handleCssValueUpdate}
            />
        );
    }

    handleCssValueUpdate = (updatedCSSValues) => {
        this.setState({
            CSSValues: updatedCSSValues
        });
    }
}
```

### Spacing

The `CSSSpacing` component shows the CSS spacing (margin and padding) value as four input elements, it will also provide a callback for updating this values. When the `spacingType` is set to "margin" the inputs will adjust the top/bottom/left/right margins and when `spacingType` is set to "padding" it will adjust the top/bottom/left/right padding. The components `spacingType` will default to "margin" if not set.

Example:

```jsx
import React from "react";
import { CSSSpacing } from "@microsoft/fast-tooling-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spacingValues: {
                marginTop: "20px",
                marginLeft: "0"
            }
        }
    }

    render() {
        return (
            <CSSSpacing
                {...this.state.spacingValues}
                onSpacingUpdate={this.handleSpacingValueUpdate}
            />
        );
    }

    handleSpacingValueUpdate = (updatedSpacingValues) => {
        this.setState({
            positionValues: updatedSpacingValues
        });
    }
}
```

### Position

The `CSSPosition` component shows the CSS position value as a select, it will also provide a callback for updating this value. When set to "absolute" it will include a UI for allowing the user to select left/right/top/bottom and enter numbers for pixel positioning. The components position will default to static if not set.

Example:

```jsx
import React from "react";
import { CSSPosition } from "@microsoft/fast-tooling-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positionValues: {
                position: "absolute",
                left: "0"
            }
        }
    }

    render() {
        return (
            <CSSPosition
                {...this.state.positionValues}
                onPositionUpdate={this.handlePositionValueUpdate}
            />
        );
    }

    handlePositionValueUpdate = (updatedPositionValues) => {
        this.setState({
            positionValues: updatedPositionValues
        });
    }
}
```

## Form

The required properties are the `data`, `schema`, and `onChange` function. The data should be tied to your state as the data will change when editing the form. The `onChange` is used as a callback, it should take one argument that is the data that should be updated when any data has been changed from within the generated form.

Example:
```jsx
import Form from "@microsoft/fast-tooling-react";

/**
 * Add to your render function
 */
<Form
    data={this.state.data}
    schema={schema}
    onChange={this.handleChange}
/>

/**
 * onChange handler
 */
handleChange = (data) => {
    this.setState({
        data
    });
}
```

### Using form plugins

Plugins may be created to determine if a form should change based on data. You can identify a piece of schema that should be updated by adding a unique key to your JSON schema `formPluginId`. When you initialize a custom plugin you will need to pass that same id to the plugin as part of its configuration.

Example schema:
```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "type": "object",
    "properties": {
        "text": {
            "title": "Text",
            "type": "string",
            "example": "Hello world",
            "formPluginId": "my-custom-plugin-identifier"
        },
        "weight": {
            "title": "Weight",
            "type": "string",
            "enum": [
                "heavy",
                "medium",
                "light"
            ]
        }
    },
    "required": [
        "text"
    ]
}
```

Example plugin which returns an unmodified schema, unless the weight property has been specified, then the options become specific to the data:

```js
import { FormPlugin, FormPluginProps } from "@microsoft/fast-tooling-react";

export class MyCustomSchemaPlugin extends FormPlugin {
    resolver(schema, data) {
        switch (data.weight) {
            case "heavy":
                return Object.assign({}, schema, { enum: ["heavy text 1", "heavy text 2"] });
            case "medium":
                return Object.assign({}, schema, { enum: ["medium text 1", "medium text 2"] });
            case "light":
                return Object.assign({}, schema, { enum: ["light text 1", "light text 2"] });
        }

        return schema;
    }
}
```

Example implementation with the `Form`:

*Note: When the plugins are used the schema tied to the `Form` should be set to a state so that it can be kept up-to-date, you will need to use the `onSchemaChange` callback which will return the newly updated schema.*

```jsx
import Form from "@microsoft/fast-tooling-react";
import { Button, ButtonSchema } from "@microsoft/fast-components-react-msft";
import { MyCustomSchemaPlugin } from "./my-custom-schema-plugin";

<Form
    data={this.state.currentComponentData}
    schema={this.state.currentComponentSchema}
    onChange={handleChange}
    onSchemaChange={handleSchemaChange}
    plugins={[
        new MyCustomSchemaPlugin({
            id: ["my-custom-plugin-identifier"]
        })
    ]}
/>
```

### React children as options

Children by default only include text elements. If you want to add some child components you are providing, you can do this through the `childOptions`.

```jsx
import Form from "@microsoft/fast-tooling-react";
import { Button, ButtonSchema } from "@microsoft/fast-components-react-msft";

<Form
    data={this.state.currentComponentData}
    schema={currentComponentSchema}
    onChange={handleChange}
    childOptions={[
        {
            name: "Button",
            component: Button,
            schema: ButtonSchema
        }
    ]}
/>
```

### Controlling the visible section

The location prop allows the user to control which piece of JSON schema the form is pointing to and has two required properties. It takes `dataLocation` which is the location of the data to be edited, and `onChange` which will fire an update when the user performs an action on the form that would change the visible data to be edited. An example of this would be clicking on an array item to edit that item.

```jsx
import Form from "@microsoft/fast-tooling-react";

<Form
    data={this.state.currentComponentData}
    schema={currentComponentSchema}
    onChange={handleChange}
    location={{
        dataLocation: this.state.dataLocation,
        onChange: this.handleChange
    }}
/>

// example method to use for the location onChange
handleChange = (dataLocation) => {
    this.setState({
        dataLocation: dataLocation
    });
}
```

### JSON schema metadata

The schema form generator can interpret most [JSON schemas](http://json-schema.org/), however there are some things to note when writing JSON schemas that make for a better UI.

#### Title

Using a title will add a label to the corresponding form element. All properties are required to have a title.

Example:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "type": "object",
    "properties": {
        "text": {
            "title": "Text",
            "type": "string",
            "example": "Hello world"
        },
        "weight": {
            "title": "Weight",
            "type": "string",
            "enum": [
                "heavy"
            ]
        }
    },
    "required": [
        "text"
    ]
}
```

#### Disabled

The disabled flag is optional and the form item representing this section of the schema will be disabled if flag is set to true.

Example:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "type": "object",
    "properties": {
        "text": {
            "title": "Text",
            "type": "string",
            "example": "Hello world",
            "disabled": true
        }
    },
    "required": [
        "text"
    ]
}
```

#### Examples & default

Providing an examples or default value will replace the placeholder 'example text' or randomly generated number. It is generally better to add this extra information in case the schema form generator needs to create a new set of data.

Example:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "type": "object",
    "properties": {
        "text": {
            "title": "Text",
            "type": "string",
            "examples": [
                "Hello world"
            ]
        },
        "style": {
            "title": "Style",
            "type": "object",
            "properties": {
                "color": {
                    "title": "HEX Color",
                    "type": "string",
                    "examples": [
                        "#FF0000"
                    ]
                }
            },
            "required": [
                "color"
            ]
        }
    },
    "required": [
        "text"
    ]
}
```

Because the style is optional, you can toggle to add it. The schema form generator will see that color is a required piece of data and use the example given to fill in.

### JSON schema keywords

Certain JSON schema keywords are interpreted to provide a better UI.

#### oneOf & anyOf

The oneOf and anyOf keywords can be used inside a property and at the root level of a schema. This will create a select dropdown so that the user can switch between them. If data has been provided, it will select the first oneOf/anyOf instance it can validate against. The contents of a 'title' property will be used for the contents of the dropdown.

Example:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "oneOf": [
        {
            "title": "color",
            "type": "object",
            "properties": {
                "color": {
                    "title": "HEX Color",
                    "type": "string",
                    "example": "#FF0000"
                }
            }
        },
        {
            "title": "text",
            "type": "object",
            "properties": {
                "text": {
                    "title": "Text",
                    "type": "string",
                    "example": "Hello world"
                }
            }
        }
    ]
}
```

#### Enums

Any enums will be converted to a select dropdown.

```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "type": "object",
    "properties": {
        "color": {
            "title": "Color",
            "type": "string",
            "enum" : [
                "red",
                "green",
                "blue",
                "yellow"
            ],
            "default": "red"
        }
    }
}
```

#### React children

React children are treated as special objects instead of simple properties and can be defined in an object as `reactProperties`. They can specify `ids` from the given `childOptions` and can be given defaults, currently there is one default `text`. If no `ids` are specified all `childOptions` are considered valid.

Example of an object that includes children with specific ids and the text default:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "type": "object",
    "properties": {
        "color": {
            "title": "Color",
            "type": "string"
        }
    },
    "reactProperties": {
        "children": {
            "title": "Components",
            "type": "children",
            "ids": [
                "my-component",
                "my-button-component"
            ],
            "defaults": [
                "text"
            ]
        }
    }
}
```

#### allOf & $ref

The allOf and $ref keywords cannot be interpreted by the schema form generator. To allow for most of the functionality there is a tool inside the @microsoft/fast-permutator which will simplify the schema and merge allOf arrays when it finds them, see `simplifySchemas`.
