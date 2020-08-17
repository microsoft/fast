# Monaco editor utilities

These are spec files for utilities relating to the use of [Monaco Editor](https://github.com/microsoft/monaco-editor).

## Mapping editing

The Monaco Editor accepts string values and in turn creates tokens which will fire during the `onDidChangeContent`. Editing must be available between the `DataDictionary` constructs and the Monaco editor tokens.

### Tokens

The Monaco Editor fields requests for a tokenized version of the current value. It is based on the Monarch lexical analysis which is defined [here](https://microsoft.github.io/monaco-editor/monarch.html).

### Challenges

#### Formatting

The Monaco Editor formats, presumably, with `js-beautify`. This presents an issue when converting tokens.
