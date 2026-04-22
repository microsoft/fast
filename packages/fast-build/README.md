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

Once installed, the `fast` binary is available. Use the `build` subcommand to render an HTML template with a JSON state file:

```shell
fast build [options]
```

### Options

| Option | Default | Description |
|---|---|---|
| `--entry="<path>"` | `index.html` | Entry HTML template to render |
| `--state="<path>"` | `state.json` | JSON file containing the template state |
| `--output="<path>"` | `output.html` | Where to write the rendered HTML |
| `--templates="<glob>"` | _(none)_ | Glob pattern(s) for custom element template HTML files. Separate multiple patterns with commas. A warning is printed if not provided or if no files match a pattern. |
| `--attribute-name-strategy="<strategy>"` | `camelCase` | Strategy for mapping HTML attribute names to state property names on custom elements. `"camelCase"` converts dashes to camelCase (e.g. `foo-bar` → `fooBar`). `"none"` preserves dashes (e.g. `foo-bar` → `foo-bar`). See [Attribute name strategy](#attribute-name-strategy). |
| `--config="<path>"` | `fast-build.config.json` | Path to a JSON configuration file. If omitted, `fast-build.config.json` in the current directory is used when present. CLI arguments take precedence over config values. See [Configuration file](#configuration-file). |

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

If an `<f-template>` element has no `name` attribute, a warning is printed and it is ignored. Exact file paths (no wildcards) are also accepted as patterns, making it possible to register a single template file.

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

All keys are optional. Only the following keys are allowed: `entry`, `state`, `output`, `templates`, `attribute-name-strategy`. Unknown keys or non-string values produce an error.

## Template syntax

Template syntax follows the FAST declarative HTML format. See the [`@microsoft/fast-html` README](../fast-html/README.md) for full documentation on bindings, conditionals, repeats, and directives.
