# Design — @microsoft/fast-build

This document describes the internal architecture of the `@microsoft/fast-build` package.

---

## High-level overview

`@microsoft/fast-build` is a Node.js CLI tool that server-side renders FAST declarative HTML templates. It delegates all template rendering to a WebAssembly module compiled from the [`microsoft-fast-build`](../../crates/microsoft-fast-build) Rust crate. The Node.js layer is responsible only for:

1. Parsing CLI arguments
2. Locating and parsing template HTML files (glob scanning + `<f-template>` extraction)
3. Loading the entry HTML and state JSON files
4. Calling the WASM renderer
5. Writing the rendered output

```
fast build [options]
        │
        ▼
  parseArgs(argv)        ← --entry, --state, --output, --templates
        │
        ├─ wasm = require(WASM_MODULE)         ← load WASM first
        │
        ├─ resolvePattern(pattern, wasm)  ← for each comma-separated --templates glob
        │       │
        │       ├─ staticPrefixDir(pattern)  ← determine which dir to walk
        │       ├─ walkHtmlFiles(dir)        ← collect .html files
        │       ├─ globMatch(pattern, file)  ← filter by pattern
        │       └─ parseFTemplates(html, filePath, wasm)
        │                │
        │                └─ wasm.parse_f_templates(html)  ← Rust parses <f-template>
        │
        ├─ fs.readFileSync(entry)   ← entry HTML template
        ├─ fs.readFileSync(state)   ← state JSON
        │
        ▼
  wasm.render_with_templates(entry, JSON.stringify(templatesMap), state)
        │
        ▼
  fs.writeFileSync(output, rendered)
```

---

## Module map

| File | Role |
|------|------|
| `bin/fast.js` | CLI entry point — argument parsing, file I/O, template scanning, WASM dispatch |
| `wasm/microsoft_fast_build.js` | WASM-generated JS bindings for the Rust renderer |
| `wasm/microsoft_fast_build_bg.wasm` | Compiled Rust renderer binary |

---

## Template loading — `parseFTemplates`

Template HTML files are scanned for `<f-template>` elements. Each `<f-template>` with a `name` attribute contributes one entry to the templates map:

```html
<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>
```

- The `name` attribute value becomes the element name key in the templates map.
- The inner content of the `<template>` child element becomes the raw template string sent to the WASM renderer.
- A file may contain multiple `<f-template>` elements (each becomes a separate entry).
- If an `<f-template>` has no `name` attribute, a warning is printed to stderr and it is skipped.

### Helpers

| Function | Role |
|----------|------|
| `parseFTemplates(html, filePath, wasm)` | Calls `wasm.parse_f_templates(html)` and emits warnings for nameless templates |

The `<f-template>` parsing logic lives exclusively in the Rust crate (`locator::parse_f_templates`) and is exposed via the `wasm.parse_f_templates` WASM export. The JS layer only handles warnings and file I/O; it contains no duplicate parsing logic.

---

## Glob pattern scanning

Glob patterns support:

| Syntax | Meaning |
|--------|---------|
| `*` | Any characters within one path segment |
| `**` | Zero or more path segments |
| `?` | Any single character within a segment |
| exact path | A literal file path with no wildcards — matches exactly that file |

The scanner works in three steps:

1. **`staticPrefixDir(pattern)`** — extracts the longest static directory prefix before the first wildcard. For exact paths (no wildcards), returns the parent directory.
2. **`walkHtmlFiles(dir)`** — recursively collects all `.html` files under the prefix directory.
3. **`globMatch(pattern, filePath)`** — filters the collected files to those matching the full pattern.

This means exact file paths like `"./components/my-button.html"` are fully supported alongside glob patterns.

---

## WASM integration

Three WASM functions are used:

| Function | Used when |
|----------|-----------|
| `wasm.render(entry, state)` | No custom element templates |
| `wasm.render_with_templates(entry, templatesJson, state)` | At least one template was loaded |
| `wasm.parse_f_templates(html)` | Parsing `<f-template>` elements from each matched HTML file |

`templatesJson` is a JSON-stringified object mapping element names to their raw inner template strings (the content extracted from `<template>` inside `<f-template>`). The WASM renderer uses this map to resolve custom element tags and inject Declarative Shadow DOM.

See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for details on the Rust rendering pipeline.

---

## Error handling

| Condition | Behaviour |
|-----------|-----------|
| `--entry` file not found | Print error to stderr; exit code 1 |
| `--state` file not found | Print error to stderr; exit code 1 |
| `--templates` not provided | Warning to stderr; rendering continues without custom elements |
| Pattern matches no files | Warning to stderr; pattern is skipped |
| `<f-template>` without `name` | Warning to stderr; template is skipped |
| Duplicate template name across files | Warning to stderr; later entry overwrites earlier |
| WASM render error | Print error to stderr; exit code 1 |
