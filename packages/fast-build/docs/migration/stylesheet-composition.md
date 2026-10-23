# Stylesheet composition migration

## Prerelease behavior changes

- Stylesheet bodies are HTML raw text in build parsing, rendering, binding
  metadata, and all converter targets. Expressions or directive-looking strings
  inside CSS stay literal. Previously they could be misinterpreted as FAST syntax.
  Generate dynamic CSS before composition, or use runtime styling APIs.
- `unsafe-style-content` errors now expose original CSS coordinates and
  `sourceKind: "css"` in WASM (`source_kind()` in Rust). Do not attribute these
  coordinates to the HTML file.
- CSS ending with the incomplete terminator `</style` is also rejected, matching
  the documented raw-text safety contract.

## Integrations retaining authored diagnostics

Use `compose_f_template_styles_with_options` to get a composition result instead
of only a string. The old string shorthand remains available, but cannot carry
provenance. Pass `.html` to existing render/convert APIs and retain the result
until errors and binding spans have been mapped.

Map full-document UTF-16 binding offsets with `map_span(start, end)`. Map converter
and document-render diagnostics with `map_location(line, column, length, false)`;
pass `true` only for this definition's locator/shadow-root content diagnostics.
Associate each result with its original HTML/CSS files and verify `templateName`
before mapping named-definition errors. Do not reuse it after further source
transformations without composing the additional maps.

Mapping returns a source discriminator and optional authored span. Generated
markup has no authored coordinates. Invalid or cross-source ranges fail
explicitly. Free WASM composition handles when mapping is finished.

For identified adopted-style SSR fallbacks, register client styles separately
and convert the original HTML. The generated marker neither attaches replacement
styles nor removes fallback nodes.
