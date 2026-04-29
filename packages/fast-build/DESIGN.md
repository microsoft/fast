# Design — @microsoft/fast-build

This document describes the internal architecture of the `@microsoft/fast-build` package.

---

## High-level overview

`@microsoft/fast-build` is a Node.js CLI tool that server-side renders FAST declarative HTML templates. It delegates all template rendering to a WebAssembly module compiled from the [`microsoft-fast-build`](../../crates/microsoft-fast-build) Rust crate. The Node.js layer is responsible only for:

1. Parsing CLI arguments and loading configuration
2. Locating and parsing template HTML files (glob scanning + `<f-template>` extraction)
3. Loading the entry HTML file and optional state JSON file
4. Calling the WASM renderer
5. Writing the rendered output

```
fast build [options]
        │
        ▼
  parseArgs(argv)        ← --entry, --state, --output, --templates, --attribute-name-strategy, --config
        │
        ├─ loadConfig(configPath)             ← load fast-build.config.json
        │       │
        │       ├─ explicit --config path     ← error if file missing
        │       └─ default CWD lookup         ← silent fallback if missing
        │
        ├─ resolveOption(args, config, …)     ← CLI args override config values
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
        ├─ fs.readFileSync(state)   ← state JSON, only when explicitly provided
        │       └─ omitted state → WASM receives no state and renders with {}
        │
        ▼
  wasm.render_entry_with_templates(entry, JSON.stringify(templatesMap), state?, strategy)
        ▼
  fs.writeFileSync(output, rendered)
```

---

## Module map

| File | Role |
|------|------|
| `bin/fast.js` | CLI entry point — argument parsing, config file loading, file I/O, template scanning, WASM dispatch |
| `wasm/microsoft_fast_build.js` | WASM-generated JS bindings for the Rust renderer |
| `wasm/microsoft_fast_build_bg.wasm` | Compiled Rust renderer binary |

---

## Configuration file — `loadConfig`

The CLI supports an optional JSON configuration file that provides default values for all build options. This avoids repeating long argument lists in scripts and CI pipelines.

### Resolution order

1. If `--config=<path>` is provided, that file is loaded. An error is raised if the file does not exist.
2. If `--config` is not provided, `fast-build.config.json` in the current working directory is loaded if it exists. If it does not exist, no config is applied (silent fallback).

### Merge semantics

CLI arguments always take precedence over config file values. The merge uses **presence-based** checking (`hasOwnProperty`), not truthiness, so an explicit `--entry=` on the command line will override a config file's `entry` value even if the CLI value is an empty string.

When a value is not provided by either source, built-in defaults apply (`index.html`, `output.html`). State is optional: if neither CLI nor config provides `state`, the CLI does not look for a state file and calls WASM without a state value, which renders as `{}`. This is a breaking change from earlier CLI behavior that implicitly loaded `state.json` from the current working directory when present.

### Path resolution

File paths read from the config file (`entry`, `state`, `output`, `templates`) are resolved relative to the **config file's directory**, not the current working directory. This ensures configs work correctly regardless of where the CLI is invoked from.

CLI-provided paths are resolved relative to the current working directory (the default Node.js behaviour).

### Validation

The config file must be a JSON object. Each key must be one of the allowed option names (`entry`, `state`, `output`, `templates`, `attribute-name-strategy`) and each value must be a string. Unknown keys and non-string values produce an error referencing the config file path.

### Helpers

| Function | Role |
|----------|------|
| `loadConfig(configPath)` | Reads, parses, and validates the config file. Returns `{ config, configDir }`. |
| `resolveOption(args, config, configDir, key, defaultValue)` | Returns the CLI arg if present, otherwise the config value (with path resolution), otherwise the default. The caller separately tracks whether `state` was explicitly provided so an explicit missing state file errors while omitted state is passed through to WASM as `{}`. |

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
- Any `shadowroot`-prefixed attributes on `<f-template>` become `shadowrootAttributes` metadata that the WASM renderer applies to the emitted Declarative Shadow DOM `<template>`.
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

Four WASM functions are available; the CLI uses the entry renderer when templates are loaded:

| Function | Used when |
|----------|-----------|
| `wasm.render(entry, state?)` | No custom element templates. Omitted state renders as `{}`. |
| `wasm.render_with_templates(entry, templatesJson, state?, strategy)` | JS consumers that need non-entry template rendering with custom elements. Omitted state renders as `{}`. `strategy` is `"camelCase"` or `"none"`. |
| `wasm.render_entry_with_templates(entry, templatesJson, state?, strategy)` | CLI entry HTML rendering when at least one template was loaded. Omitted state renders as `{}`. `strategy` is `"camelCase"` or `"none"`. |
| `wasm.parse_f_templates(html)` | Parsing `<f-template>` elements from each matched HTML file |

`templatesJson` is a JSON-stringified object mapping element names to template metadata objects. Each object contains the raw inner template string extracted from `<template>` inside `<f-template>` and any forwarded `shadowrootAttributes`. The WASM renderer uses this map to resolve custom element tags and inject Declarative Shadow DOM, defaulting to `shadowrootmode="open" shadowroot="open"` when no `shadowrootmode` metadata is present and mirroring `shadowrootmode` to the legacy `shadowroot` attribute when `shadowroot` is not explicitly supplied.

See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for details on the Rust rendering pipeline.

---

## Error handling

| Condition | Behaviour |
|-----------|-----------|
| `--config` file not found (explicit) | Print error to stderr; exit code 1 |
| Default `fast-build.config.json` not found | Silent; no config applied |
| Config file is invalid JSON | Print error to stderr; exit code 1 |
| Config file is not a JSON object | Print error to stderr; exit code 1 |
| Config file has unknown key | Print error to stderr; exit code 1 |
| Config file has non-string value | Print error to stderr; exit code 1 |
| `--entry` file not found | Print error to stderr; exit code 1 |
| Explicit `--state` or config `state` file not found | Print error to stderr; exit code 1 |
| State omitted | Do not check `state.json`; render with an empty state object (`{}`); breaking change from earlier implicit `state.json` loading |
| `--templates` not provided | Warning to stderr; rendering continues without custom elements |
| `--attribute-name-strategy` invalid value | Print error to stderr; exit code 1 |
| Pattern matches no files | Warning to stderr; pattern is skipped |
| `<f-template>` without `name` | Warning to stderr; template is skipped |
| Duplicate template name across files | Warning to stderr; later entry overwrites earlier |
| WASM render error | Print error to stderr; exit code 1 |
