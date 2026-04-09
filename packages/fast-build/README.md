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

## Template syntax

Template syntax follows the FAST declarative HTML format. See the [`@microsoft/fast-html` README](../fast-html/README.md) for full documentation on bindings, conditionals, repeats, and directives.
