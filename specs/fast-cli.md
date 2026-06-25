- [Abstract](#abstract)
- [Use Cases](#use-cases)
- [Requirements](#requirements)
    - [Configuration](#configuration)
        - [Project Type](#project-type)
            - [Application](#application)
            - [Component Library](#component-library)
            - [Non-Specific Project Type Options](#non-specific-project-type-options)
    - [Command Line](#command-line)
        - [Initialization](#initialization)
        - [Adding A Component](#adding-a-component)
            - [Adding A Foundation Based Component](#adding-a-foundation-based-component)
    - [Structure](#structure)
        - [Create FAST Project Package](#create-fast-project-package)
        - [FAST CLI Package](#fast-cli-package)
    - [Dependencies](#dependencies)
- [Implementation](#implementation)
- [Documentation](#documentation)
    - [System Requirements](#system-requirements)
    - [Use Of The CLI](#use-of-the-cli)
    - [How To Create Templates](#how-to-create-templates)
- [Maintenance](#maintenance)
    - [Testing](#testing)
- [Roadmap](#roadmap)
    - [MVP](#mvp)

## Abstract

This specification describes a CLI used for the creation and running of FAST based applications and component libraries called `@microsoft/fast-cli`, as well as a package leveraging the CLI and allowing `npm` to initialize it called `@microsoft/create-fast-project`. The CLI is intended to accelerate user workflows when using FAST, and the initialization package is intended to assist in a quick setup for projects such as applications and component libraries.

## Use Cases

**Creating a prototype**: Bob is a hobbyist illustrator and wants to create a FAST web component based application quickly to prototype a website for his work. He knows how to write HTML, CSS, and some JavaScript, but does not want to get bogged down with testing or type checking.

**Creating a production application**: April is a developer who has been tasked with creating an application that must run efficiently and is maintainable. She wants a quick setup of an application for a production environment which should include type checking, testing and server side rendering.

**Creating a component library**: Wilhelm is a UI developer, he wants to create a library of FAST web components for his company to use in their application. His companys current application has mismatched design concepts, so he has also been developing a design system and wants the components he creates to conform to it.

## Requirements

### Configuration

The configuration of the project will occur during the setup using `npm init @microsoft/fast-project ./my-project` see [`npm init` documentation](https://docs.npmjs.com/cli/v6/commands/npm-init). This requires the user has npm >=6.0.0. Certain CLI commands can be used depending on the configuration, such as adding boilerplate components with `fast add --component`. The following configuration options will be determined during initialization.

#### Project Type

There will be two project types, `application` and `component-library`. When this is specified, this will allow the CLI to make assumptions about the project. The projects structure will change based on what type of project this is, additionally `webpack` will be added and configured if the project is an application.

##### Application

**Server Side Rendering**

This option will enable SSR (Server Side Rendering).

**End to End Testing**

A user may want some end to end tests. These tests will be scaffolded in Playwright. The will conform to a `*.spec.pw.ts` or `*.spec.pw.js` file name to avoid conflict with unit tests.

An `npm` script will be added `test:e2e`.
The `npm` script `test` will include this script.

##### Component Library

**Design Tokens**

Design tokens can be added, which will initialize an example design token and integrate it with the first example component.

#### Non-Specific Project Type Options

**Type Checking**

The user will have the option of plain JavaScript of TypeScript. This will facilitate production and prototyping experiences. It will also be more friendly to users who may not be familiar with TypeScript.

Should you use TypeScript, a `npm` script will be added `build:tsc` which will build your project using the TypeScript compiler. If you choose to use JavaScript, further options with `babeljs` will be used to compile the project.

**Manual Component Testing**

Components are often manually tested during the process of component creation which can involve a lot of back and forth to check the component in the browser. For this reason there will be an option to add storybook.

An `npm` script will be added `start:storybook`.

**Unit Testing**

This option will set up Mocha and Chai and when new components are added via the CLI they will create a `*.spec.ts` or `*.spec.js` file.

An `npm` script will be added `test:unit-test`.
The `npm` script `test` will include this script.

**Linting**

Another more production level feature is linting. We can offer the user configuration and setup for `eslint`.

An `npm` script will be added `eslint`.
The `npm` script `test` will include this script.

### Command Line

#### Initialization

The first step in configuration is initializing the project, which will create the configuration file for FAST. This will be done via the `npm init @microsoft/fast-project ./my-project`. The `<initializer>` in this instance is `fast-project` which transforms if one were to use `npx` into `create-fast-project`, so the `npx` command becomes `npx @microsoft/create-fast-project`. `npm` will assume that `create-` is to be prepended to the unscoped name of the package.

#### Adding A Component

Adding a component should be performed using the CLI with `fast add --component` which will create scaffolding of the template, styles, class, and any testing or other files based on the FAST configuration file.

##### Adding A Foundation Based Component

Adding a component based on a `@microsoft/fast-foundation` component should be performed using the CLI with `fast add --component --foundation=button`.

### Structure

There should be two packages which enable this project, `@microsoft/create-fast-project` and `@microsoft/fast-cli`. One is for setting up the project via `npm init` and templates, the other is a CLI for additional commands.

#### Create FAST Project Package

The `@microsoft/create-fast-project` package will interact with `npm init`. It will assume that `npm init` is running it and setup all the options via the `@microsof/fast-cli` as specified in the requirements.

#### FAST CLI Package

The `@microsoft/fast-cli` package should be as lightweight as possible, it should also rely on the configuration file for details about how the project has been setup. In this way, if a user were to retro-fit an existing repository to use the CLI as part of their process this would be possible. An example of this is already having a production application, but needing configuration details to use SSR (Server Side Rendering).

### Dependencies

Dependencies are necessary for the following requirements:
- Command line arguments
- Colorization of terminal text

## Documentation

Documentation will be required for users and for maintainers. Since this model is plug and play with templates, the documentation must also cover this scenario.

### System Requirements

There should be a list of system requirements for using `@microsoft/fast-cli` and `@microsoft/create-fast-project`. These should primarily be focused on `npm` and NodeJS versions.

### Use Of The CLI

The commands available should be documentated as well as a step-by-step getting started page for all the project types. There should be a dictionary of commands available in a side bar for easy access, though the commands and their documentation may exist on a single page. They may need to be tagged with which project type they can be executed on, additionally documentation may exist in the code, providing users with warnings when they attempt to use commands for a different project type than the one they are configured for.

### How To Create Templates

A few templates will be shipped as defaults with the package, however in future there may be other template creators who will want to specify their own templates instead of the defaults.

**TBD**: Add user stories for template creation.

## Maintenance

As with all projects, this one must undergo maintenance when changes occur in any of the dependencies. There should be a document categorizing what dependencies may need to be updated in future as well as a build script which issue warnings when dependencies go out of date for major versions.

### Testing

This project should have unit tests for:
- Initialization
- All configuration options
- Running the projects test script after intializing a project to ensure FAST does not break the initialized project

## Roadmap

### MVP

- Ability to generate a new application based on a default template
- One template to start
- TypeScript/JavaScript option
- SSR option
