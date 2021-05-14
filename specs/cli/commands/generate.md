# FAST Generate (WIP)

## Overview
FAST `generate` is a command that is used to generate new FAST design system resources such as components. The initial release will focus on component generation. Future iterations will include the ability to generate other resources.

## Use Cases
- A user can generate a new FAST resource file structure, such as a component, using a single command in FAST CLI

## Features
- Generates a resource file structure based on user input.

## Prior Art/Examples
- [Aurelia CLI, `au generate`](https://aurelia.io/docs/cli/basics#generators)
- [Stencil CLI, `stencil generate`](https://stenciljs.com/docs/cli)

## API

### Commands

**Usage**:
```
$ fast generate [resource-name]
 ```

#### Arguments
| Argument         | Type              | Required | Default Value  | Description          |
|------------------|-------------------|----------|----------------|----------------------|
| `resource-name`  | User Input        | Yes      | `my-component` | Name of the resource |

## Design

### Component Generation

Example:
```
$ fast generate example-component
```

#### Generated Files
```
├── example-component/
|   └── fixtures/
|       ├── example-component.html
|   ├── example-component.ts
|   ├── example-component.stories.ts
|   ├── example-component.styles.ts
|   ├── example-component.template.ts
|   ├── index.ts
|   └── README.md
```

The command will also append component to the entry-point file:

In `src/index.ts`
```javascript=
...
export * from "./example-component/"
...
```
## Roadmap

While the initial focus of the `generate` command will be `generate component`, there are plans for it to be expanded to include the generation of other resources such as templates, styles, design tokens, and color recipes.
