# Design — @microsoft/fast-build

This document describes the internal architecture of the `@microsoft/fast-build` package.

---

## High-level overview

`@microsoft/fast-build` is a Node.js CLI tool that server-side renders FAST declarative HTML templates and converts FAST declarative template files to other supported syntaxes. It delegates template rendering to a WebAssembly module compiled from the [`microsoft-fast-build`](../../crates/microsoft-fast-build) Rust crate and conversion to the `microsoft-fast-convert` WASM module generated under `wasm/convert/`. The Node.js layer is responsible only for:

1. Dispatching `fast build` and `fast convert`
2. Parsing CLI arguments and loading configuration
3. Locating and parsing template HTML files (glob scanning + `<f-template>` extraction)
4. Loading the entry HTML file and optional state JSON file
5. Calling the WASM renderer in HTML or stream mode
6. Validating converter paths and calling the converter WASM
7. Writing the rendered or converted output file, or raw stream chunks to stdout

```
fast build [options]
        │
        ▼
  parseArgs(argv)        ← --entry, --state, --output, --templates, --attribute-name-strategy, --config, --stream
        │
        ├─ loadConfig(configPath)             ← load fast-build.config.json
        │       │
        │       ├─ explicit --config path     ← error if file missing
        │       └─ default CWD lookup         ← silent fallback if missing
        │
        ├─ resolveOption(args, config, …)     ← CLI args override config values
        ├─ resolveBooleanOption(args, config, "stream")
        │
        ├─ wasm = require(BUILD_WASM_MODULE)   ← load WASM first
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
  stream?
     ├─ false
     │    ├─ templates loaded → wasm.render_entry_with_templates(entry, JSON.stringify(templatesMap), state?, strategy)
     │    └─ no templates     → wasm.render(entry, state?)
     │              ▼
     │        fs.writeFileSync(output, rendered)
     └─ true  → wasm.render_entry_with_templates(entry, JSON.stringify(templatesMap), state?, strategy, true)
                    ▼
              JSON.parse(chunksJson) → process.stdout.write(chunk)
```

`fast convert` uses the same CLI/config merge pattern but loads `fast-convert.config.json` by default:

```
fast convert [options]
        │
        ▼
  parseArgs(argv)        ← --syntax, --template, --output, --overwrite, --config
        │
        ├─ loadConfig(configPath)             ← load fast-convert.config.json
        ├─ resolveOption(args, config, …)     ← CLI args override config values
        ├─ resolvePresenceBooleanOption(args, config, "overwrite")
        ├─ validate syntax/template/output paths and extensions
        ├─ wasm = require(CONVERT_WASM_MODULE) ← load wasm/convert/microsoft_fast_convert.js
        ├─ wasm.convert_template(templateHtml, syntax)
        ▼
  fs.writeFileSync(output, converted)
```

---

## Module map

| File | Role |
|------|------|
| `bin/fast.js` | CLI entry point — argument parsing, config file loading, file I/O, template scanning, WASM dispatch |
| `build-wasm.cjs` | Package build helper that builds the renderer WASM and converter WASM into `wasm/convert/` |
| `wasm/microsoft_fast_build.js` | WASM-generated JS bindings for the Rust renderer |
| `wasm/microsoft_fast_build_bg.wasm` | Compiled Rust renderer binary |
| `wasm/convert/microsoft_fast_convert.js` | WASM-generated JS bindings for the Rust converter |
| `wasm/convert/microsoft_fast_convert_bg.wasm` | Compiled Rust converter binary |

---

## Configuration file — `loadConfig`

The CLI supports optional JSON configuration files that provide default values for command options. `fast build` loads `fast-build.config.json` by default. `fast convert` loads `fast-convert.config.json` by default. This avoids repeating long argument lists in scripts and CI pipelines.

### Resolution order

1. If `--config=<path>` is provided, that file is loaded. An error is raised if the file does not exist.
2. If `--config` is not provided, the command-specific default config in the current working directory is loaded if it exists. If it does not exist, no config is applied (silent fallback).

### Merge semantics

CLI arguments always take precedence over config file values. The merge uses **presence-based** checking (`hasOwnProperty`), not truthiness, so an explicit `--entry=` on the command line will override a config file's `entry` value even if the CLI value is an empty string.

When a value is not provided by either source, built-in defaults apply (`index.html`, `output.html`). State is optional: if neither CLI nor config provides `state`, the CLI does not look for a state file and calls WASM without a state value, which renders as `{}`. This is a breaking change from earlier CLI behavior that implicitly loaded `state.json` from the current working directory when present.

