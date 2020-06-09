# Definitions

This folder contains a list of definitions for components in the `@microsoft/fast-components` package.

## Adding a new definition

Steps to add a new definition:
- Create a TypeScript file using spinal-case, this should be the name of your component and append it with `definition` which should be preceeded by a `.`. An example would be a `fast-button`, the expected name would be `fast-button.definition.ts`.
- Add your export from the file to `index.ts`.
