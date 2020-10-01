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

Each component must have a **definition**. This file describes the components API.

Steps to add a new definition:
- Create a TypeScript file using spinal-case, this should be the name of your component and append it with `definition` which should be preceeded by a `.`. An example would be a `fast-button`, the expected name would be `fast-button.definition.ts`.
- Add your export from the file to the component's `index.ts`.

_Component Folder Structure_
```
my-component/
  └─ fixtures/
  └─ index.ts
  └─ my-component.definition.ts <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```

### Open UI Definition

Each component must have an [Open UI definition](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/__test__/component.schema.json). The `implementation` section of the definition will be populated by the above definition.

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

## Configuration

Each component must have a [configuration](https://github.com/microsoft/fast/tree/master/sites/fast-component-explorer/app/fast-components/configs/README.md). This file contains example data for that component.