### Path resolution

File paths read from the config file (`entry`, `state`, `output`, `templates`, and converter `template`) are resolved relative to the **config file's directory**, not the current working directory. This ensures configs work correctly regardless of where the CLI is invoked from.

CLI-provided paths are resolved relative to the current working directory (the default Node.js behaviour).

### Validation

The config file must be a JSON object. Build config keys must be one of `entry`, `state`, `output`, `templates`, `attribute-name-strategy`, or `stream`; `stream` must be a JSON boolean and other values must be strings. Convert config keys must be one of `syntax`, `template`, `output`, or `overwrite`; `overwrite` must be a JSON boolean and other values must be strings. Unknown keys and invalid value types produce an error referencing the config file path.

### Helpers

| Function | Role |
|----------|------|
| `loadConfig(configPath)` | Reads, parses, and validates the config file. Returns `{ config, configDir }`. |
| `resolveOption(args, config, configDir, key, defaultValue)` | Returns the CLI arg if present, otherwise the config value (with path resolution), otherwise the default. The caller separately tracks whether `state` was explicitly provided so an explicit missing state file errors while omitted state is passed through to WASM as `{}`. |
| `resolveBooleanOption(args, config, key)` | Resolves boolean options such as `stream`, with CLI values taking precedence over config booleans. |
| `resolvePresenceBooleanOption(args, config, key)` | Resolves presence-only booleans such as converter `overwrite`, where CLI presence always means `true`. |

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
- Any attributes declared on the inner `<template>` element become `hostAttributes` metadata (parallel to `shadowrootAttributes`). The WASM renderer merges these onto the rendered host element opening tag, with author host attributes winning on conflicts. See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for the full propagation rules (client-only attrs are skipped, `{{expr}}` / `?name="{{expr}}"` are resolved against the element's child state, etc.).
- A file may contain multiple `<f-template>` elements (each becomes a separate entry).
- If an `<f-template>` has no `name` attribute, a warning is printed to stderr and it is skipped.
- The Rust parser follows browser tag boundaries for the `<f-template>` and inner `<template>` wrappers, including ASCII whitespace before `>` in opening and closing tags.

### Helpers

| Function | Role |
|----------|------|
| `parseFTemplates(html, filePath, wasm)` | Calls `wasm.parse_f_templates(html)` and emits warnings for nameless templates. Returns `{name, content, shadowrootAttributes, hostAttributes}` entries. |

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

## Converter output rules

`fast convert` accepts a required source `template` and required target `syntax`.
The source template path must exist, be a file, and use `.html`.

| Syntax | Output extension | Default suffix |
|--------|------------------|----------------|
| `webui-prerelease` | `.html` | `.webui.html` |
| `fast-v3-ts` | `.ts` | `.template.ts` |

When `output` is omitted, the CLI writes next to the input template using the
default suffix. When `output` is provided, every `*` is replaced with the input
basename without its `.html` extension. CLI-provided `template`/`output` paths
use normal current-working-directory resolution; config-provided paths are
resolved relative to the config file before the default suffix or `*`
replacement is applied.

Before loading converter WASM, the CLI validates that:

- The selected syntax is supported.
- The output extension matches the selected syntax.
- The output path is not a directory.
- The output parent directory exists and is a directory.
- An existing output file is only replaced when `--overwrite` is present or
  config contains `"overwrite": true`.

The converter WASM contract is `convert_template(template: string, syntax:
string): string` plus `convert_syntax_metadata(): string`. Rust owns FAST
declarative syntax validation, conversion semantics, accepted syntax names, output
extensions, and default suffixes. The JavaScript layer reads syntax metadata from
WASM and only handles CLI/config merging, path rules, and file I/O.

---

## Converter fixture validation

Converter fixture inputs live under `test/fixtures/convert/`. Each fixture
directory includes a committed `fast-convert.config.json`, and the fixture tests
run `fast convert` from those directories without `--config` to verify default
config discovery. The fixture configs write generated output to
`test/.fixture-output/`, which is created and removed by the fixture test so
converted `.html` and `.ts` outputs are not checked in. The
`test:fixtures:convert` package script runs the fixture-only validation, and
`test:node` includes it so CI validates both `webui-prerelease` and
`fast-v3-ts` through the real `fast convert` CLI.

---

## WASM integration

The build WASM module exposes four functions; the CLI uses the entry renderer when templates are loaded or streaming is requested:

| Function | Used when |
|----------|-----------|
| `wasm.render(entry, state?)` | No custom element templates. Omitted state renders as `{}`. |
| `wasm.render_with_templates(entry, templatesJson, state?, strategy)` | JS consumers that need non-entry template rendering with custom elements. Omitted state renders as `{}`. `strategy` is `"camelCase"` or `"none"`. |
| `wasm.render_entry_with_templates(entry, templatesJson, state?, strategy, stream?)` | CLI entry HTML rendering when at least one template was loaded, and CLI `--stream` rendering when `stream` is `true`. Omitted state renders as `{}`. `strategy` is `"camelCase"` or `"none"`. With `stream: true`, returns a JSON array string of raw HTML chunks. |
| `wasm.parse_f_templates(html)` | Parsing `<f-template>` elements from each matched HTML file |

`templatesJson` is a JSON-stringified object mapping element names to template metadata objects. Each object contains the raw inner template string extracted from `<template>` inside `<f-template>`, any forwarded `shadowrootAttributes`, and a `hostAttributes` array carrying the attributes declared on the inner `<template>` element. The WASM renderer uses this map to resolve custom element tags and inject Declarative Shadow DOM, copying `shadowroot*` attributes to the emitted `<template>` and merging `hostAttributes` onto the rendered host element opening tag (author host attributes win on conflicts; client-only attrs and `{{expr}}` / `?name="{{expr}}"` bindings are handled by the WASM renderer — see the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for details). It normalizes `shadowrootmode` and legacy `shadowroot` for compatibility: when neither has a non-empty value, it emits `shadowrootmode="open" shadowroot="open"`; when exactly one has a non-empty value, that value is mirrored to the other; when both have explicit non-empty values, both are preserved as authored, even if they conflict.

See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for details on the Rust rendering pipeline.

The converter WASM module is loaded from
`wasm/convert/microsoft_fast_convert.js` and must export
`convert_template(template, syntax)`. It receives the source `.html` template
contents and the selected syntax (`webui-prerelease` or `fast-v3-ts`) and returns
the converted file contents, throwing on conversion or validation errors.

---

## Stream output

`--stream`, `--stream=true`, and `--stream=false` are parsed as CLI boolean
forms. `fast-build.config.json` also accepts `"stream": true` or
`"stream": false`. CLI arguments take precedence, so `--stream=false` disables
streaming even when the config enables it.

When streaming is enabled, the CLI always calls
`wasm.render_entry_with_templates(..., true)`, passing `{}` for `templatesJson`
when no templates were loaded. With `stream` set to `true`, the WASM export
returns a JSON array string. The CLI validates that the parsed value is an array
of strings and writes each chunk to stdout without separators.

Streaming mode does not write `--output`, does not print `Built: ...`, and does
not warn when `--templates` is omitted. Non-streaming output remains unchanged.
Chunk construction happens in Rust before the WASM call returns, so this is
simulated streaming rather than a lazy Node.js `ReadableStream`.

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
| `--templates` not provided | Warning to stderr in non-streaming mode; rendering continues without custom elements |
| `--attribute-name-strategy` invalid value | Print error to stderr; exit code 1 |
| `--stream` value is not `true`, `false`, or empty | Print error to stderr; exit code 1 |
| Convert `--syntax` omitted or unsupported | Print error with supported syntaxes to stderr; exit code 1 |
| Convert `--template` omitted | Print error to stderr; exit code 1 |
| Convert template missing, not a file, or not `.html` | Print error to stderr; exit code 1 |
| Convert output extension does not match syntax | Print error to stderr; exit code 1 |
| Convert output parent directory missing or not a directory | Print error to stderr; exit code 1 |
| Convert output path is a directory | Print error to stderr; exit code 1 |
| Convert output exists without overwrite | Print error to stderr; exit code 1 |
| Converter WASM export missing | Print error to stderr; exit code 1 |
| Converter WASM throws | Print error to stderr; exit code 1 |
| Pattern matches no files | Warning to stderr; pattern is skipped |
| `<f-template>` without `name` | Warning to stderr; template is skipped |
| Duplicate template name across files | Warning to stderr; later entry overwrites earlier |
| Streaming WASM export missing | Print error to stderr; exit code 1 |
| Streaming WASM return is not a JSON string array | Print error to stderr; exit code 1 |
| WASM render error | Print error to stderr; exit code 1 |
