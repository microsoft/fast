
# ReactJS FAST form generator
A self generating UI based on JSON Schemas.

Dynamically generates a form user interface based on incoming JSON Schemas to change data values of a React component.

## Installing
`npm i --save @microsoft/fast-form-generator-react`

## Using the form generator
### Basic usage
The required properties are the data, schema, and onChange function. The data should be tied to your state as the data will change when editing the form.

```jsx
import Form from "@microsoft/fast-form-generator-react";

/**
 * Add to your render function
 */
<Form
    data={this.state.currentComponentData}
    schema={currentComponentSchema}
    onChange={handleChange}
/>
```

### onChange
The onChange is used as a callback, it should take one argument that is the data that should be updated when any data has been changed from within the generated form.

## Data and data mapping
Component data passed to the form generator as plain data, there is a `mapDataToComponent` export from the package which converts any children data to executable React components. It is required that any component that would be mapped from data should be supplied in the `childOptions` prop.

Example onChange:
```jsx
import { mapDataToComponent } from "@microsoft/fast-form-generator-react";

/**
 * The app on change event
 */
onChange = (data) => {
    this.setState({
        currentComponentData: mapDataToComponent(data)
    });
}
```

### Simple data
Where the component is a button and the data being passed to the `onChange` is:

```json
{
    "disabled": true,
    "children": "Button text"
}
```

### Data with component children
Where the component contains a button and the data being passed to the `onChange` is:

Example data:
```json
{
    "children": {
        "id": "button",
        "props": {
            "disabled": true
        }
    }
}
```

The `id` corresponds to the components' JSON schema id and the `props` corresponds to the data being passed to the component.

### Advanced usage
Outside of the basic use case you can provide some additional functionality through optional properties.

**childOptions** - Children by default only include text elements. If you want to add some child components you are providing, you can do this through the `childOptions`.

```jsx
import Form from "@microsoft/fast-form-generator-react";
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

**componentMappingToPropertyNames** - There are special components that can be mapped to property names so that they are used. An example would be `alignHorizontal` which when mapped will show alignment controls instead of a select dropdown. You can map them to one or more different property names so if your component has a property `alignHorizontalSpacingForTitle` and `alignHorizontalSpacingForImage`:

```jsx
import Form from "@microsoft/fast-form-generator-react";

<Form
    data={this.state.currentComponentData}
    schema={currentComponentSchema}
    onChange={handleChange}
    componentMappingToPropertyNames={{
        alignHorizontal: [
            "alignHorizontalSpacingForTitle",
            "alignHorizontalSpacingForImage"
        ]
    }}
/>
```

Each special component is listed in the form component [README.md](./src/form/README.md)

**attributeSettingsMappingToPropertyNames** - The attributes of a form item can be mapped to by this prop. An example of updating the textarea row to be 1 when the property name is `text`:

```jsx
import Form from "@microsoft/fast-form-generator-react";

<Form
    data={this.state.currentComponentData}
    schema={currentComponentSchema}
    onChange={handleChange}
    attributeSettingsMappingToPropertyNames={{
        textarea: {
            rows: [
                {
                    propertyNames: ["text"],
                    value: 1
                }
            ]
        }
    }
/>
```

**orderByPropertyNames** - Properties can be assigned a category with titles to give the form more structure. They can also be weighted, an example of displaying properties related to content on top of properties which relate to formatting:

*This also tells the form generator to only display categories once there are 4 or more and gives a default category weight*

```jsx

import Form from "@microsoft/fast-form-generator-react";

<Form
    data={this.state.currentComponentData}
    schema={currentComponentSchema}
    onChange={handleChange}
    orderByPropertyNames={{
        showCategoriesAtPropertyCount: 4,
        defaultCategoryWeight: 20,
        categories: [
            {
                title: "Content",
                weight: 50,
                properties: [
                    { weight: 5, propertyName: ["title, text"] },
                    { weight: 0, propertyName: "details" }
                ]
            },
            {
                title: "Formatting",
                weight: 40,
                properties: [
                    { weight: 9, propertyName: "alignVertical" },
                    { weight: 7, propertyName: "alignHorizontal" }
                ]
            }
        ]
    }}
/>
```

## Writing JSON Schemas
The schema form generator can interpret most [JSON schemas](http://json-schema.org/), however there are some things to note when writing JSON schemas that make for a better UI.

### title
Using a title will add a label to the left or top of the corresponding form element. All properties are required to have a title.

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

### examples & default
Providing an example or default value will replace the placeholder 'example text' or randomly generated number. It is generally better to add this extra information in case the schema form generator needs to create a new set of data.

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
        "style": {
            "title": "Style",
            "type": "object",
            "properties": {
                "color": {
                    "title": "HEX Color",
                    "type": "string",
                    "example": "#FF0000"
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

### oneOf & anyOf
The oneOf and anyOf keywords can be used inside a property and at the root level of a schema. This will create a select dropdown so that the user can switch between them. If data has been provided, it will select the first oneOf/anyOf instance it can validate against. The contents of a 'description' property will be used for the contents of the dropdown.

Example: 
```json
{
    "$schema": "http://json-schema.org/schema#",
    "id": "my-component",
    "title": "My component",
    "oneOf": [
        {
            "description": "color",
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
            "description": "text",
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

### enums
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

### React children
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

### type object
The object type will create its own section which can be navigated to via a link that is created on its parent object. Once it has been navigated to, breadcrumbs will appear above allowing the user to navigate back to the parent object.

### Keywords that cannot be interpreted

#### allOf & $ref
The allOf and $ref keywords cannot be interpreted by the schema form generator. To allow for most of the functionality there is a tool inside the @microsoft/fast-permutator which will simplify the schema and merge allOf arrays when it finds them, see `simplifySchemas`.