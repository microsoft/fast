# Contributing

## The component explorer

The component explorer is a [site](https://explore.fast.design) that showcases the components in the `@microsoft/fast-components` package. This acts as part of the documentation story, in order to expose a component it must have [scenarios](#scenarios), a [definition](#definition) and [configuration](#configuration).

## Scenarios

Each component must have one or more **scenarios**. The scenarios will be surfaced to the component explorer site to be used as examples for that component.

Create a scenario file by adding an `index.html` file inside of a `scenarios` folder.

__Example Folder Structure__
```
my-component/
  └─ fixtures/
  └─ scenarios/index.html <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```

The format of the file should be at least one `template` element, with a `title` attribute that will be used as the display name. The contents of the `template` will then be used as the example. There should only be one child element in the `template`, if more elements are needed, wrap them in a single element such as a `div`.

__Example__
```
<template title="Default">
    <my-component></my-component>
</template>
```

The file can have as many `template` elements as needed as long as the `title` attributes are unique for each one.

## Definitions

### Component Definition

Each component must have a **definition** written in the [VSCode customData](https://github.com/microsoft/vscode-custom-data) format. This is used in @microsoft/fast-tooling, and for integration with the Monaco editor.

First create a `.ts` (typescript) file using spinal-case. This should be the name of your component, append with `.definition`:
```
my-component/
  └─ fixtures/
  └─ index.ts
  └─ my-component.definition.ts <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```

Next add your export from the file to the component's `index.ts`.

Next add your file's export to [./src/component-definitions.ts](./src/component-definitions.ts):

```js
export * from "./my-component/my-component.definition"
```

### Open UI Definition

In addition to a component definition file each component must have an [Open UI definition](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/__test__/component.schema.json). The `implementation` section of the definition will be populated by the above definition.

_Component Folder Structure_
```
my-component/
  └─ fixtures/
  └─ index.ts
  └─ my-component.definition.ts 
  └─ my-component.open-ui.definition.ts <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```
_Example_
```json
{
  "name": "My-Component",
  "url": "https://fast.design/docs/components/my-component"
}
```

## Configuration

Each component must have a [configuration](https://github.com/microsoft/fast/tree/master/sites/fast-component-explorer/app/fast-components/configs/README.md). This file contains example data for that component.
