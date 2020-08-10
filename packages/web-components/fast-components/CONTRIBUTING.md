# Contributing

## The component explorer

The component explorer is a [site](https://explore.fast.design) that showcases the components in the `@microsoft/fast-components` package. This acts as part of the documentation story, in order to expose a component it must have a [definition](#definition) and [configuration](#configuration).

## Definition

Each component must have a **definition**. This file describes the components API.

Steps to add a new definition:
- Create a TypeScript file using spinal-case, this should be the name of your component and append it with `definition` which should be preceeded by a `.`. An example would be a `fast-button`, the expected name would be `fast-button.definition.ts`.
- Add your export from the file to the component's `index.ts`.

## Open UI Definition

Each component must have an [Open UI definition](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/__test__/component.schema.json). The `implementation` section of the definition will be populated by the above definition.

## Configuration

Each component must have a [configuration](https://github.com/microsoft/fast/tree/master/sites/fast-component-explorer/app/fast-components/configs/README.md). This file contains example data for that component.
