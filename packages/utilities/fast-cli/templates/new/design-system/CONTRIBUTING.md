# Contributing

## The component explorer

The component explorer is a [site](https://explore.fast.design) that showcases the components in the `@microsoft/fast-components` package. This acts as part of the documentation story, in order to expose a component it must have [scenarios](#scenarios), a [definition](#definition) and [configuration](#configuration).

### Scenarios

Each component must have one or more **scenarios**. The scenarios will be surfaced to the component explorer site to be used as examples for that component.

Create a scenario file by adding an `index.html` file inside of a `scenarios` folder.

#### Example Folder Structure

```text
my-component/
  └─ fixtures/
  └─ scenarios/index.html <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```

The format of the file should be at least one `template` element, with a `title` attribute that will be used as the display name. The contents of the `template` will then be used as the example. There should only be one child element in the `template`, if more elements are needed, wrap them in a single element such as a `div`.

#### Scenario File Example

```text
<template title="Default">
    <my-component></my-component>
</template>
```

The file can have as many `template` elements as needed as long as the `title` attributes are unique for each one.

## Definitions

### Component Definition

Each component must have a **definition** written in the [VSCode customData](https://github.com/microsoft/vscode-custom-data) format. This is used in @microsoft/fast-tooling, and for integration with the Monaco editor.

First create a `.json` (JSON) file using spinal-case. This should be the name of your component, append with `.vscode.definition`:

```text
my-component/
  └─ fixtures/
  └─ index.ts
  └─ my-component.vscode.definition.json <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```

Next add your file's export to [./src/component-definitions.ts](./src/component-definitions.ts), prepend the export with `fast` and append it with `Definition`:

```js
import fastMyComponentDefinition from "./my-component/my-component.vscode.definition.json";
export { fastMyComponentDefinition };
```

### Open UI Definition

In addition to a component definition file each component must have an [Open UI definition](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/__test__/component.schema.json). The `implementation` section of the definition will be populated by the above definition.

#### Component Folder Structure

```text
my-component/
  └─ fixtures/
  └─ index.ts
  └─ my-component.vscode.definition.json 
  └─ my-component.open-ui.definition.json <--
  └─ my-component.stories.ts
  └─ my-component.styles.ts
```

#### Component Definition File Example

```json
{
  "name": "My-Component",
  "url": "https://fast.design/docs/components/my-component"
}
```

## Configuration

Each component must have a [configuration](https://github.com/microsoft/fast/tree/master/sites/fast-component-explorer/app/fast-components/configs/README.md). This file contains example data for that component.

---

## Development and Testing

### Storybook

Each component should have a Storybook story, and an accompanying fixture to go along with it. The fixture should be a plain HTML file in the `fixtures/` directory.

#### Story fixture

First, make a `fixtures` directory and place a new `.html` fixture file in the directory:

```text
my-component/
  └─ fixtures/
    └─ base.html <--
  └─ my-component.stories.ts
  └─ index.ts
  └─ ...
```

The fixture file should be plain HTML, and should contain different scenarios separated with headings:

```html
<h1>My Component</h1>

<h2>Default</h2>
<my-component></my-component>

<h2>Fancy</h2>
<my-component appearance="fancy"></my-component>
```

#### Story module

Create a `.ts` (typescript) file using spinal-case. This should be the name of your component, appended with `.stories`:

```text
my-component/
  └─ fixtures/
    └─ base.html
  └─ my-component.stories.ts <--
  └─ ...
```

Edit the story file to import the fixture file, the component, and set up the storybook exports:

```ts
import Fixture from "./fixtures/base.html";
import "./index";

export default {
  title: "My Component",
};

export MyComponent = () => Fixture;
```

Make sure to import any other required components as side-effect only imports.

_Note: the `title` field and the scenario export should match; Storybook will try to match the PascalCase export to the space-separated `title` field when generating its sidebar controls._

To run Storybook locally, run `yarn start` and navigate to the local URL provided.
