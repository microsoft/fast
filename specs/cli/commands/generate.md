# FAST Generate (WIP)

## Overview
FAST `generate` is a command that is used to scaffold out the file structure of a new component in a FAST project.

## Use Cases
- A Front-End Engineer can generate a new component file structure in FAST using a single command in FAST CLI

## Features
- Component generator nased on given name string
- Interactive input

## Prior Art/Examples
- [Aurelia CLI, `au generate`](https://aurelia.io/docs/cli/basics#generators)
- [Stencil CLI, `stencil generate`](https://stenciljs.com/docs/cli)

## API

### Commands

**Usage**:
```
$ fast generate [element-name] [destination]
 ```

#### Arguments
| Argument         | Type              | Required | Default Value  | Description                    |
|------------------|-------------------|----------|----------------|--------------------------------|
| `element-name`   | User Input        | Yes      | `my-component` | Name of component              |
| `destination`    | User input        | No       | `./src`        | Destination of component files |


## Design

### Component Generator

Example:
```
$ fast generate
```

#### Interactive Input Questions:
```
$ What would you like to name your component? [Input]: (my-component)
$ Would you like to extend and existing component? [Choice]: (yN)
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
## Next Steps
