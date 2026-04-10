# WebUI Todo App

A Todo app demonstrating FAST declarative HTML templates with [webui](https://github.com/microsoft/webui) prerendering and hydration.

This example shows how to combine `@microsoft/fast-html` declarative templates with `@microsoft/webui` for server-side prerendering, producing a fast initial render that hydrates into a fully interactive FAST web component application.

## Features

- **Declarative templates**: Uses `.html` and `.css` files instead of imperative `html`/`css` tagged template literals
- **Server-side prerendering**: `webui serve` compiles declarative templates and renders initial state into static HTML
- **Client-side hydration**: `@microsoft/fast-html` picks up prerendered DOM and attaches FAST reactive bindings
- **Todo functionality**: Add items, toggle completion, delete items, remaining count

## Prerequisites

From the monorepo root, install dependencies and build packages:

```bash
npm ci
npm run build
```

## Running

```bash
# Build client bundle and start the webui dev server
npm start -w examples/webui-todo-app
```

The app will be available at `http://localhost:8081`.

For development with live reloading, run the client and server in separate terminals:

```bash
# Terminal 1: Watch and rebuild client bundle
npm run start:client -w examples/webui-todo-app

# Terminal 2: Start webui dev server with --watch
npm run start:server -w examples/webui-todo-app
```

## Architecture

### Server-side (`webui serve`)

The `webui` CLI serves the app with the `--plugin=fast` flag, which enables FAST-aware template processing:

1. Scans `./src` for declarative HTML templates (`.html` files wrapped in `<f-template>` or containing `<template shadowrootmode="open">`)
2. Reads initial state from `./data/state.json`
3. Renders templates server-side with `{{}}` bindings resolved from state
4. Injects Declarative Shadow DOM for instant first paint
5. Serves the bundled client JS from `./dist`

### Templates (`src/todo-app/`, `src/todo-item/`)

Each component uses co-located files:

- `*.html` — Declarative template with `<template shadowrootmode="open">` and FAST bindings
- `*.css` — Scoped styles loaded via `<link rel="stylesheet">` in the shadow DOM
- `*.ts` — Component class using `RenderableFASTElement` mixin with `defineAsync`

### Client entry (`src/index.ts`)

Bootstraps hydration by:

1. Importing components (side-effect registration via `defineAsync`)
2. Configuring `TemplateElement` with observer maps for reactive attribute tracking
3. Defining `<f-template>` to trigger hydration of prerendered shadow DOM

### Binding syntax

| Syntax | Scope | Example |
|---|---|---|
| `{{expr}}` | Server + client | `{{title}}` — HTML-escaped value |
| `{{{expr}}}` | Server + client | Raw unescaped HTML |
| `{expr}` | Client-only | `{onClick(e)}` — event handlers, refs |
| `@event="{handler}"` | Client-only | `@click="{onAddClick()}"` |
| `f-ref="{prop}"` | Client-only | `f-ref="{addInput}"` — element reference |

### Template directives

| Directive | Purpose | Example |
|---|---|---|
| `<for each="item in items">` | Iteration | `<for each="item in items"><todo-item>...</todo-item></for>` |
| `<if condition="expr">` | Conditional | `<if condition="state == 'done'">...</if>` |
