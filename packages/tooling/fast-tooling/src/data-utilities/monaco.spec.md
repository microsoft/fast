# Monaco editor utilities

These are spec files for utilities relating to the use of [Monaco Editor](https://github.com/microsoft/monaco-editor).

## `MonacoEditorDataDictionaryAdaptor`

The adaptor will function as a go-between to convert data structures inherent to the Monaco editor, and the `DataDictionary`.

### Initialization

Steps:
1. `MonacoEditorDataDictionaryAdaptor` registers with the provided `MessageSystem`
2. `DataDictionary` update with type `initialize` is received via the `MessageSystem`
3. The `onDidInitialize` callback is called
4. The internals of the `onDidInitialize` callback convert the `DataDictionary` into a string of `HTML` using the `mapDataDictionaryToMonacoEditorHTML`
5. The `HTML` string is then set as the `value` of the model in the Monaco editor
6. The Monaco editor `onDidChangeContent` event is called
7. The `formatDocument` action fires within the `onDidChangeContent` callback
8. The `MonacoEditorDataDictionaryAdaptor` registers a new value update and re-assembles the mapped Monaco array values in its stored `DataDictionaryToken[]`
9. Subsequent updates follow the [Editing the Data Dictionary](#editing-the-data-dictionary) and [Editing using the Monaco Editor](#editing-using-the-monaco-editor) sections

### Tokens

The Monaco Editor fields requests for a tokenized version of the current value. It is based on the Monarch lexical analysis which is defined [here](https://microsoft.github.io/monaco-editor/monarch.html). 

An example of tokens created by Monarch:

```typescript
[
    [
        { // 0
            offset: 0,
            type: "delimiter.html",
            language: "html"
        },
        { // 1
            offset: 1,
            type: "tag.html",
            language: "html"
        },
        { // 2
            offset: 4,
            type: "",
            language: "html"
        },
        { // 3
            offset: 5,
            type: "attribute.name.html",
            language: "html"
        },
        { // 4
            offset: 13,
            type: "delimiter.html",
            language: "html"
        },
        { // 5
            offset: 14,
            type: "attribute.value.html",
            language: "html"
        },
        { // 6
            offset: 19,
            type: "delimiter.html",
            language: "html"
        }
    ],
    [
        { // 0
            offset: 0,
            type: "",
            language: "html"
        }
    ],
    [
        { // 0
            offset: 0,
            type: "delimiter.html",
            language: "html"
        },
        { // 1
            offset: 2,
            type: "tag.html",
            language: "html"
        },
        { // 2
            offset: 5,
            type: "delimiter.html",
            language: "html"
        }
    ]
]
```

Which represents in HTML:

```html
<div data-foo="bar">
    Hello world
</div>
```

Each array in the array is a Monarch tokenized interpretation of the value of a line in the editor. 

Our tokens will need to track the Monarch tokens and should allow:
- Constructing a `DataDictionary` from them
- Constructing an array of strings representing the line value (Monaco)
- Updating a partial Data Dictionary
- Updating a partial value in a range (Monaco)

These should be broken up into subsets of functionality and will borrow from the nomenclature established by Monaco. Here we will use `actions` and a string name representing the registered action that has been allowed. These will all be related to retrieving a value to be used by Monaco.

The class `MonacoEditorDataDictionaryAdaptor` will have a private variable that it tracks `_dataDictionaryTokens` conforming to the `DataDictionaryToken[]` interface which will be updated anytime the `MessageSystem` sends a `data` or `dataDictionary` updated, and be made available to `actions`.

```typescript
const adaptor = new MonacoEditorDataDictionaryAdaptor({
    /**
     * the FAST tooling message system web worker
     * as defined in https://github.com/microsoft/fast/tree/master/packages/tooling/fast-tooling#message-system
     */
    messageSystem: fastMessageSystem,
    actions: [
        {
            name: "monaco.getValue",
            run: () => {
                // manipulate the tokens into
                // the monaco value and update the Monaco editors model
            }
        },
        {
            name: "monaco.getValueInRange",
            run: () => {
                // manipulate the tokens for a particular range into
                // the monaco value and update the Monaco editors model
            }
        }
    ]
});

/**
 * An item in the DataDictionary was changed via the MessageSystem
 */
adaptor.onDidChangeDataDictionary = (e) => {
    // do something
}

/**
 * Gets the value to be used by monaco
 */
adaptor.actions("monaco.getValue").run();

/**
 * Gets the value within a certain range
 */
adaptor.actions("monaco.getValueInRange").run();
```

The `DataDictionaryToken[]` will map to the same lines as a Monarch `Token[]`.

```typescript
// DataDictionary
[
    {
        "fast-1": {
            schemaId: "div",
            data: {
                "data-foo": "bar",
                Slot: [
                    {
                        id: "fast-2"
                    }
                ]
            }
        },
        "fast-2": {
            parent: {
                dataLocation: "Slot",
                id: "fast-1"
            },
            schemaId: "text",
            data: "Hello world"
        }
    },
    "fast-1"
]

// DataDictionaryToken[]
// Note: delimiters will be stored and checked against for validity
[
    {
        type: "tag.html",
        mapsToDataDictionary: "fast-1",
        mapsToMonacoEditor: [
            {
                tagStart: { // "<", "div" ">"
                    openDelimiter: [0, 0] // target monaco token[0][0]
                    value: [0, 1],
                    closeDelimiter: [0, 6]
                },
                tagEnd: { // "</", "div", ">"
                    openDelimiter: [2, 0],
                    value: [2, 1],
                    closeDelimiter: [2, 2]
                },
                attributes: [ // "data-foo", "=", "bar"
                    {
                        name: [0, 3],
                        assignDelimiter: [0, 4],
                        value: [0, 5],
                    }
                ],
                slots: [
                    [
                        {
                            name: "", // "" signifies a default slot
                            mapsToDataDictionaryLinkedData: "fast-2",
                        }
                    ]
                ]
            }
        ]
    },
    {
        type: "",
        mapsToDataDictionary: "fast-2",
        mapsToMonacoEditor: [
            {
                value: [1, 0] // "Hello world"
            }
        ]
    }
]
```

### Validating

Identify valid tags and their attributes and construct based on that. There is no "real" validation against HTML, as such when values in certain ranges change that could affect the validity of HTML, perform a custom check before allowing the `DataDictionary` in the `MessageSystem` to be updated.

### Editing the Data Dictionary

When the `DataDictionary` has been updated through the `MessageSystem`, this should be registered by the `MonacoEditorDataDictionaryAdaptor` and the `onDidChangeDataDictionary` will execute with the changes.

These updates should determine what form of update the Monaco editor should use, `getValue` or [`getValueInRange`](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html#getvalueinrange).

### Editing using the Monaco Editor

During editing using Monaco editor, a range will be given during the `onDidChangeContent`. The `event` contains the following example information:

```typescript
{
    changes: [
        {
            range: {
                endColumn: 20,
                endLineNumber: 1,
                startColumn: 20,
                startLineNumber: 1, 
            },
            rangeLength: 0,
            rangeOffset: 19,
            text: " " // this is what was typed/pasted
        }
    ],
    eol: "↵"
    isFlush: false
    isRedoing: false
    isUndoing: false
    versionId: 16
}
```

From this information the `DataDictionaryToken[]` can be updated by accessing the array item at index 1 (noted as the `startLineNumber` and `endLineNumber` here) and updating the text. Other updates to explore should contain:
- Updates to attribute names
- Updates to attribute values
- Updates to delimiters
- Updates to tag names

These will result in subsequent updates to the `DataDictionary` via the `MessageSystem`.
