
# FAST form generator (Beta)
A self generating UI based on JSON Schemas as seen on [Fluent Web](https://fluentweb.com).

Fluent Web utilizes the form generator to dynamically generate the component configurator as seen on all of our components listed on [Building blocks](https://fluentweb.com/building-blocks).

## Installing
- Run `npm i`

## Getting started
- Run `npm run dev-server`

## Writing JSON Schemas
The schema form generator can interpret most [JSON schemas](http://json-schema.org/), however there are some things to note when writing JSON schemas that make for a better UI.

Additional documentation can be found on [Fluent Web](https://fluentweb.com/prototyping/getting-started/schemas).

### title
Using a title will add a label to the left or top of the corresponding form element. All properties are required to have a title.

Example:
```
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
If an example or a default value is given, that is what will be used instead of 'example text' in case of a string, or a randomly generated number instead of a number. It is generally better to add this extra information in case the schema form generator needs to create a new set of data.

Example:
```
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
```
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

```
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

### type object
The object type will create its own section which can be navigated to via a link that is created on its parent object. Once it has been navigated to, breadcrumbs will appear above allowing the user to navigate back to the parent object.

### Keywords that cannot be interpreted

#### allOf & $ref
The allOf and $ref keywords cannot be interpreted by the schema form generator. To allow for most of the functionality there is a tool inside the [data permutator](https://fluentweb.visualstudio.com/Fluent%20Web/_packaging?feed=ms.fw&upstreamSource=local&package=%40ms-fw%2Ffw-utilities-data-permutator&version=0.1.10&protocolType=Npm&_a=package) which will simplify the schema and merge allOf arrays when it finds them, see `simplifySchemas`.

## Ownership
Contact Fluent Web Questions <fwq@microsoft.com> for details on this repository.