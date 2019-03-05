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
import * as React from "react";
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
