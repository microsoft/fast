# FAST Tooling

FAST Tooling is a library agnostic specific set of utilities to assist in creating web UI.

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) &nbsp; ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge)

- [Installation](#installation)
- [Concepts](#concepts)
    - [JSON Schema](#json-schema)

## Installation

`npm i --save @microsoft/fast-tooling`

## Concepts

### JSON Schema

[JSON schema](http://json-schema.org/) is used extensively in FAST tooling, they help identify nesting structures for components and their children as well as provide additional hooks for plugin systems in the FAST tool libraries.

The data structure for children is provided as an export, although JSON can of course be used in the `*.json` format, we provide ours as data blobs.

Example JSON Schema with a children property:

```ts
import { childrenSchema } from "@microsoft/fast-tooling";

{
    $schema: "http://json-schema.org/schema#",
    title: "Component with children-properties",
    type: "object",
    id: "component-with-two-children-properties",
    properties: {
        children: {
            ...childrenSchema,
            title: "Children",
        },
        otherChildren: {
            ...childrenSchema,
            title: "Other children"
        }
    }
}
```
