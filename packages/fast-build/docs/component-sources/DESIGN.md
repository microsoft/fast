# Component sources

This is the shared source-resolution contract for FAST Build, FAST Convert,
FAST Test Harness, and Node integrations producing declarative shadow DOM.
Its dependency-free implementation and declarations are exported from
`@microsoft/fast-build/component-sources.js`.

## Configuration

`components` is always an array of explicit records:

```json
{
    "components": [
        {
            "tagName": "m-fast-card",
            "template": "./src/components/card/card.html",
            "stylesheet": "./src/components/card/card.css",
            "clientModule": "./src/components/card/card.ts",
            "className": "FastCard",
            "generated": "./src/components/card/generated/"
        }
    ]
}
```

`tagName` is a lowercase custom-element identifier containing a hyphen.
`template` names one exact `.html` file; `stylesheet`, when supplied, names one
exact `.css` file. `clientModule` names a JavaScript/TypeScript module and
`className` names its class export. No glob expansion, implicit directory scan,
class inspection, or runtime registration occurs.

## Operations

| Operation | Required fields | Outputs |
| --- | --- | --- |
| SSR | `tagName`, `template` | Entry HTML or one native artifact, selected by the command |
| TypeScript generation | `tagName`, `template`, `clientModule`, `className`, `generated` | `<tagName>.template.ts`, optional `<tagName>.styles.ts` |
| HTML conversion | `tagName`, `template`, `generated` | `<tagName>` plus the target's HTML suffix |

Other supplied fields remain metadata for operations that do not consume them.
SSR neither generates client modules nor creates `generated` directories.
Providing a filesystem stylesheet does not insert it into SSR markup, copy
assets, or turn its filename into a public URL. Integrations own stylesheet
delivery, composition, browser registration, hydration, and watch policy.

The CLI uses the existing Rust parser to require exactly one definition whose
decoded `<f-template name>` equals `tagName`. The harness uses `tagName` as output
identity; its converter validates the single definition without enforcing name
equality. Source resolution does not parse HTML or duplicate Rust validation.

## Resolution API

`validateComponentSources(components, operation)` synchronously checks record
shape and declared identities without filesystem or compiler access.

`resolveComponentSources(components, { baseDir, operation, templateSuffix? })`
returns a promise for `{ components, inputFiles, generatedDirectories }`.
`baseDir` must be explicit and absolute. JSON configuration uses the owning
config file's directory; the harness uses the Vite config directory, or Vite's
root for an inline configuration. Programmatic integrations supply their own base.
HTML conversion supplies `templateSuffix` from Rust's syntax metadata.

```js
import { resolveComponentSources } from "@microsoft/fast-build/component-sources.js";

const resolved = await resolveComponentSources(config.components, {
    baseDir: configDirectory,
    operation: "typescript",
});
// Read resolved.components; adapters own conversion and publication.
```

All supplied inputs must exist as regular files. Relative paths are based on
`baseDir`, never on `generated`. Resolved component inputs are canonical absolute
paths. Watch/input-protection lists include both lexical and canonical aliases.
Generation directories resolve through their existing ancestors without creating
directories or files. Adapters re-resolve after directory creation before writing,
so newly created case-folded aliases also receive collision checks.

The resolver rejects duplicate outputs, nested canonical generation directories,
and directories containing any configured input. Components can share a canonical
output directory when their filenames differ, including symlink aliases.
SSR requires globally unique tag names; generation permits the same tag in
distinct non-overlapping directories. Unlisted files are never discovered.

Resolved generation records include `templateOutput`, optional
`stylesheetOutput`, and, for TypeScript, `typeSourceImport`.
Type imports are relative to the generated directory, use forward slashes, and
rewrite `.ts`/`.tsx` to `.js`, `.mts` to `.mjs`, and `.cts` to `.cjs`.
Cross-filesystem-root imports are rejected. Modules are never evaluated; normal
TypeScript checking verifies the named export and binding properties.

## Diagnostics and publication

Shape, missing-file, alias, and output-overlap errors stop the operation with
actionable messages. File failures identify the component, field, and path.
Compiler/converter diagnostics retain Rust's codes and authored source locations;
adapters associate those diagnostics with the resolved input.

Convert finishes conversion and overwrite checks across the batch before
replacing files with sibling temporary-file renames. Replacing existing output
requires explicit overwrite permission. It never removes stale files.
The harness retains its ownership headers, whole-batch validation, owned stale-file
cleanup, readiness queue, and automatic module/fixture invalidation.
These are adapter policies, not shared resolver behavior. Multiple output files
are not a filesystem transaction; an I/O failure during publication can leave
earlier files published.

New integrations reuse the exported resolver rather than implementing another
schema, glob walker, filename mapper, or class-discovery mechanism. Rust string
conversion and native artifact APIs remain filesystem-independent primitives.
