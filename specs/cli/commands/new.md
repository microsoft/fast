# FAST New (WIP)

## Overview
FAST New (`fast new`) is a command that is used to scaffold a new FAST project.

## Use Cases
- A Front-End Engineer can use FAST CLI to generate a new FAST design system project with a single command.

## Features
- Project generator based on given name string

## Prior Art/Examples
- [Aurelia CLI, `au new`](https://aurelia.io/docs/cli/basics/)
- [Stencil CLI, `stencil build`](https://stenciljs.com/docs/cli)

## API

### Commands

**Usage**:
```
$ fast new [arg-1] [arg-2]
 ```
 
**Available commands**:
- `new [project-name]`: Starts the workflow to create new project

## Design

### Project Generator
```
$ fast new [Project-Name]
```

#### Arguments
| Argument         | Type              | Required | Default        |
|------------------|-------------------|----------|----------------|
|`project-name`    | User Input        | Yes      | `my-project` |
|`destination`     | User Input        | No       | `./`           |

#### Interactive Input Questions

```
$ What would you like to name your project [Input]?: (my-project)
$ Select components [Multi-select]: (All)
    - All
    - [*Component list*]
$ Would you like to define a Design System Provider [multiple-choice]?
    - Define a new one
    - Extend from an existing one
```

#### Generated files and folders
```
├── my-project/
|   ├── .storybook/
|   ├── dist/
|   ├── docs/
|   └── src/
|       ├── __Test__
|       ├── component-1/
|       ├── component-2/
|       ├── ...
|       ├── common-typings.d.ts
|       ├── fixture.specs.ts
|       ├── fixture.ts
|       ├── index.ts
|       ├── storybook-typings.d.ts
|   ├── .eslintignore
|   ├── .eslintrc.js
|   ├── .gitignore
|   ├── .mocharc.json
|   ├── .npmignore
|   ├── .npmrc
|   ├── .prettierignore
|   ├── .api-extractor.js
|   ├── CHANGELOG.md
|   ├── karma.conf.js
|   ├── package.json
|   ├── README.md
|   ├── rollup.config.js
|   └── tsconfig.json
```