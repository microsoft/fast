# FAST Build

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-build.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-build)

The `fast-build` package renders the declarative HTML template syntax of [`@microsoft/fast-element`](https://www.npmjs.com/package/@microsoft/fast-element), primarily for use in testing environments. It is powered by a WebAssembly core with zero runtime npm dependencies.

> **Note:** For production server-side rendering, we recommend using the [`@microsoft/webui`](https://github.com/microsoft/webui) project instead.

## Installation

### From NPM

To install the latest `@microsoft/fast-build` package using `npm`:

```shell
npm install --save @microsoft/fast-build
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { render } from '@microsoft/fast-build';
```

## CLI usage

Once installed, the `fast` binary is available. Use the `build` subcommand to render an HTML template with an optional JSON state file, or `convert` to convert a FAST declarative HTML template to another supported syntax:

```shell
fast build [options]
fast convert [options]
```

### Build options

| Option | Default | Description |
|---|---|---|
| `--entry="<path>"` | `index.html` | Entry HTML template to render |
| `--state="<path>"` | `{}` when omitted | JSON file containing the template state. If omitted, no state file is loaded and rendering uses an empty state object. If `--state` is provided, the file must exist. |
| `--output="<path>"` | `output.html` | Where to write the rendered HTML |
| `--templates="<glob>"` | _(none)_ | Glob pattern(s) for custom element template HTML files. Separate multiple patterns with commas. A warning is printed if not provided in non-streaming mode or if no files match a pattern. |
| `--attribute-name-strategy="<strategy>"` | `camelCase` | Strategy for mapping HTML attribute names to state property names on custom elements. `"camelCase"` converts dashes to camelCase (e.g. `foo-bar` → `fooBar`). `"none"` preserves dashes (e.g. `foo-bar` → `foo-bar`). See [Attribute name strategy](#attribute-name-strategy). |
| `--config="<path>"` | `fast-build.config.json` | Path to a JSON configuration file. If omitted, `fast-build.config.json` in the current directory is used when present. CLI arguments take precedence over config values. See [Configuration file](#configuration-file). |
| `--stream[=true/false]` | `false` | Write rendered HTML chunks directly to stdout instead of writing `--output`. Valueless `--stream` is treated as `true`. |

### Example

Given an `index.html`:

```html
<html>
  <body>
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </body>
</html>
```

And a `state.json`:

```json
{
  "title": "Hello FAST",
  "description": "Server-side rendered with WebAssembly."
}
```

Run:

```shell
fast build --entry=index.html --state=state.json --output=output.html
```

Produces `output.html`:

```html
<html>
  <body>
    <h1>Hello FAST</h1>
    <p>Server-side rendered with WebAssembly.</p>
  </body>
</html>
```

### Streaming output

Pass `--stream`, `--stream=true`, or `--stream=false`, or set
`"stream": true` in `fast-build.config.json`, to control stdout streaming. When
streaming is enabled, the CLI writes raw rendered HTML chunks to stdout, does
not write the `--output` file, and does not print the normal `Built: ...`
message.

```shell
fast build --entry=index.html --state=state.json --stream
```

Streaming is simulated by the WebAssembly renderer: chunks are prepared in
memory, returned to JavaScript as a JSON array, parsed by the CLI, and then
written to stdout. `--stream` uses the same entry renderer with its stream flag
enabled and passes an empty templates map when no `--templates` glob is
provided. Chunk boundaries are safe for HTML parsing:

- Attribute bindings stay within complete opening tag chunks.
- Custom element opening chunks include the complete Declarative Shadow DOM
  template.
- Streamed output uses the same renderer preprocessing and custom-element host
  attribute propagation as normal output.
- Empty chunks are omitted.
- Concatenating all chunks matches the normal non-streamed render.

### Missing or omitted state

State is optional. When `--state` is omitted and no `state` path is provided by config, `fast build` does not look for `state.json`; rendering uses an empty object (`{}`). An explicit `--state` path, or a `state` path from config, must exist or the command exits with an error.

> **Breaking change:** Earlier versions implicitly loaded `state.json` from the current working directory when `--state` was omitted. To use a state file, pass `--state=state.json` or set `"state": "state.json"` in `fast-build.config.json`.

When a binding value is not present in state:

- Content bindings render nothing, including unresolved dot paths: `<p>{{foo.bar}}</p>` becomes `<p></p>`.
- Attribute bindings omit the entire attribute, including unresolved dot paths: `<div class="{{foo.bar}}"></div>` becomes `<div></div>`.
- `<f-repeat>` treats a missing list binding, including unresolved dot paths, as an empty array and renders zero iterations. If the binding is present but is not an array, rendering still errors.

### Custom element templates

Pass a glob pattern (or comma-separated list of patterns) to `--templates` to expand custom elements into [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom):

```shell
fast build \
  --templates="./components/**/*.html" \
  --entry=index.html \
  --state=state.json \
  --output=output.html
```

Each matched `.html` file is scanned for `<f-template>` elements. The `name` attribute of each `<f-template>` determines the custom element name. A single file may contain multiple templates.

Template files must use the following format:

```html
<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>
```

If an `<f-template>` element has no `name` attribute, a warning is printed and it is ignored. Exact file paths (no wildcards) are also accepted as patterns, making it possible to register a single template file. The parser follows browser tag boundaries for the `<f-template>` and inner `<template>` wrappers, including ASCII whitespace before `>` in opening and closing tags.

Any `shadowroot*` attributes on `<f-template>` are forwarded to the rendered Declarative Shadow DOM `<template>`. The CLI normalizes `shadowrootmode` and legacy `shadowroot` for compatibility: when neither has a non-empty value, it emits `shadowrootmode="open" shadowroot="open"`; when exactly one has a non-empty value, that value is mirrored to the other; when both have explicit non-empty values, both are preserved as authored, even if they conflict.

### Attribute name strategy

The `--attribute-name-strategy` option controls how HTML attribute names on custom elements are mapped to state property names in their shadow templates.

| Strategy | Behaviour | Template binding |
|---|---|---|
| `camelCase` (default) | Dashed attribute names converted to camelCase | `foo-bar` → `{{fooBar}}` |
| `none` | Attribute names lowercased as-is, dashes preserved | `foo-bar` → `{{foo-bar}}` |

The `camelCase` strategy only affects "plain" custom element attributes. It does **not** change:
- `data-*` attributes (always use `dataset.*` grouping)
- `aria-*` attributes (always use ARIA reflection lookup)
- HTML global attributes with known property names (e.g. `tabindex` → `tabIndex`)

```shell
fast build \
  --templates="./components/**/*.html" \
  --attribute-name-strategy=camelCase \
  --entry=index.html \
  --state=state.json \
  --output=output.html
```

### Configuration file

Instead of passing every option on the command line, you can place a `fast-build.config.json` file alongside your project files:

```json
{
    "entry": "index.html",
    "state": "state.json",
    "output": "output.html",
    "templates": "./components/**/*.html"
}
```

The CLI automatically loads `fast-build.config.json` from the current directory when it exists. To use a different file, pass `--config`:

```shell
fast build --config=configs/my-build.json
```

**Precedence:** CLI arguments always override config file values. For example, `--output=other.html` will override the `output` value in the config file.

**Path resolution:** File paths in the config file (`entry`, `state`, `output`, `templates`) are resolved relative to the config file's directory, not the current working directory. This ensures the config works correctly regardless of where the CLI is invoked.

All keys are optional. Only the following keys are allowed: `entry`, `state`, `output`, `templates`, `attribute-name-strategy`, and `stream`. Unknown keys produce an error. Values must be strings except `stream`, which must be a JSON boolean (`true` or `false`). If `state` is omitted, rendering uses `{}`; if `state` is present, the referenced file must exist. CLI arguments always override config values, including `--stream=false` overriding `"stream": true`.

## Convert

`fast convert` converts one FAST declarative template file at a time using the converter WASM module in `wasm/convert/`.

```shell
fast convert --syntax=webui-prerelease --template=example.html
fast convert --syntax=fast-v3-ts --template=example.html --output=../*.template.ts
```

### Convert options

| Option | Default | Description |
|---|---|---|
| `--syntax="<syntax>"` | _(required)_ | Target syntax: `webui-prerelease` or `fast-v3-ts` |
| `--template="<path>"` | _(required)_ | Source FAST declarative template. The file must use the `.html` extension. |
| `--output="<path>"` | Next to `--template` | Output file path. `webui-prerelease` defaults to `*.webui.html`; `fast-v3-ts` defaults to `*.template.ts`. Any `*` in the output path is replaced with the input basename without extension. |
| `--overwrite` | `false` | Allow replacing an existing output file. CLI presence always means `true`. |
| `--config="<path>"` | `fast-convert.config.json` | Path to a JSON configuration file. If omitted, `fast-convert.config.json` in the current directory is used when present. CLI arguments take precedence over config values. |

The source template must be `.html`. The output extension must match the selected syntax: `.html` for `webui-prerelease` and `.ts` for `fast-v3-ts`. The output parent directory must already exist, and an existing output file is rejected unless `--overwrite` or `"overwrite": true` is used.

### Convert configuration file

`fast-convert.config.json` follows the same precedence and path-resolution rules as `fast-build.config.json`: CLI arguments override config values, and `template`/`output` paths from config are resolved relative to the config file directory.

```json
{
    "syntax": "fast-v3-ts",
    "template": "src/example.html",
    "output": "generated/*.template.ts",
    "overwrite": false
}
```

Only `syntax`, `template`, `output`, and `overwrite` are allowed. Values must be strings except `overwrite`, which must be a JSON boolean.

## Template syntax

Template syntax follows the FAST declarative HTML format. See the
[`@microsoft/fast-element` declarative documentation](../fast-element/docs/declarative/syntax.md)
for full documentation on bindings, conditionals, repeats, and directives.
