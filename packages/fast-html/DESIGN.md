# Design — @microsoft/fast-html

This document describes design decisions and internal architecture for `@microsoft/fast-html`.

---

## Binding resolution pipeline

A declarative template string goes through the following stages before becoming a live FAST `ViewTemplate`:

```
f-template innerHTML
        │
        ▼
transformInnerHTML()          ← normalises {{{html}}} → <div :innerHTML="…"></div>
        │
        ▼
resolveInnerHTML()            ← walks the HTML, finds bindings/directives
        │
        ├─ getNextBehavior()  ← classify next token as dataBinding or templateDirective
        │
        ├─ bindingResolver()  ← builds path resolver + updates schema
        │       │
        │       ├─ getRootPropertyName()   ← first segment of the path
        │       ├─ schema.addPath()        ← records path for ObserverMap
        │       └─ pathResolver()          ← returns (element, context) => value
        │
        └─ ViewTemplate.create(strings, values)
```

---

## Dataset binding conversion

### Problem

`HTMLElement.dataset` is a native read-only `DOMStringMap` getter — it is not configurable and cannot be wrapped by FAST's `Observable.defineProperty`. A naive binding path like `dataset.dateOfBirth` would resolve correctly on initial render (reading `element.dataset.dateOfBirth`) but would not be reactive, and `ObserverMap.defineProperties()` would attempt to shadow the native `dataset` getter on the element prototype, which silently fails or throws.

### Solution

When `bindingResolver` is called with a path that starts with `"dataset."`, it strips the prefix and uses the remaining camelCase segment as the **effective path**:

```
dataset.dateOfBirth  →  dateOfBirth
dataset.userId       →  userId
```

This aligns with the [MDN `HTMLElement.dataset` convention](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) where camelCase property names map to `data-*` HTML attribute names:

| `dataset.*` property | HTML attribute |
|---|---|
| `dateOfBirth` | `data-date-of-birth` |
| `userId` | `data-user-id` |

After conversion:
- `getRootPropertyName` sees `"dateOfBirth"` (not `"dataset"`), so the schema root is `dateOfBirth`.
- `pathResolver("dateOfBirth", …)` accesses `element.dateOfBirth`.
- `ObserverMap.defineProperties()` finds or creates an observable for `dateOfBirth` — if the element declares `@attr({ attribute: "data-date-of-birth" }) dateOfBirth: string`, the existing `@attr` accessor is reused and the binding is fully reactive.

### Helper export

`datasetCamelToAttribute(camelCase: string): string` is exported from the package to help server-side renderers and tooling produce the correct `data-*` attribute name from a camelCase property name:

```ts
datasetCamelToAttribute("dateOfBirth"); // "data-date-of-birth"
```

---

## Schema and ObserverMap

The `Schema` class (in `schema.ts`) builds a JSON Schema representation of every binding path encountered in a template. Each root property in the schema corresponds to one Observable property on the element. The `ObserverMap` (in `observer-map.ts`) uses the schema to:

1. Identify root properties that need Observable definitions.
2. Skip properties that already have `@attr` or `@observable` accessors.
3. Set up deep-proxy change callbacks for nested object/array properties.

---

## Hydration markers

Attribute bindings are tracked in pre-rendered HTML using `data-fe-b-*` dataset attributes. These allow the `HydratableElementController` to match DOM nodes to template binding slots without relying on element position alone. Three formats are supported (see `RENDERING.md` for details):

| Format | Example |
|---|---|
| Space-separated | `data-fe-b="0 1 2"` |
| Enumerated | `data-fe-b-0 data-fe-b-1` |
| Compact | `data-fe-c-0-3` |
