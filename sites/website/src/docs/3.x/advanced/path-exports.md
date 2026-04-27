---
id: path-exports
title: Path Exports
layout: 3x
eleventyNavigation:
  key: path-exports3x
  parent: advanced3x
  title: Path Exports
navigationOptions:
  activeKey: path-exports3x
description: Package path exports for @microsoft/fast-element.
keywords:
  - exports
  - path exports
  - package exports
---

# Path Exports

`@microsoft/fast-element` exposes its implementation APIs from the root export. Path exports are also available when you want to import a focused entrypoint directly.

This table is generated from the `exports` field in `@microsoft/fast-element/package.json`.

| Import path | Provides | Runtime target | Types |
|---|---|---|---|
| `@microsoft/fast-element` | Root implementation export for FAST Element APIs. | `./dist/esm/index.js` | `./dist/dts/index.d.ts` |
| `@microsoft/fast-element/debug.js` | Debug message helpers. | `./dist/esm/debug.js` | `./dist/dts/debug.d.ts` |
| `@microsoft/fast-element/fast-element.js` | FASTElement and the customElement decorator. | `./dist/esm/components/fast-element.js` | `./dist/dts/components/fast-element.d.ts` |
| `@microsoft/fast-element/declarative.js` | Declarative template APIs. | `./dist/esm/declarative/index.js` | `./dist/dts/declarative/index.d.ts` |
| `@microsoft/fast-element/declarative-utilities.js` | Declarative parser and observer-map utilities. | `./dist/esm/declarative/utilities.js` | `./dist/dts/declarative/utilities.d.ts` |
| `@microsoft/fast-element/attribute-map.js` | Schema-driven attribute map extension. | `./dist/esm/declarative/attribute-map.js` | `./dist/dts/declarative/attribute-map.d.ts` |
| `@microsoft/fast-element/observer-map.js` | Schema-driven observer map extension. | `./dist/esm/declarative/observer-map.js` | `./dist/dts/declarative/observer-map.d.ts` |
| `@microsoft/fast-element/hydration.js` | Opt-in hydration APIs. | `./dist/esm/hydration.js` | `./dist/dts/hydration.d.ts` |
| `@microsoft/fast-element/binding.js` | Binding directives and binding helpers. | `./dist/esm/binding.js` | `./dist/dts/binding.d.ts` |
| `@microsoft/fast-element/two-way.js` | Two-way binding helper. | `./dist/esm/binding/two-way.js` | `./dist/dts/binding/two-way.d.ts` |
| `@microsoft/fast-element/signal.js` | Signal binding helper. | `./dist/esm/binding/signal.js` | `./dist/dts/binding/signal.d.ts` |
| `@microsoft/fast-element/render.js` | Render directive APIs. | `./dist/esm/render.js` | `./dist/dts/render.d.ts` |
| `@microsoft/fast-element/utilities.js` | DOM utility helpers. | `./dist/esm/utilities.js` | `./dist/dts/utilities.d.ts` |
| `@microsoft/fast-element/state.js` | State and watch helpers. | `./dist/esm/state/exports.js` | `./dist/dts/state/exports.d.ts` |
| `@microsoft/fast-element/context.js` | Context protocol APIs. | `./dist/esm/context.js` | `./dist/dts/context.d.ts` |
| `@microsoft/fast-element/di.js` | Dependency injection APIs. | `./dist/esm/di/di.js` | `./dist/dts/di/di.d.ts` |
| `@microsoft/fast-element/dom.js` | DOM abstraction and DOM aspect APIs. | `./dist/esm/dom.js` | `./dist/dts/dom.d.ts` |
| `@microsoft/fast-element/dom-policy.js` | Trusted Types DOM policy helpers. | `./dist/esm/dom-policy.js` | `./dist/dts/dom-policy.d.ts` |
| `@microsoft/fast-element/updates.js` | DOM update queue APIs. | `./dist/esm/updates.js` | `./dist/dts/updates.d.ts` |
| `@microsoft/fast-element/arrays.js` | Array observation helpers. | `./dist/esm/arrays.js` | `./dist/dts/arrays.d.ts` |
| `@microsoft/fast-element/array-observer.js` | ArrayObserver. | `./dist/esm/array-observer.js` | `./dist/dts/array-observer.d.ts` |
| `@microsoft/fast-element/schema.js` | Schema and schema registry APIs. | `./dist/esm/schema.js` | `./dist/dts/schema.d.ts` |
| `@microsoft/fast-element/observable.js` | Observable and observable decorator APIs. | `./dist/esm/observable.js` | `./dist/dts/observable.d.ts` |
| `@microsoft/fast-element/volatile.js` | Volatile observable decorator. | `./dist/esm/volatile.js` | `./dist/dts/volatile.d.ts` |
| `@microsoft/fast-element/attr.js` | Attribute decorator and attribute definition APIs. | `./dist/esm/attr.js` | `./dist/dts/attr.d.ts` |
| `@microsoft/fast-element/css.js` | CSS template tag APIs. | `./dist/esm/css.js` | `./dist/dts/css.d.ts` |
| `@microsoft/fast-element/html.js` | HTML template tag APIs. | `./dist/esm/html.js` | `./dist/dts/html.d.ts` |
| `@microsoft/fast-element/templating.js` | Advanced templating APIs. | `./dist/esm/templating.js` | `./dist/dts/templating.d.ts` |
| `@microsoft/fast-element/children.js` | children directive. | `./dist/esm/directives/children.js` | `./dist/dts/directives/children.d.ts` |
| `@microsoft/fast-element/node-observation.js` | Node observation directive APIs. | `./dist/esm/directives/node-observation.js` | `./dist/dts/directives/node-observation.d.ts` |
| `@microsoft/fast-element/ref.js` | ref directive. | `./dist/esm/directives/ref.js` | `./dist/dts/directives/ref.d.ts` |
| `@microsoft/fast-element/slotted.js` | slotted directive. | `./dist/esm/directives/slotted.js` | `./dist/dts/directives/slotted.d.ts` |
| `@microsoft/fast-element/when.js` | when directive. | `./dist/esm/directives/when.js` | `./dist/dts/directives/when.d.ts` |
| `@microsoft/fast-element/repeat.js` | repeat directive. | `./dist/esm/directives/repeat.js` | `./dist/dts/directives/repeat.d.ts` |
| `@microsoft/fast-element/styles.js` | Element style APIs. | `./dist/esm/styles.js` | `./dist/dts/styles.d.ts` |
| `@microsoft/fast-element/package.json` | Package metadata. | `./package.json` | n/a |
