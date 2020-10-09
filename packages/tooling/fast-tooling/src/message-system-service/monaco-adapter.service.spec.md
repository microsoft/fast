# Monaco editor service

These are spec files for the service relating to the use of the [Monaco Editor](https://github.com/microsoft/monaco-editor).

## `MonacoAdapter`

The adapter will function as a go-between to convert data structures inherent to the Monaco editor, and the `DataDictionary`.

### Initialization

Steps:
1. `MonacoAdapter` registers with the provided `MessageSystem`
2. An initialization message is sent via the `MessageSystem`
3. The internals of the `MonacoAdapter` convert the supplied `DataDictionary` from the initialization into a string array of `HTML` using the `mapDataDictionaryToMonacoEditorHTML` utility in conjunction with the `js-beautify` (a dependency of the `vscode-html-languageservice`) and separating out each newline as its own array item
4. The `HTML` string array is then retrieved from the `onInitialize` callback of the `MonacoAdapter` and set as the `value` of the model in the Monaco editor
5. Subsequent updates follow the [Editing the Data Dictionary](#editing-the-data-dictionary) and [Editing using the Monaco Editor](#editing-using-the-monaco-editor) sections

### `MonacoAdapter`

The `MonacoAdapter` will serve as an instantiated class that takes the FAST message system and actions as properties. It will store the string value from Monaco and use this as a baseline for retrieving `DataDictionary`. To do this it will make use of the [vscode-html-languageservice](https://github.com/microsoft/vscode-html-languageservice) to parse into the `HTMLDocument` interface from a `TextDocument`.

All `actions` are a subset of functionality and will borrow from the nomenclature established by Monaco. Here we will use `actions` and a string `id` representing the registered action. These will all be related to retrieving a value to be used by Monaco or FAST with each having `monaco` or `fast` as a prefix. All `actions` are promises and can be chained.

### Editing the Data Dictionary

When the `DataDictionary` has been updated through the `MessageSystem`, this should be registered by the `MonacoAdapter`.

Example of an implementation that triggers a Monaco editor update when a `DataDictionary` has been updated:

```typescript
const adapter = new MonacoAdapter({
    /**
     * the FAST tooling message system web worker
     * as defined in https://github.com/microsoft/fast/tree/master/packages/tooling/fast-tooling#message-system
     */
    messageSystem: fastMessageSystem,
    actions: [
        {
            id: "monaco.getValue",
            run: (config) => {
                // retrieve the string value that the
                // monaco editor expects
            }
        },
    ]
});

function handleMessageSystem = (e): void => {
    if (e.data.type === MessageSystemType.initialize) {
        /**
         * Gets the value to be used by monaco
         */
        adapter.action("monaco.getValue").run().then((config) => {
            setMonacoEditorValue(config.value);
        });
    }
}

fastMessageSystem.add({
    onMessage: handleMessageSystem
});
```

### Editing using the Monaco Editor

When the `onDidChangeContent` for the Monaco editor model is called, an `action` should be supplied to set the monaco value. When this is run the [vscode-html-languageservice](https://github.com/microsoft/vscode-html-languageservice) parser will be used to convert the string(s) into the `HTMLDocument` which can then be transformed into the `DataDictionary`, whereby a `postMessage` will be sent to trigger updates thoughout the `MessageSystem`.

Example of the implementation that triggers a `MessageSystem` update targeting the `DataDictionary`:

```typescript
const adapter = new MonacoAdapter({
    messageSystem: fastMessageSystem,
    actions: [
        {
            id: "monaco.setValue",
            run: (config) => {
                // trigger an update to the monaco value that
                // also updates the DataDictionary which fires a
                // postMessage to the MessageSystem
            }
        },
    ]
});

monaco.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
    (monaco.editor.getModel(
        listener.uri
    ) as monaco.editor.ITextModel).onDidChangeContent(
        (event: monaco.editor.IModelContentChangedEvent) => {
            /**
             * Sets the value to be used by monaco
             */
            adapter.action("monaco.setValue").run();
        }
    );
});
```
