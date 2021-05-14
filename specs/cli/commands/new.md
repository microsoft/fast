# FAST New (WIP)

## Overview
FAST New (`fast new`) is a command that is used to scaffold a new FAST project.

## Use Cases
- A user can use FAST CLI to generate a new FAST design system project with a single command.

## Features
- Generates a project based on a given name string

## Prior Art/Examples
- [Aurelia CLI, `au new`](https://aurelia.io/docs/cli/basics/)
- [Stencil CLI, `stencil build`](https://stenciljs.com/docs/cli)

## API

### Commands

**Usage**:
```
$ fast new [arg-1]
 ```
 
**Available commands**:
- `new [project-name]`: Starts the workflow to create a new project

## Design

### Project Generator
```
$ fast new [project-Name]
```

#### Arguments
| Argument         | Type              | Required | Default        |
|------------------|-------------------|----------|----------------|
|`project-name`    | User Input        | Yes      | `my-project`   |

#### Interactive Input Questions
```js
module.exports = [
  {
    name: 'project-name',
    message: 'What would you like to call your project?',
    default: 'my-project',
    required: true,
  },
  {
    name: 'What kind of project would you like to build today?',
    choices: [
      {value: 'app', title: 'App', description: 'Build a starter FAST Application'},
      {value: 'design-system', title: 'Design System', description: 'Build a new design system'},
    ],
  },
  {
    message: 'What JavaScript transpiler would you like to use?',
    choices: [
      {value: 'typescript', title: 'TypeScript (Recommended)', description: 'This is the most robust '},
      {value: 'babel', title: 'Babel'},
    ],
  },
  {
    message: 'Would you like to include all components?',
    choices: [
      {value: 'all-components', title: 'Yes'},
      {value: 'select-components', title: 'No'},
    ],
  },
  {
    if: 'select-components',
    multiple: true,
    message: 'Select components',
    choices: [
      {value: 'button', title: 'Button'},
      {value: 'card', title: 'Card'},
      ...
    ],
  },
  {
    message: 'Would you like to install dependencies now?',
    choices: [
      {value: 'install-deps', title: 'Yes'},
      {value: 'no-install-deps', title: 'No'},
    ],
  },
]
```
<!-- ```
$ What would you like to name your project [Input]?: (my-project)
$ What kind of project?
    - App
      Build a starter application
    - Design System
      Build a starter design system
$ Would you
$ Select components [Multi-select]: (All)
    - All
    - [*Component list*]
``` -->

#### Generated files and folders

*Design System Scaffold*
```
├── my-project/
|   └── __test__/
|       └── fixtures
|           ├── iife.html
|           ├── index.html
|   ├── .storybook/
|   └── build
|       ├── clean.js
|       ├── generate-default-palettes.js
|       ├── generate-open-ui-definition.js
|       ├── transform-fragments.js
|   └── src/
|       └── __test__/
|           ├── component.schema.json
|           ├── README.md
|           ├── setup-browser.ts
|           ├── setup-node.ts
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

*Application Scaffold*
```
├── my-project/
|   └── __test__/
|       └── fixtures
|           ├── iife.html
|           ├── index.html
|   ├── .storybook/
|   └── src/
|       ├── components.ts
|       ├── main.ts
|       ├── styles.ts   
|   ├── .gitignore
|   ├── .mocharc.json
|   ├── .npmignore
|   ├── .npmrc
|   ├── CHANGELOG.md
|   ├── karma.conf.js
|   ├── package.json
|   ├── README.md
|   ├── tsconfig.json
|   └── webpack.config.js
```