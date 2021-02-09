# FAST Tooling React

The tooling available in FAST Tooling React can be used together to create UI for manipulating serializable data and viewing React components.

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) &nbsp; ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge)

- [Benefits](#benefits)
- [Concepts](#concepts)
    - [Ecosystem](#ecosystem)
- [Installation](#installation)
- [Requirements](#requirements)
- [Form](#form)
    - [Validation](#validation)
    - [Drag and drop](#drag-and-drop)
    - [Using form control plugins](#using-form-control-plugins)
        - [List of control types](#list-of-control-types)
    - [Validation](#validation)
    - [JSON schema metadata](#json-schema-metadata)
        - [Title](#title)
        - [Description](#description)
        - [Disabled](#disabled)
        - [Examples & default](#examples-&-default)
        - [Badges](#badges)
        - [Dictionaries](#dictionaries)
    - [JSON schema keywords](#json-schema-keywords)
        - [oneOf & anyOf](#oneof-&-anyof)
        - [Enums](#enums)
        - [allOf & $ref](#allof-&-ref)
    - [Categories](#categories)
- [Navigation](#navigation)
- [Navigation Menu](#navigation-menu)
    - [Menu structure](#menu-structure)
    - [Expanding and Collapsing](#expanding-and-collapsing)
    - [Controlling the location](#controlling-the-location)
- [Viewer](#viewer)
    - [Setting width and height](#setting-width-and-height)
    - [Sending custom messages](#sending-custom-messages)
    - [Receiving custom messages](#receiving-custom-messages)
    - [Select device](#select-device)
        - [Devices](#devices)
    - [Rotate](#rotate)
- [Data utilities](#data-utilities)
    - [Transforming data](#transforming-data)

## Benefits

The FAST Tooling can be used in any combination for the following scenarios:
- Mapping serializable data to a React component in an application
- Editing data using a form generated from a JSON schema
- Viewing a React component in an isolated iframe environment
- Using a navigation generated from a components data
- All of the above to create a live editing UI

## Concepts

### Ecosystem

The following components are intended to work together as an ecosystem of components:

- `ModularForm` - see [Form](#form)
- `ModularViewer` - see [Viewer](#viewer)
- `ModularNavigation` - see [Navigation](#navigation)

Each of these components is provided as a standalone version and a version intended to work with another of the above components. If the `Form` is intended to be used with the `Viewer` then the `Modular` prefixed versions should be used. This enables them to share certain capabilities such as drag and drop.

Example:

```jsx
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { ModularForm, ModularViewer } from "@microsoft/fast-tooling-react";

// See details on implementation from the standalone
// versions of Form and Viewer
<DndProvider backend={HTML5Backend}>
    <ModularForm {...props} />
    <ModularViewer {...props} />
</DndProvider>
```

## Installation

`npm i --save @microsoft/fast-tooling-react`

## Requirements

The `@microsoft/fast-tooling-react` package will be installed with `@microsoft/fast-tooling`. The `@microsoft/fast-tooling` package includes exports required for implementing the React specific components, namely the `MessageSystem` and the minified webworker which handles data manipulation. Please refer to the documentation for `@microsoft/fast-tooling` for a better understanding of these systems.

## Form

The required property is the `messageSystem`, see `@microsoft/fast-tooling` for details on setting this up.

Example:
```jsx
import { Form } from "@microsoft/fast-tooling-react";

/**
 * Add to your render function
 */
<Form
    messageSystem={fastMessageSystem}
/>
```

### Validation

Validation is treated as optional, there is a validation utility provided by the `@microsoft/fast-tooling` package that will give basic JSON schema validation errors. Refer to the `@microsoft/fast-tooling` README for details.

### Drag and drop

Drag and drop is provided to the `Form` using the `react-dnd` package as well as the `HTML5Backend`. If you are using `react-dnd` somewhere else and need to implement the backend once, use the secondary export `ModularForm`.

### Using form control plugins

All necessary form controls are built in by default but can be overriden either through the schema by adding a `formControlId` property with a string value or a control type defined [below](#list-of-control-types).

To make a custom control, use the secondary export `StandardControlPlugin` which will take care of all standard form actions such as setting default, resetting data, etc. You will need to provide the necessary functionality to the `control` as JSX.

When the plugin instance is passed to the `<Form />` 
either the id or the type is then referenced and will cause the control to render.

A config is passed to the control, the specifications of this can be found [here](https://github.com/microsoft/fast/blob/master/packages/fast-tooling-react/src/form/templates/template.control.utilities.props.tsx). Note that the `ControlConfig` interface may include extra properties depending on the control type being used.

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
    messageSystem={fastMessageSystem}
    controls={[
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
    messageSystem={fastMessageSystem}
    controls={[
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
ControlType.checkbox
ControlType.linkedData
ControlType.numberField
ControlType.sectionLink
ControlType.section
ControlType.display
ControlType.button
ControlType.textarea
```

These control types can be paired with our default controls, the following of which are available:

- `SelectControl`
- `ArrayControl`
- `CheckboxControl`
- `LinkedDataControl`
- `NumberFieldControl`
- `SectionLinkControl`
- `SectionControl`
- `DisplayControl`
- `ButtonControl`
- `TextareaControl`

**Note: If the id and type are not specified, all controls will be replaced with the control.**

Example of a replacement type:

```jsx
import { ControlType, TextareaControl } from "@microsoft/fast-tooling-react";

...

<Form
    messageSystem={fastMessageSystem}
    controls={[
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
    messageSystem={fastMessageSystem}
    controls={[
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

#### allOf & $ref

The `allOf` and `$ref` keywords cannot be interpreted by the schema form generator.

#### Categories

Any `object` in the `<Form />` may have categories with which to contain its properties. This can be achieved by passing the `categories` prop which is a dictionary of keys that match to a schemas `id`, and which contain a `dataLocation` key to indicate which object a form category belongs to. Each category can then specify the properties as a set of `dataLocation` strings and a `title`.

Example:

```tsx
<Form
    messageSystem={fastMessageSystem}
    categories={{
        "https://my.schema.id": {
            "": [ // The root level dataLocation
                {
                    title: "Style",
                    dataLocations: ["border", "font"]
                },
                {
                    title: "Content",
                    dataLocations: ["text", "title"]
                }
            ]
        }
    }}
/>
```

## Navigation

The required property is the `messageSystem`, see `@microsoft/fast-tooling` for details on setting this up.

Example:

```jsx
<Navigation
    messageSystem={fastMessageSystem}
/>
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

The `Viewer` component creates an iframe, it can have a fixed or adjustable width and height and can be used independently or as a set with the `SelectDevice` and `Rotate` components.

The required property is the `messageSystem`, see `@microsoft/fast-tooling` for details on setting this up and the `iframeSrc`.

Example:

```jsx
<Viewer
    messageSystem={fastMessageSystem}
    iframeSrc={"/example-content"}
/>
```

### Setting width and height

The `width` and `height` can be set on the `Viewer` component which will be used as pixel values:

Example:

```jsx
<Viewer
    messageSystem={fastMessageSystem}
    iframeSrc={"/example-content"}
    width={500}
    height={300}
/>
```

To create a responsive width an height, the `width` and `height` can be tied to values in state and combined with the `onUpdateHeight`, `onUpdateWidth` and `responsive` props. This creates draggable borders around the iframe.

Example:

```jsx
<Viewer
    messageSystem={fastMessageSystem}
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

### Sending custom messages

Sending custom messages through from the iframe can be done with a `postMessage` to the iframe window. The custom message should define the `type` and `action`. The type should be `MessageSystemType.custom` imported from the `@microsoft/fast-tooling` package and the `action` is defined as the enum value `ViewerCustomAction.call` provided as an export.

Example:
```javascript
import { MessageSystemType } from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";

window.postMessage({
    type: MessageSystemType.custom,
    action: ViewerCustomAction.call,
    data: myData
}, "*");
```

### Receiving custom messages

When a custom message is sent through the message system with a type of `ViewerCustomAction.call`, it will be passed to all registered callbacks with the message system using a modified `action` type of `ViewerCustomAction.response`. This way any further action that needs to be taken with the message data passed from the iframe can be done by looking for the response.

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

## Data utilities

### Transforming data

As data from the dictionary of data is intended to be mapped to JSON schema, it may need to be transformed to be useful as, for instance, a React component.

Assuming that each JSON schema represents React props for a given component, a mapper has been provided which can be used in conjunction with the `@microsoft/fast-tooling` export `mapDataDictionary`.

Example:

```js
import { mapDataDictionary } from "@microsoft/fast-tooling";
import { reactMapper } from "@microsoft/fast-tooling-react";

const componentDictionary = {
    "button-schema-id": MyButton
}

const myComponentInstance = mapDataDictionary({
    dataDictionary: {
        foo: {
            schemaId: "button-schema-id",
            data: {
                children: "Hello world",
            },
        },
    },
    dataDictionaryKey: "foo",
    mapper: reactMapper(componentDictionary),
    schemaDictionary: {
        "button-schema-id": {
            id: "button-schema-id",
            type: "object",
            properties: {
                children: {
                    type: "string",
                },
            },
        },
    },
});
```

Expected result from the example above is an instance of `MyButton` with the text "Hello world". This is a simple mapper that assumes that any linked data is a React component that is nested.
