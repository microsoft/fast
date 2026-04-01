# `@microsoft/fast-build`

Server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates, powered by a WebAssembly core with zero runtime npm dependencies.

## Installation

```sh
npm install @microsoft/fast-build
```

## CLI usage

Once installed, the `fast` binary is available. Use the `build` subcommand to render an HTML template with a JSON state file:

```sh
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

```sh
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

```sh
fast build \
  --templates="./components/**/*.html" \
  --entry=index.html \
  --state=state.json \
  --output=output.html
```

Each matched `.html` file is registered as a custom element template using its filename stem as the element name (e.g. `my-button.html` → `<my-button>`).

## Template syntax

Template syntax follows the FAST declarative HTML format. See the [`@microsoft/fast-html` README](../fast-html/README.md) for full documentation on bindings, conditionals, repeats, and directives.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
