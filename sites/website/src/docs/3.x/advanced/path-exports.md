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

`@microsoft/fast-element` exposes its implementation APIs from the root export. Path exports are also available when you want to import a focused entrypoint directly. Declarative, hydration, context, and dependency injection APIs are path-only and should be imported from their listed paths.

This table is generated from the `exports` field in `@microsoft/fast-element/package.json`.

Run `npm run doc:path-exports -w @microsoft/fast-element` after changing package exports, and use `npm run doc:path-exports:check -w @microsoft/fast-element` to verify the generated table is current.

| Import path | Provides | Runtime target | Types |
|---|---|---|---|
| `@microsoft/fast-element` | Root implementation export for FAST Element APIs. | `./dist/esm/index.js` | `./dist/dts/index.d.ts` |
| `@microsoft/fast-element/arrays.js` | ArrayObserver class for observing array mutations, and array observation APIs. | `./dist/esm/observation/arrays.js` | `./dist/dts/observation/arrays.d.ts` |
| `@microsoft/fast-element/attr.js` | Attribute decorator and attribute definition APIs. | `./dist/esm/components/attributes.js` | `./dist/dts/components/attributes.d.ts` |
| `@microsoft/fast-element/attribute-map.js` | Schema-driven attribute map extension. | `./dist/esm/declarative/attribute-map.js` | `./dist/dts/declarative/attribute-map.d.ts` |
| `@microsoft/fast-element/binding.js` | Binding directives and binding helpers. | `./dist/esm/binding/exports.js` | `./dist/dts/binding/exports.d.ts` |
| `@microsoft/fast-element/children.js` | children directive. | `./dist/esm/templating/children.js` | `./dist/dts/templating/children.d.ts` |
| `@microsoft/fast-element/context.js` | Path-only context protocol APIs. | `./dist/esm/context.js` | `./dist/dts/context.d.ts` |
| `@microsoft/fast-element/css.js` | CSS template tag APIs. | `./dist/esm/styles/css.js` | `./dist/dts/styles/css.d.ts` |
| `@microsoft/fast-element/debug.js` | Debug message helpers. | `./dist/esm/debug.js` | `./dist/dts/debug.d.ts` |
| `@microsoft/fast-element/declarative-utilities.js` | Declarative parser and observer-map utilities. | `./dist/esm/declarative/utilities.js` | `./dist/dts/declarative/utilities.d.ts` |
| `@microsoft/fast-element/declarative.js` | Path-only declarative template APIs. | `./dist/esm/declarative/index.js` | `./dist/dts/declarative/index.d.ts` |
| `@microsoft/fast-element/di.js` | Path-only dependency injection APIs. | `./dist/esm/di/di.js` | `./dist/dts/di/di.d.ts` |
| `@microsoft/fast-element/dom-policy.js` | Trusted Types DOM policy helpers. | `./dist/esm/dom-policy.js` | `./dist/dts/dom-policy.d.ts` |
| `@microsoft/fast-element/dom.js` | DOM abstraction and DOM aspect APIs. | `./dist/esm/dom.js` | `./dist/dts/dom.d.ts` |
| `@microsoft/fast-element/fast-element.js` | FASTElement and the customElement decorator. | `./dist/esm/components/fast-element.js` | `./dist/dts/components/fast-element.d.ts` |
| `@microsoft/fast-element/html.js` | HTML template tag APIs. | `./dist/esm/templating/html.js` | `./dist/dts/templating/html.d.ts` |
| `@microsoft/fast-element/hydration.js` | Path-only opt-in hydration APIs. | `./dist/esm/hydration/exports.js` | `./dist/dts/hydration/exports.d.ts` |
| `@microsoft/fast-element/notifier.js` | Notifier APIs. | `./dist/esm/observation/notifier.js` | `./dist/dts/observation/notifier.d.ts` |
| `@microsoft/fast-element/observable.js` | Observable decorator and Observable APIs. | `./dist/esm/observation/observable.js` | `./dist/dts/observation/observable.d.ts` |
| `@microsoft/fast-element/observer-map.js` | Schema-driven observer map extension. | `./dist/esm/declarative/observer-map.js` | `./dist/dts/declarative/observer-map.d.ts` |
| `@microsoft/fast-element/ref.js` | ref directive. | `./dist/esm/templating/ref.js` | `./dist/dts/templating/ref.d.ts` |
| `@microsoft/fast-element/registry.js` | FASTElement definition and registry APIs. | `./dist/esm/registry.js` | `./dist/dts/registry.d.ts` |
| `@microsoft/fast-element/render.js` | Render directive APIs. | `./dist/esm/render.js` | `./dist/dts/render.d.ts` |
| `@microsoft/fast-element/repeat.js` | repeat directive. | `./dist/esm/templating/repeat.js` | `./dist/dts/templating/repeat.d.ts` |
| `@microsoft/fast-element/schema.js` | Schema and schema registry APIs. | `./dist/esm/schema.js` | `./dist/dts/schema.d.ts` |
| `@microsoft/fast-element/signal.js` | Signal binding helper. | `./dist/esm/binding/signal.js` | `./dist/dts/binding/signal.d.ts` |
| `@microsoft/fast-element/slotted.js` | slotted directive. | `./dist/esm/templating/slotted.js` | `./dist/dts/templating/slotted.d.ts` |
| `@microsoft/fast-element/state.js` | State and watch helpers. | `./dist/esm/state/exports.js` | `./dist/dts/state/exports.d.ts` |
| `@microsoft/fast-element/two-way.js` | Two-way binding helper. | `./dist/esm/binding/two-way.js` | `./dist/dts/binding/two-way.d.ts` |
| `@microsoft/fast-element/updates.js` | DOM update queue APIs. | `./dist/esm/observation/update-queue.js` | `./dist/dts/observation/update-queue.d.ts` |
| `@microsoft/fast-element/utilities.js` | DOM utility helpers. | `./dist/esm/utilities.js` | `./dist/dts/utilities.d.ts` |
| `@microsoft/fast-element/volatile.js` | Volatile observable decorator. | `./dist/esm/observation/volatile.js` | `./dist/dts/observation/volatile.d.ts` |
| `@microsoft/fast-element/when.js` | when directive. | `./dist/esm/templating/when.js` | `./dist/dts/templating/when.d.ts` |
| `@microsoft/fast-element/package.json` | Package metadata. | `./package.json` | n/a |
