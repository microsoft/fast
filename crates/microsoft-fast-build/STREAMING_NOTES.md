# Streaming notes

`microsoft-fast-build` currently implements **simulated streaming**. The renderer
walks the template with the same semantics as normal rendering and returns a
precomputed `Vec<String>` of HTML chunks. The WASM `render_entry_with_templates`
export serializes that vector as a JSON array string when called with
`stream: true`; the `@microsoft/fast-build` CLI parses the array and writes each
chunk directly to stdout.

## Guarantees

- `chunks.join("")` matches the equivalent non-streamed render.
- Stream entry points run the same `escape_code_sample_elements` preprocessing
  as normal rendering before directive scanning.
- Empty chunks are omitted.
- Content bindings may become their own chunks.
- Attribute bindings are resolved inside a complete opening tag chunk, so a
  streamed tag is never split before `>`.
- A custom element chunk begins with the rendered opening tag and includes the
  complete Declarative Shadow DOM `<template>`. Light DOM content follows in
  later chunks when present.
- Template host attributes are merged onto custom element opening tags using
  the same helper as normal rendering: author attributes win, client-only
  attributes are skipped, and host bindings resolve against child state.
- Existing non-streamed rendering and CLI file output are unchanged.

## Current limitations and gotchas

- Streaming is not lazy: all chunks are prepared in memory before any WASM
  result is returned to JavaScript.
- The CLI `--stream` mode is stdout-only. It does not write `--output` and does
  not print the normal `Built: ...` message.
- The CLI uses `render_entry_with_templates(..., true)` for `--stream`, passing
  `{}` as `templates_json` when no templates were loaded.
- The CLI writes raw HTML chunks, not a Node.js `ReadableStream`, so consumers
  should pipe stdout if they need process-level streaming.
- Shadow templates for custom elements are rendered fully before the custom
  element opening chunk is emitted. This intentionally keeps the shadow template
  with the opening tag so custom element constructors can see Declarative Shadow
  DOM immediately.
- Chunk boundaries are an implementation detail except for the safety rules
  above. Consumers should not depend on a specific number of chunks.
- In non-hydrated stream scopes, false `<f-when>` branches, empty repeats,
  and missing or empty content bindings can remove chunks entirely. When
  hydration is active, the renderer still emits the same hydration marker
  comments as the equivalent non-streamed render, even when the rendered value
  or directive body is empty.
- No additional template-render cache is introduced for streaming; the renderer
  reuses the locator/template map and renders each encountered custom element.
