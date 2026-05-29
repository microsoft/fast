---
id: api-reference
title: API Reference
layout: 3x
eleventyNavigation:
  key: api3x
  title: API Reference
  order: 4
navigationOptions:
  activeKey: api3x
permalink: /docs/3.x/api/overview/
description: FAST Element 3.x API reference and package export guide.
keywords:
  - API
  - reference
  - exports
  - imports
  - stability
---

# API Reference

Use this page to choose the right FAST Element import path and then browse the
generated API reference for the public surface of each entrypoint.

## Root vs. path exports

The root package export, `@microsoft/fast-element`, is the primary entrypoint for
FAST Element's component authoring APIs. It is the best default when you are
building custom elements with `FASTElement`, `html`, `css`, `attr`, directives,
observables, state helpers, and other core primitives.

FAST Element 3.x also publishes focused path exports. Use a path export when you
want a smaller, feature-specific entrypoint or when the API is path-only. The
path-only entrypoints should always be imported from their documented package
paths rather than from the package root.

## Common import choices

| Need | Import from | Reference |
|---|---|---|
| Core component authoring APIs | `@microsoft/fast-element` | [Root API reference](/docs/3.x/api/fast-element/) |
| Declarative HTML templates | `@microsoft/fast-element/declarative.js` | [Declarative API reference](/docs/3.x/api/fast-element/declarative/) and [Declarative HTML overview](/docs/3.x/declarative-templates/overview/) |
| Server-rendered hydration | `@microsoft/fast-element/hydration.js` | [Hydration flow](/docs/3.x/declarative-templates/server-rendering/#hydration-flow) and [path export list](/docs/3.x/advanced/path-exports/) |
| W3C Context protocol helpers | `@microsoft/fast-element/context.js` | [Context API reference](/docs/3.x/api/fast-element/context/) |
| Dependency injection container APIs | `@microsoft/fast-element/di.js` | [DI API reference](/docs/3.x/api/fast-element/di/) and [Dependency Injection guide](/docs/3.x/advanced/dependency-injection/) |
| Individual core features, such as `html`, `css`, `attr`, or directives | The matching path export, such as `@microsoft/fast-element/html.js` | [Path exports](/docs/3.x/advanced/path-exports/) |

## Stability tags

The generated API pages include release-tag callouts from API Extractor:

- **Public** APIs are the supported surface for production code.
- **Beta** APIs are preview APIs that can change based on feedback.
- **Alpha** APIs are early previews and should be treated as less stable than
  beta APIs.
- **Internal** APIs are not intended for application code, even when they appear
  in a type signature or generated page.

Prefer public APIs when possible. If a generated page includes a beta or alpha
notice, review the callout before depending on that symbol in production code.

## Generated API docs

The API reference pages are generated from FAST Element's API Extractor output
and should not be edited by hand. Start with the generated
[`@microsoft/fast-element` root reference](/docs/3.x/api/fast-element/) for the
main package surface, then use the path-export references for focused APIs:

- [`@microsoft/fast-element/declarative.js`](/docs/3.x/api/fast-element/declarative/)
- [`@microsoft/fast-element/context.js`](/docs/3.x/api/fast-element/context/)
- [`@microsoft/fast-element/di.js`](/docs/3.x/api/fast-element/di/)

For the complete list of supported package paths, see the
[Path Exports](/docs/3.x/advanced/path-exports/) page.
