# FAST Tooling React

The tooling available in FAST Tooling React can be used together to create UI for manipulating serializable data and viewing React components.

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) &nbsp; ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge)

- [Benefits](#benefits)
- [Installation](#installation)
- [Concepts](#concepts)
    - [JSON Schema](#json-schema)
    - [Data structures for React Children](#data-structures-for-react-children)
- [Data utilities](#data-utilities)
    - [Mapping data to a React component](#mapping-data-to-a-react-component)
        - [Child options](#child-options)
        - [Using plugins](#using-plugins)
    - [Mapping data to a code preview](#mapping-data-to-a-code-preview)
    - [Generating data from a JSON schema](#generating-data-from-a-json-schema)
- [Navigation](#navigation)
- [Navigation Menu](#navigation-menu)
    - [Menu structure](#menu-structure)
    - [Expanding and Collapsing](#expanding-and-collapsing)
    - [Controlling the location](#controlling-the-location)
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
    - [Width](#width)
    - [Height](#height)
- [Form](#form)
    - [Drag and drop](#drag-and-drop)
    - [Using form control plugins](#using-form-control-plugins)
        - [List of control types](#list-of-control-types)
    - [React children as options](#react-children-as-options)
    - [Controlling the visible section](#controlling-the-visible-section)
    - [Validation](#validation)
    - [JSON schema metadata](#json-schema-metadata)
        - [Title](#title)
        - [Description](#description)
        - [Disabled](#disabled)
        - [Examples & default](#examples-&-default)
        - [Badges](#badges)
        - [Dictionaries](#dictionaries)
        - [Categories](#categories)
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

### Mapping data to a code preview

The `mapDataToCodePreview` function can be used to map data to a code preview, a string which represents the data in JSX format.

An example of mapping data to a code preview from the `@microsoft/fast-tooling-react` package:

```js
import * as headingSchema from "@microsoft/fast-components-react-msft/dist/heading/heading.schema.json";
import { mapDataToCodePreview } from "@microsoft/fast-tooling-react";

const childOptions = [
    {
        name: "Heading", // This name is used as a JSX element tag
        schema: headingSchema,
    },
];

const codePreview = mapDataToCodePreview({
    data: {
        id: headingSchema.id,
    },
    childOptions
});
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

### Drag and drop

Using the `dragAndDropReordering` option allows React children to be re-arranged from the navigation, this requires the `onChange` callback.

Example:

```jsx
render() {
    return (
        <Navigation
            {...props}
            data={this.state.data}
            onChange={this.handleChange}
            dragAndDropReordering={true}
        />
    );
}

handleChange = (data) => {
    this.setState({
        data
    });
}
```

## Navigation Menu

The `NavigationMenu` component creates a navigational menu from a provided data structure. This component is meant to serve as location routing in an application.

### Menu structure
Example menu structure:
```js
const menu = [
    {
        displayName: "red",
        location: "/red"
    },
    {
        displayName: "green",
        items: [
            {
                displayName: "blue",
                location: "/blue"
            }
        ]
    }
]
```

Each menu item requires a `displayName` to use in the generated UI.

Simple example:

```jsx
render() {
    return (
        <NavigationMenu
            menu={menu}
        />
    );
}
```

### Expanding and collapsing

An optional `expanded` prop may be provided which can either expand or collapse all expandable items. If there is a need to trigger this initially or after an action such as a button click.

Example:
```jsx
private handleExpandClick = (): void => {
    this.setState(
        {
            expanded: true,
        },
        () => {
            this.setState({
                expanded: void 0,
            });
        }
    );
};
```

### Controlling the location

A `location` may optionally be provided in the menu data, if this is not accompanied by a `onLocationUpdate` callback, the generated UI for that menu item will be an anchor. If an `onLocationUpdate` callback is provided this results in a span, which when clicked will fire the callback with the associated location.

Example:

```jsx
render() {
    return (
        <NavigationMenu
            menu={menu}
            activeLocation={this.state.activeLocation}
            onLocationUpdate={this.handleLocationUpdate}
        />
    );
}

handleLocationUpdate = (location) => {
    this.setState({
        activeLocation: location
    });

    // do some route manipulation
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

A custom post message may be sent through the viewer to the iframe via the `iframePostMessage` prop. Anytime this prop is update a message will be sent.

A custom post message may be recieved through the viewer from the iframe and returned via the `onMessage` callback prop. This must be defined as a custom message.

Example message sent from the iframe src:

```js
import { ViewerMessageType, ViewerMessageTarget } from "@microsoft/fast-tooling-react";

...

window.postMessage(
    JSON.stringify({
        type: ViewerMessageType.custom,
        target: ViewerMessageTarget.viewer,
        data: "foo", // your custom data
    }),
    "*"
);
```

### Viewer content

A `ViewerContent` component is available to provide some basic functionality in conjunction with the `Viewer`.

Using the `Viewer` prop `iframeSrc` and pointing it to a route that contains the `ViewerContent` component will allow the automatic generation of components.

Example:

```jsx
<Viewer
    iframeSrc={"/example-content"}
    viewerContentProps={[{id: "example", props: {}}]}
/>
```

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

**components** - Provide an array of components with an `id` that corresponds to a JSON schema id and these components will be rendered via the postMessage system used with the `Viewer`.

**plugins** The `ViewerContent` also accepts plugin(s) and passes them to the `mapDataToComponent` utility, see the `mapDataToComponent` utility section for information on how they can be used.

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
                data={this.state.CSSValues}
                onChange={this.handleCssValueUpdate}
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

The `CSSSpacing` component shows the CSS spacing (margin and padding) value as four input elements, when the spacing is set to "margin" the inputs will adjust the top/bottom/left/right margins and when the spacing is set to "padding" it will adjust the top/bottom/left/right padding.

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
                data={this.state.spacingValues}
                onChange={this.handleSpacingValueUpdate}
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
            cssValues: {
                position: "absolute",
                left: "0"
            }
        }
    }

    render() {
        return (
            <CSSPosition
                data={this.state.cssValues}
                onChange={this.handleCSSValueUpdate}
            />
        );
    }

    handleCSSValueUpdate = (updatedPositionValues) => {
        this.setState({
            cssValues: updatedPositionValues
        });
    }
}
```

### Width

The `CSSWidth` component shows an input with a label and has a callback that will be fired when the value is updated.

Example:
```jsx
import React from "react";
import { CSSWidth } from "@microsoft/fast-tooling-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cssValues: {
                width: "100px"
            }
        }
    }

    render() {
        return (
            <CSSWidth
                data={this.state.cssValues}
                onChange={this.handleCSSValueUpdate}
            />
        );
    }

    handleCSSValueUpdate = (updatedValues) => {
        this.setState({
            cssValues: updatedValues
        });
    }
}
```

### Height

The `CSSHeight` component shows an input with a label and has a callback that will be fired when the value is updated.

Example:
```jsx
import React from "react";
import { CSSHeight } from "@microsoft/fast-tooling-react";

export class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cssValues: {
                height: "100px"
            }
        }
    }

    render() {
        return (
            <CSSHeight
                data={this.state.cssValues}
                onChange={this.handleCSSValueUpdate}
            />
        );
    }

    handleCSSValueUpdate = (updatedValues) => {
        this.setState({
            cssValues: updatedValues
        });
    }
}
```

## Form

The required properties are the `data`, `schema`, and `onChange` function. The data should be tied to your state as the data will change when editing the form. The `onChange` is used as a callback, it should take one argument that is the data that should be updated when any data has been changed from within the generated form.

Example:
```jsx
import { Form } from "@microsoft/fast-tooling-react";

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

### Drag and drop

Drag and drop is provided to the `Form` using the `react-dnd` package as well as the `HTML5Backend`. If you are using `react-dnd` somewhere else and need to implement the backend once, use the secondary export `BareForm`.

### Using form control plugins

All necessary form controls are built in by default but can be overriden either through the schema by adding a `formControlId` property with a string value or a control type defined [below](#list-of-control-types).

To make a custom control, use the secondary export `StandardControlPlugin` which will take care of all standard form actions such as setting default, resetting data, etc. You will need to provide the necessary functionality to the `control` as JSX.

When the plugin instance is passed to the `<Form />` 
either the id or the type is then referenced and will cause the control to render.

A config is passed to the control, the specifications of this can be found [here](https://github.com/microsoft/fast-dna/blob/master/packages/fast-tooling-react/src/form/templates/template.control.utilities.props.tsx). Note that the `ControlConfig` interface may include extra properties depending on the control type being used.

Example id plugin:

JSON Schema:
```json
{
    "type": "object",
    "properties": {
        "foo": {
            "type": "string",
            "formControlId": "foo"
        }
    }
}
```

JSX:
```jsx
<Form
    schema={schema}
    data={this.state.data}
    onChange={this.handleChange}
    controlPlugins={[
        new StandardControlPlugin({
            id: "foo",
            control: (config) => {
                return (
                    <input
                        value={config.value}
                    />
                )
            }
        })
    ]}
/>
```

Example type plugin:

```jsx
<Form
    schema={schema}
    data={this.state.data}
    onChange={this.handleChange}
    controlPlugins={[
        new StandardControlPlugin({
            type: ControlType.textarea,
            control: (config) => {
                return (
                    <input
                        value={config.value}
                    />
                )
            }
        })
    ]}
/>

```

#### List of control types

Control types are available as an enum provided as a secondary export `ControlType` and consist of the following:

```js
import { ControlType } from "@microsoft/fast-tooling-react";

// Available types
ControlType.select
ControlType.array
ControlType.children
ControlType.checkbox
ControlType.numberField
ControlType.sectionLink
ControlType.display
ControlType.button
ControlType.textarea
```

These control types can be paired with our default controls, the following of which are available:

- `SelectControl`
- `ArrayControl`
- `ChildrenControl`
- `CheckboxControl`
- `NumberFieldControl`
- `SectionLinkControl`
- `DisplayControl`
- `ButtonControl`
- `TextareaControl`

**Note: If the id and type are not specified, all controls will be replaced with the control.**

Example of a replacement type:

```jsx
import { ControlType, TextareaControl } from "@microsoft/fast-tooling-react";

...

<Form
    schema={schema}
    data={this.state.data}
    onChange={this.handleChange}
    controlPlugins={[
        new StandardControlPlugin({
            type: ControlType.textarea,
            control: (config) => {
                return (
                    <React.Fragment>
                        <span>Hello world!</span>
                        <TextareaControl {...config} />
                    </React.Fragement>
                );
            }
        })
    ]}
/>
```

Example of a replacement for all controls, using the component for the default control:

```jsx
<Form
    schema={schema}
    data={this.state.data}
    onChange={this.handleChange}
    controlPlugins={[
        new StandardControlPlugin({
            control: (config) => {
                return (
                    <React.Fragment>
                        <span>Hello world!</span>
                        <config.component {...config} />
                    </React.Fragement>
                );
            }
        })
    ]}
/>
```

#### Making your own control plugin

The `StandardControlPlugin` creates a standard template for expected functionality not specific to a control such as a `CheckboxControl`. This may include showing a button to set the value to the default value, an unset/reset button if the value represented in the control is optional, etc.

It is possible to create your own control plugin template; this section is for more advanced usage and should be done with caution.

To assist in the creation of a custom control plugin template, another secondary export is provided, `ControlTemplateUtilities`. This is an abstract class that can be extended, it includes all of the render methods for various actions that can be taken that are not control specific. It is possible to use this class to make your own template and include extra logic for when these items should render.

Example:

```jsx
import { ControlTemplateUtilities } from "@microsoft/fast-tooling-react";

export class MyControlTemplate extends ControlTemplateUtilities {
    public render() {
        return (
            <div>
                <label
                    htmlFor={this.props.dataLocation}
                    title={this.props.labelTooltip}
                >
                    {this.props.label}
                </label>
                {this.renderConstValueIndicator("const-value-indicator-css-class")}
                {this.renderDefaultValueIndicator("default-value-indicator-css-class")}
                {this.renderBadge("badge-css-class")}
                {this.renderControl(this.props.control(this.getConfig()))}
                {this.renderSoftRemove("soft-remove-css-class")}
                {this.renderInvalidMessage("invalid-message-css-class")}
            </div>
        );
    }
}

export { StandardControlTemplate };
```

The following methods are available:

- `renderConstValueIndicator` - This will indicate that this value is not the const value and will set the value to the const value if clicked.
- `renderDefaultValueIndicator` - This will indicate that this value is not the default value and will set the value to the default if clicked.
- `renderBadge` - This renders a badge, as indicated by the [badge](#badges) section of this README.
- `renderControl` - This renders the control, such as `CheckboxControl` etc. or whatever control has been specified if the default controls are not being used. This must include an argument to execute the control with the `getConfig` method as an argument.
- `renderSoftRemove` - This allows for the rendering of an unset/reset button if the value of this control is optional.
- `renderInvalidMessage` - This method renders the invalid message for this control as specified when validating the data against the JSON schema.

Note that with the exception of `renderControl` method, the others require a string argument, this will be used as a class so that the generated HTML from the render method can be styled. At this point it is up to the implementer to include their own styling for these items.

It is recommended that the implementation also include the use of a label for accessibility.

### Using form schema plugins

**NOTE: Schema plugins are DEPRECATED and will be removed in the 2.0.0**

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

*Note: When the plugins are used the schema used to render the `Form` is internally updated. To get the plugin-modified schema, you can optionally add the `onSchemaChange` callback which will return the newly updated schema.*

**NOTE: The `onSchemaChange` callback is DEPRECATED and will be removed in the 2.0.0**

```jsx
import Form from "@microsoft/fast-tooling-react";
import { Button, ButtonSchema } from "@microsoft/fast-components-react-msft";
import { MyCustomSchemaPlugin } from "./my-custom-schema-plugin";

<Form
    data={this.state.currentComponentData}
    schema={this.state.currentComponentSchema}
    onChange={handleChange}
    plugins={[
        new MyCustomSchemaPlugin({
            id: ["my-custom-plugin-identifier"]
        })
    ]}
/>
```

### React children as options

**NOTE: Child options are DEPRECATED and will be removed in the 2.0.0**

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

### Validation

Form validation uses the [ajv](https://github.com/epoberezkin/ajv) package. The validation can be displayed inline or using the browser default HTML5 validation UI. This can be achieved through the `displayValidationBrowserDefault` which is `true` by default and `displayValidationInline` which will show validation messages below the associated form element.

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

#### Description

Using a description will add a HTML attribute `title` to the label, resulting in a browser tooltip. This should be used for supplemental information that may not be apparent in the title.

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
            "description": "The text appearing in the body",
            "type": "string",
            "example": "Hello world"
        },
        "weight": {
            "title": "Weight",
            "description": "The weight of the text",
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

#### Badges

To allow more detail about a field two additional fields can be added to JSON schemas, `badge` and `badgeDescription`. The `badge` can have the values "info", "warning" and "locked" which will create the related icons. Adding a `badgeDescription` will add a native tooltip when the badge is hovered.

Example:

```json
{
    "type": "string",
    "badge": "warning",
    "badgeDescription": "Setting this field will cause adverse effects"
}
```

#### Dictionaries

The `additionalProperties` JSON schema keyword can be used to create a dictionary of user-input keys on an object. To give these keys a label add the keyword `propertyTitle`, this will create a label for the form element for editing the property key.

Example:

```json
{
    "type": "object",
    "additionalProperties": {
        "title": "A dictionary of strings",
        "propertyTitle": "A dictionary key",
        "type": "string"
    }
}
```

#### Categories

To allow properties in an object to be categorized, the JSON schema can be amended with a `formConfig` property at the same level of the object. These categories can be expandable and will appear in the order they appear in the array.

Example:

```json
{
    "type": "object",
    "properties": {
        "foo": {
            "title": "String Property Foo",
            "type": "string"
        },
        "bar": {
            "title": "String Property Bar",
            "type": "string"
        }
    },
    "formConfig": {
        "categories": [
            {
                "title": "Category A",
                "expandable": true,
                "items": [
                    "foo"
                ]
            },
            {
                "title": "Category A",
                "items": [
                    "bar"
                ]
            }
        ]
    }
}
```

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

**NOTE: reactProperties and type "children" are DEPRECATED and will be removed in the 2.0.0**

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
