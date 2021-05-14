# FAST CLI (WIP)

## Overview
FAST CLI is a set of tools used for creating, building, and developing FAST projects.

## Use Cases
- A user can use FAST CLI to generate a new FAST project based on user input
- A user can generate a new component file structure in FAST using a single command in FAST CLI

## Features
- Command line interface that accepts user input in the form arguments and flags
- Cross-platform functionality
## Prior Art/Examples
- [Aurelia CLI](https://aurelia.io/docs/cli/basics/)
- [Stencil CLI](https://stenciljs.com/docs/cli)
- [Open Web Components](https://open-wc.org/docs/development/generator/)
- [Angular CLI](https://cli.angular.io/)

## API

### Commands

**Usage**:
```
$ fast [command] [arg-1] [--flag-1/-f] [--flag-2/-f]
 ```
## Commands

| Name                             | Command    | Description                                                  | Spec                 | Built   |
|----------------------------------|------------|--------------------------------------------------------------|----------------------|---------|
|[Generate](./commands/generate.md)| `generate` | Generates a new component                                    | :white_check_mark:   | --      |
|[New](./commands/new.md)          | `new`      | Generates a new FAST project                                 | :white_check_mark:   | --      |

**Flags**:
- `--help`


## Next Steps

### Commands Under Consideration

| Name             | Command    | Description                                                  | Spec                 | Built   |
|------------------|------------|--------------------------------------------------------------|----------------------|---------|
|Build             | `build`    | Bundles all project files                                    | --                   | --      |
|Publish           | `publish`  | Bundles the complete design system into an NPM package       | --                   | --      |
|Start             | `start`    | Starts Story Book component explorer server                  | --                   | --      |
|Stop              | `stop`     | Stops Story Book component explorer server                   | --                   | --      |
|Test              | `test`     | Runs the test suite                                          | --                   | --      |
|Version           | `version`  | Displays the current FAST version                            | --                   | --      |

### Future features
- Context-awareness. Detects whether the current directory contains the appropriate FAST dependency.
