# Message System

## Introduction

The Message System controls the navigation, data, data schemas (JSON schemas), and history of messages it receives. It can also be used to pass custom messages between services that are registered to it.

## Lifecycle

The intended lifecycle of the Message System starts with the initialization.

```javascript
fastMessageSystem = new MessageSystem({
    webWorker: "message-system.min.js",
});

// Registration of other services/components

fastMessageSystem.initialize({
    dataDictionary: myDataDictionary,
    schemaDictionary: mySchemaDictionary,
});
```

After initialization with at least a `dataDictionary`, `schemaDictionary` and the Message System web worker, the primary types of messages that can be sent are `dataDictionary` updates, `navigationDictionary` updates and `history` updates. There are also `custom` messages that can be sent if a user wishes to have two services communicate with one another using the message system, though it is recommended that they use a method to distinguish the source of the message such as an originator ID to prevent causing an infinite loop of messages.

## Navigation Config

The navigation config is a data structure based on the data dictionary which allows for the navigation into properties of the data dictionary. For example:

JSON schema example:

```json
{
    "type": "object",
    "properties": {
        "disabled": {
            "type": "boolean"
        }
    }
}

```

Data dictionary example:

```js
[
    {
        button: {
            schemaId: "button",
            data: {
                disabled: true
            }
        }
    },
    "button"
]
```

Navigation config example:
```js
[
    {
        button: [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        type: "object",
                        properties: {
                            disabled: {
                                type: "boolean"
                            }
                        }
                    },
                    disabled: false,
                    data: {
                        disabled: true
                    },
                    text: "Untitled",
                    type: DataType.object,
                    items: [
                        "disabled"
                    ],
                },
                "disabled": {
                    self: "disabled",
                    parent: "",
                    relativeDataLocation: "disabled",
                    schemaLocation: "properties.disabled",
                    schema: {
                        type: "boolean"
                    },
                    disabled: false,
                    data: true,
                    text: "Untitled",
                    type: DataType.boolean,
                    items: [],
                }
            },
            ""
        ]
    },
    "button"
]
```

To update navigation, use the dictionary ID and the navigation config ID. Using the data provided above as an example, to navigate to the root of the button, send the following message to the message system:

```js
{
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeDictionaryId: "button";
    activeNavigationConfigId: "";
}
```

To navigate to the `disabled` property:

```js
{
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeDictionaryId: "button";
    activeNavigationConfigId: "disabled";
}
```
