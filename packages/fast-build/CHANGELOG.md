# Change Log - @microsoft/fast-build

<!-- This log was last generated on Fri, 09 Oct 2026 21:33:43 GMT and should not be manually modified. -->

<!-- Start content -->

## 0.12.0

Fri, 09 Oct 2026 21:33:43 GMT

### Minor changes

- Add fast convert --syntax=webui-framework-prerelease, which converts FAST's declarative syntax into the Microsoft WebUI Framework's own declarative runtime syntax: it transfers Shadow/Light DOM attributes from the outer <f-template> onto the inner <template>, requires a braced f-ref (converted to w-ref), and rewrites FAST's $e event argument to e. Unsupported f-slotted/f-children directives are stripped from the output with a printed warning instead of being preserved verbatim, and $c event context errors. convert_template/convert_template_with_options (Rust, WASM, and the fast convert CLI) now also report these warnings alongside the converted output. The existing webui-prerelease and fast-v3-ts targets are unchanged. (7559015+janechu@users.noreply.github.com)
- Add a markers_v2 option for emitting FAST Element 2.x indexed hydration markers. (7559015+janechu@users.noreply.github.com)

## 0.11.0

Thu, 01 Oct 2026 05:10:34 GMT

### Minor changes

- Add compose_f_template_styles for in-memory CSS composition into f-template definitions (7559015+janechu@users.noreply.github.com)
- Support an optional explicit TSource generic (--type-source / --type-source-import) for fast convert --syntax=fast-v3-ts output. (7559015+janechu@users.noreply.github.com)
- Bundle microsoft-fast-convert's new convert_stylesheet API (CSS to FAST v3 TypeScript conversion). (7559015+janechu@users.noreply.github.com)
- Add --templates glob support to fast convert, mirroring fast build; auto-create missing output directories (mkdir -p semantics). Removes the single-file --template flag/config key in favor of --templates (prerelease, no backwards compatibility). (7559015+janechu@users.noreply.github.com)

## 0.10.0

Wed, 29 Jul 2026 19:34:55 GMT

### Minor changes

- Add FAST declarative template conversion to the fast CLI. (7559015+janechu@users.noreply.github.com)

## 0.9.0

Thu, 25 Jun 2026 05:31:59 GMT

### Minor changes

- Add simulated streaming output for fast-build. (7559015+janechu@users.noreply.github.com)

### Patches

- Handle browser-valid whitespace in f-template wrapper tags. (7559015+janechu@users.noreply.github.com)

## 0.8.0

Wed, 24 Jun 2026 20:34:51 GMT

### Minor changes

- feat: auto-escape code samples inside `<code>` elements during SSR — braces (`{`/`}`) everywhere and the angle brackets of FAST directive tags (`<f-when>`, `<f-repeat>`) — so literal binding-like text and directive syntax render correctly while real HTML/custom elements inside `<code>` remain live DOM elements. Also exposes a new `escape_code_samples(html)` WASM export so build-time tooling can apply the same escape to author HTML that is injected into a rendered page outside the normal render pipeline. (7559015+janechu@users.noreply.github.com)

## 0.7.0

Thu, 21 May 2026 00:04:58 GMT

### Minor changes

- feat: propagate host attributes from inner <template> of <f-template> onto the rendered host element opening tag during SSR (static, {{expr}}, and ?name="{{expr}}" bindings; author-provided host attributes win on conflict; client-only attribute prefixes @, :, f-ref, f-slotted, f-children are skipped) (7559015+janechu@users.noreply.github.com)

## 0.6.0

Fri, 01 May 2026 00:15:38 GMT

### Minor changes

- feat: propagate shadowroot attributes (7559015+janechu@users.noreply.github.com)
- feat: allow fast-build rendering without state; omitted CLI state no longer probes state.json (7559015+janechu@users.noreply.github.com)

## 0.5.0

Thu, 30 Apr 2026 17:21:11 GMT

### Minor changes

- feat: change default attribute-name-strategy from none to camelCase (7559015+janechu@users.noreply.github.com)

## 0.4.0

Fri, 17 Apr 2026 00:26:37 GMT

### Minor changes

- feat: add --config option for loading build options from a JSON configuration file (7559015+janechu@users.noreply.github.com)
- feat: add attribute-name-strategy configuration option to the CLI and WASM renderer (7559015+janechu@users.noreply.github.com)

## 0.3.2

Fri, 10 Apr 2026 00:21:15 GMT

### Patches

- docs: update fast-build README to match fast-element style and clarify testing purpose (7559015+janechu@users.noreply.github.com)

## 0.3.1

Thu, 09 Apr 2026 00:05:34 GMT

### Patches

- fix: support .length property access on arrays in template expressions (7559015+janechu@users.noreply.github.com)
- fix: parse JSON array and object literals in HTML attribute values (7559015+janechu@users.noreply.github.com)

## 0.3.0

Wed, 08 Apr 2026 00:19:56 GMT

### Minor changes

- feat: root custom elements receive full entry-level state via render_entry_with_locator (7559015+janechu@users.noreply.github.com)
- feat: strip state-passing {{binding}} attributes from root custom element opening tags when rendering entry HTML (7559015+janechu@users.noreply.github.com)

## 0.2.0

Tue, 07 Apr 2026 00:50:48 GMT

### Minor changes

- feat: convert dataset.X attribute names to data-X in SSR renderer (7559015+janechu@users.noreply.github.com)

### Patches

- fix: support .length property access on arrays in template expressions (7559015+janechu@users.noreply.github.com)
- fix: strip @event binding attributes from rendered HTML; attribute values are always strings unless a {{binding}} expression is used; property binding keys preserve their original casing (7559015+janechu@users.noreply.github.com)

## 0.1.2

Sat, 04 Apr 2026 00:22:26 GMT

### Patches

- fix: account for tags without attributes (7559015+janechu@users.noreply.github.com)

## 0.1.1

Fri, 03 Apr 2026 00:07:06 GMT

### Patches

- Parse f-template name attribute in JS locator; add DESIGN.md to @microsoft/fast-build (7559015+janechu@users.noreply.github.com)
