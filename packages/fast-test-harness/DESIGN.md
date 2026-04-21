# Design — @microsoft/fast-test-harness

This document describes the internal architecture of the `@microsoft/fast-test-harness` package — a Playwright testing harness for FAST Element web components with CSR and SSR support.

---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Module Map](#module-map)
3. [Fixture System](#fixture-system)
   - [FixtureOptions](#fixtureoptions)
   - [CSRFixture](#csrfixture)
   - [SSRFixture](#ssrfixture)
4. [Custom Assertions](#custom-assertions)
5. [Server](#server)
   - [CSR Request Flow](#csr-request-flow)
   - [SSR Request Flow](#ssr-request-flow)
   - [Caching and Deduplication](#caching-and-deduplication)
6. [SSR Rendering Utilities](#ssr-rendering-utilities)
   - [renderFixture](#renderfixture)
   - [renderTemplate](#rendertemplate)
   - [processDsdTemplate](#processdstemplate)
   - [injectChildTemplates](#injectchildtemplates)
   - [renderPreloadLinks](#renderpreloadlinks)
7. [Asset Resolution](#asset-resolution)
8. [Configuration Files](#configuration-files)
   - [Playwright Configuration](#playwright-configuration)
   - [Vite Configuration](#vite-configuration)
9. [Exports](#exports)

---

## High-Level Overview

`@microsoft/fast-test-harness` provides a turnkey Playwright testing setup for FAST web components. It extends Playwright's `test` and `expect` with a `fastPage` fixture that manages page setup, template injection, and element stability checks. The harness supports two rendering modes:

- **CSR (Client-Side Rendering)** — navigates to a Vite-served `index.html`, then injects component HTML into the page body via `page.evaluate`.
- **SSR (Server-Side Rendering)** — posts template configuration to a `/generate-fixture` endpoint, which uses Vite's SSR module loading to render a complete HTML page with Declarative Shadow DOM, then navigates to the generated page.

The mode is selected per test via `test.use({ ssr: true })` or globally via the `PLAYWRIGHT_TEST_SSR=true` environment variable.

```
test("renders element", async ({ fastPage }) => {
    await fastPage.setTemplate({ attributes: { label: "Hello" } });
    await expect(fastPage.element).toBeVisible();
});
        │
        ├── CSR path ──────────────────────────────────────────┐
        │   page.goto("/")                                     │
        │   page.evaluate() → inject HTML into <body>          │
        │   waitForCustomElement() + waitForStability()        │
        │                                                      │
        └── SSR path ──────────────────────────────────────────┐
            POST /generate-fixture { tagName, attributes, … } │
            server: vite.ssrLoadModule("entry-server.js")      │
            server: render(queryObj) → { template, fixture }   │
            server: inject into ssr.html → write to temp/      │
            page.goto("/ssr-<testId>.html")                    │
            waitForStability()                                 │
```

---

## Module Map

| File | Role |
|------|------|
| `src/index.ts` | Package barrel — re-exports fixtures, assertions, and SSR utilities |
| `src/fixtures/index.ts` | Extends Playwright's `test` with `fastPage` fixture and `expect` with custom assertions |
| `src/fixtures/csr-fixture.ts` | `CSRFixture` class — client-side rendering fixture |
| `src/fixtures/ssr-fixture.ts` | `SSRFixture` class — server-side rendering fixture (extends `CSRFixture`) |
| `src/fixtures/assertions.ts` | Custom Playwright assertion `toHaveCustomState` |
| `src/ssr/render.ts` | SSR rendering helpers: `renderFixture`, `renderTemplate`, `renderPreloadLinks` |
| `src/ssr/assets.ts` | Asset resolution helpers: `readAsset`, `resolveAssetUrl` |
| `src/ssr/entry-client.ts` | SSR hydration entry point — defines `<f-template>` for the browser |
| `server.mjs` | Express + Vite dev server — serves CSR pages and handles SSR fixture generation |
| `start.mjs` | CLI entry point (`fast-test-harness` bin) — calls `startServer()` |
| `playwright.config.ts` | Shared Playwright configuration (browsers, web server, test matching) |
| `vite.config.mjs` | Shared Vite configuration (port, resolve conditions, build settings) |
| `public/styles.css` | Base CSS reset served as a Vite public asset |

---

## Fixture System

### FixtureOptions

The `test.extend` call in `src/fixtures/index.ts` adds four configurable options to every test:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tagName` | `string` | `""` | Custom element tag name used to build the default template and locate the element |
| `innerHTML` | `string` | `""` | Default inner HTML inserted into the element |
| `waitFor` | `string[]` | `[]` | Additional custom element tag names to wait for before the test runs |
| `ssr` | `boolean` | `false` (or `true` if `PLAYWRIGHT_TEST_SSR=true`) | Selects SSR mode |

These are configured per test suite with `test.use()`:

```ts
test.use({ tagName: "my-button", innerHTML: "Click me" });
```

The `fastPage` fixture factory reads these options and instantiates either `CSRFixture` or `SSRFixture`. For CSR, it also navigates to `/`, emulates reduced motion, and waits for custom element definitions before handing control to the test.

### CSRFixture

`CSRFixture` is the base class for interacting with a component on a Playwright page.

| Method | Description |
|--------|-------------|
| `goto(url)` | Navigates to a URL (defaults to `"/"`) |
| `setTemplate(templateOrOptions?)` | Injects HTML into `<body>`. Accepts a raw HTML string, an options object (`{ attributes, innerHTML }`), or no argument (uses defaults from `tagName`/`innerHTML`). Waits for stability after injection. |
| `updateTemplate(locator, options)` | Modifies attributes and/or innerHTML of an already-rendered element in place. Boolean `true` sets the attribute, `false` removes it, strings set the value. |
| `waitForCustomElement(...tagNames)` | Blocks until all specified elements are defined in `customElements` |
| `applyTokens(tokens)` | Sets CSS custom properties on `<body>` for design token theming |
| `addStyleTag(options)` | Delegates to `page.addStyleTag()` |

**Template generation** (`defaultTemplate`): When `setTemplate` receives an options object (or no argument), it builds an HTML string from the `tagName`, serialized attributes, and `innerHTML`. Boolean `true` attributes render as bare attributes (`disabled`), string values render as `key="value"`.

**Stability waiting** (`waitForStability`): After injecting HTML, the fixture waits for (1) all matching elements to be attached, (2) custom element definitions to be registered, and (3) the `<body>` to reach a "stable" state via Playwright's `waitForElementState("stable")`.

### SSRFixture

`SSRFixture` extends `CSRFixture` and overrides `setTemplate` and `addStyleTag` to work with server-side rendering.

| Override | Description |
|----------|-------------|
| `addStyleTag` | Buffers style options into `pendingStyles` until `setTemplate` is called. Only `{ content }` options are preserved — the content strings are serialized into the SSR generation request. Style options using `path` or `url` are not included in the SSR output. After `setTemplate`, calls pass through to the page directly. |
| `setTemplate` | Builds a request body from the template options, posts it to `/generate-fixture`, navigates to the returned URL, and waits for stability. |

**SSR request body construction**: The `setTemplate` override constructs a JSON body with these fields:

| Field | Source |
|-------|--------|
| `testId` | Derived from `testInfo.titlePath` — sanitized to `[a-z0-9_-]` |
| `testTitle` | Formatted from the test title path |
| `tagName` | From fixture options (when not using raw HTML) |
| `innerHTML` | From the template options or fixture default |
| `attributes` | JSON-stringified attribute map |
| `html` | Raw HTML string (when `templateOrOptions` is a string) |
| `styles` | JSON-stringified array of CSS content strings from buffered `addStyleTag` calls |

All string values are whitespace-collapsed before sending.

**Test title formatting** (`formatTestTitle`): Converts sanitized test IDs back into human-readable titles. If the ID matches the pattern `<filepath>-<sections>`, it splits sections by `-` and words by `_`, capitalizing each word, joining sections with ` › `, and appending the source file path in parentheses (e.g., `Section One › Section Two (path/to/file.ts)`). IDs that don't match the pattern are split on `_` and capitalized.

---

## Custom Assertions

The `toHaveCustomState` assertion checks whether an element matches the CSS `:state(<name>)` pseudo-class, which tests `ElementInternals` custom states:

```ts
await expect(element).toHaveCustomState("checked");
```

The assertion evaluates `el.matches(`:state(${state})`)` in the browser via `locator.evaluate` and returns a matcher result compatible with Playwright's `expect.extend` API. It supports `.not` negation.

> **Note:** This is a one-shot evaluation, not a polling/auto-retrying Playwright matcher. The `:state()` check runs once and returns the result immediately. If the state may be set asynchronously, wait for the expected condition before asserting.

---

## Server

The server (`server.mjs`) is an Express application with Vite running in middleware mode. It handles both CSR page serving and SSR fixture generation.

### Consumer-Owned SSR Contract

The harness does **not** contain the SSR entry files itself — they live in the consuming project's test directory. By default, `startServer` looks for files under `<cwd>/test/`:

| File | Owner | Purpose |
|------|-------|---------|
| `test/index.html` | Consumer | CSR entry page — loads the component registration script |
| `test/ssr.html` | Consumer | SSR template with comment placeholders (`<!--fixture-->`, `<!--templates-->`, etc.) |
| `test/src/entry-server.ts` | Consumer | Exports a `render(queryObj)` function that returns `{ template, fixture, preloadLinks }` |
| `test/src/entry-client.ts` | Consumer | Registers components for DSD hydration in the browser |
| `test/vite.config.ts` | Consumer | Vite configuration (can import the shared one from this package) |

The `startServer(cwd, root, configFile)` function accepts overrides for each path:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `cwd` | `process.cwd()` | Static file serving root |
| `root` | `<cwd>/test` | Vite root (contains `index.html`, `ssr.html`) |
| `configFile` | `<root>/vite.config.ts` | Vite config path |

### Startup

`startServer(cwd, root, configFile)` initializes:

1. A `temp/` directory under `root` for writing SSR fixture files (cleaned on startup)
2. A Vite dev server in middleware mode, configured to ignore the temp directory
3. Express middleware stack: Vite middleware → static file serving from `cwd` → route handlers

The server listens on port `5273` by default (configurable via `PORT` environment variable).

### CSR Request Flow

The catch-all `*all` handler serves the Vite-transformed `index.html` for navigation requests (those with `Accept: text/html`). The transformed HTML is cached after the first request. Non-HTML requests (module imports, assets) fall through to Vite's middleware.

```
Browser GET /
    → catch-all handler
    → fs.readFile("index.html")
    → vite.transformIndexHtml(url, html)
    → cache and respond with 200
```

### SSR Request Flow

The `/generate-fixture` POST endpoint handles SSR fixture generation:

```
Browser POST /generate-fixture { testId, tagName, attributes, … }
    → validate testId (required, alphanumeric + hyphens/underscores only)
    → parse attributes and styles from JSON strings
    → check pendingGenerations deduplication map
    → read ssr.html template
    → vite.transformIndexHtml() for module injection
    → vite.ssrLoadModule("/src/entry-server.js")
    → call render(body) → { template, fixture, preloadLinks }
    → replace placeholders in ssr.html:
        <!--fixturetitle--> → test title
        <!--templates-->    → f-template HTML
        <!--fixture-->      → rendered element HTML
        <!--stylespreload--> → preload links + inline styles
    → cache in fixtureCache Map
    → write to temp/ssr-<testId>.html (for debugging)
    → respond with { url: "/ssr-<testId>.html" }
```

A dedicated `GET /ssr-:id.html` handler serves cached fixtures directly from memory, bypassing the filesystem.

### Caching and Deduplication

| Cache | Purpose |
|-------|---------|
| `cachedIndexHtml` | Caches the Vite-transformed `index.html` for CSR — avoids re-reading and re-transforming on every navigation |
| `fixtureCache` | Maps SSR fixture URLs to their rendered HTML — serves fixtures from memory without filesystem reads |
| `pendingGenerations` | Deduplicates concurrent SSR generation requests for the same `testId` — if a generation is already in progress, subsequent requests await the same promise |

---

## SSR Rendering Utilities

These functions in `src/ssr/render.ts` are used by consumer `entry-server.ts` modules to build SSR output.

### renderFixture

`renderFixture(queryObj, dsdTemplate?, styles?, templateData?, childTemplates?)` assembles the fixture element HTML.

- If `queryObj.html` is present, uses it as the raw fixture HTML.
- Otherwise, builds the element from `queryObj.tagName`, `queryObj.attributes` (parsed from JSON), and `queryObj.innerHTML`.
- When a `dsdTemplate` is provided, it is processed through `processDsdTemplate` to resolve `{{placeholder}}` bindings from the element's attributes and `templateData`.
- The processed DSD is injected inside the opening tag before the innerHTML.
- If `childTemplates` is provided, DSD templates are injected into nested custom elements via `injectChildTemplates`.

### renderTemplate

`renderTemplate(rawTemplate, styles)` replaces `{{styles}}` in an f-template HTML string with a `<link rel="stylesheet">` tag. If no `{{styles}}` placeholder is found and a styles URL is provided, it inserts the link tag after the opening `<template>` tag.

### processDsdTemplate

`processDsdTemplate(dsd, templateValues)` resolves `{{varName}}` placeholders in a DSD template string. It uses a character-scanning approach (not regex) to avoid O(n²) backtracking on untrusted input.

The function handles two contexts:

| Context | Behavior |
|---------|----------|
| **Attribute binding** (`attr="{{varName}}"` or `?attr="{{varName}}"`) | Scans backwards from `{{` to find the attribute name and optional `?` boolean prefix. If the value is `undefined`, the entire attribute is removed. For boolean attributes (`?`), a truthy value emits the bare attribute name; falsy removes it. |
| **Text content** (`{{varName}}` in element body) | Replaces with the stringified value, or empty string if `undefined`. |

Attribute names are also normalized by stripping hyphens (e.g., `my-attr` also checks `myattr`) to support camelCase state properties bound to hyphenated HTML attributes.

### injectChildTemplates

`injectChildTemplates(html, childTemplates)` injects DSD templates into nested custom elements found in an HTML string. It uses a regex with a lookahead (`(?=[\s>/])`) to avoid partial matches on hyphenated names (e.g., `my-radio` does not match `my-radio-group`). Each child element's own attributes are extracted and passed to `processDsdTemplate`.

### renderPreloadLinks

`renderPreloadLinks(styles, tokensThemeUrl?)` generates `<link>` tags: a `stylesheet` link for the theme URL (if provided) and `preload` links for each style URL.

---

## Asset Resolution

The `src/ssr/assets.ts` module provides two helpers for locating files in SSR `entry-server.ts` modules:

| Function | Purpose |
|----------|---------|
| `readAsset(specifier)` | Reads a file as a UTF-8 string. Accepts bare package specifiers (resolved via `import.meta.resolve` through `package.json` exports maps) or filesystem paths (resolved relative to `process.cwd()`). |
| `resolveAssetUrl(specifier, root?)` | Resolves a specifier to a server-relative URL path (starting with `/`) for use in `<link>` tags. The path is made relative to `root` (defaults to `process.cwd()`). |

Both delegate to `resolveSpecifier`, which distinguishes bare specifiers from filesystem paths by checking whether the specifier starts with `.` or `/`.

---

## Configuration Files

### Playwright Configuration

`playwright.config.ts` provides a shared Playwright configuration for consumers:

| Setting | Value |
|---------|-------|
| `retries` | `3` |
| `fullyParallel` | `true` |
| `reducedMotion` | `"reduce"` |
| `testMatch` | `src/**/*.pw.spec.ts` |
| `reporter` | `"list"` |
| `webServer.command` | `node start.mjs` |
| `webServer.port` | `5273` |
| `projects` | Chromium, Firefox, WebKit (Safari with `deviceScaleFactor: 1`) |

### Vite Configuration

`vite.config.mjs` provides a shared Vite configuration:

| Setting | Value |
|---------|-------|
| `clearScreen` | `false` |
| `resolve.conditions` | `["test"]` — enables the `test` condition in `package.json` exports maps, allowing packages to expose source files (`.ts`) directly to Vite instead of compiled output |
| `server.port` | `5273` (from `PORT` env var) |
| `server.strictPort` | `true` |
| `build.minify` | `false` |
| `build.sourcemap` | `true` |

---

## Exports

| Specifier | Contents |
|-----------|----------|
| `@microsoft/fast-test-harness` | `test`, `expect`, `CSRFixture`, `SSRFixture`, `readAsset`, `resolveAssetUrl`, `renderFixture`, `renderTemplate` |
| `@microsoft/fast-test-harness/server.mjs` | `startServer`, `app` |
| `@microsoft/fast-test-harness/ssr/render.js` | `renderFixture`, `renderTemplate`, `renderPreloadLinks` |
| `@microsoft/fast-test-harness/ssr/assets.js` | `readAsset`, `resolveAssetUrl` |
| `@microsoft/fast-test-harness/playwright.config.ts` | Shared Playwright configuration |
| `@microsoft/fast-test-harness/vite.config.mjs` | Shared Vite configuration |
| `@microsoft/fast-test-harness/public/*` | Static assets (base CSS reset) |
