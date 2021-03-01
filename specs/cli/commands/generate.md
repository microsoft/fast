# FAST Generate (WIP)

## Overview
FAST `generate` is a command that is used to generate new FAST design system resources such as new components. The initial release will focus on component generation. Future iterations will include the ability to generate other resources.

## Use Cases
- A users can generate a new component file structure in FAST using a single command in FAST CLI

## Features
- Resource generator based name string argument
- Interactive input questions

## Prior Art/Examples
- [Aurelia CLI, `au generate`](https://aurelia.io/docs/cli/basics#generators)
- [Stencil CLI, `stencil generate`](https://stenciljs.com/docs/cli)

## API

### Commands

**Usage**:
```
$ fast generate <resource> [element-name] [destination]
 ```

#### Arguments
| Argument         | Type              | Required | Default Value  | Description                        |
|------------------|-------------------|----------|----------------|------------------------------------|
| `resource`       | User Input        | Yes      | `component`    | The type of resource being created |
| `element-name`   | User Input        | Yes      | `my-component` | Name of component                  |
| `destination`    | User input        | No       | `./src`        | Destination of component files     |


## Design

### Component Generation

Example:
```
$ fast generate
```

#### Interactive Input Questions (Component):
```
$ What would you like to name your component? [Input]: (my-component)
$ Would you like to extend an existing component? [Choice]: (yN)
  [Yes]: 
    $ Which component would you like to extend?
      (Multiple Choice: List of components)
    $ Would you like to inherit [componet-name]'s template? (Yn)
    $ Would you like to inherit [component-name]'s styles? (Yn)
  [No]: Break to next question
```

#### Generated Files
```
├── example-card/
|   └── fixtures/
|       ├── example-card.html
|   ├── example-card.ts
|   ├── example-card.stories.ts
|   ├── example-card.styles.ts
|   ├── example-card.template.ts
|   └── index.ts
```

Append component export to entry-point file:

In `src/index.ts`
```javascript=
...
export * from "./example-card/"
...
```
## Roadmap

While the initial focus of the `generate` command will be `generate component`. Possible future resources include: templates, styles, design tokens and color recipes.
