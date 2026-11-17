# Migrating fast-build 0.19 to 0.20

## Strict CLI template registries

`fast build` rejects duplicate template names and explicit `--templates` selections
that contain no named templates. This applies to fresh and persistent builds.

Replace ordered overrides with one selected definition per name:

```sh
# Before: both files define my-card; the later definition wins.
fast build --entry=index.html --templates="default.html,custom.html"

# After: select the desired definition.
fast build --entry=index.html --templates="custom.html"
```

Remove `--templates` or the `templates` configuration entry when intentionally
rendering an entry without component definitions. Empty values, unmatched
selections and files containing only nameless
templates now error instead of rendering with an empty registry.

The draft `templateSourcePolicy: "overwrite"` option is removed. Reset both the
managed module and its `.inputs.json` sidecar before rebuilding retained pairs
created by earlier CLI-cache drafts. Existing strict writer/converter pairs remain
reusable. Raw-source order is canonicalized; repeated sources still count as
duplicate definitions rather than silently deduplicating.

To opt into retained preparation, add `--server-module=generated/page.mjs`
(or the `server-module` config key) and cache both that file and its `.inputs.json`
sidecar. Request state and render options are not preparation inputs.
The plan/helper execution schema and rendered bytes do not change.

## Explicit CLI state files

Earlier versions implicitly loaded `state.json` when no state path was supplied.
Pass `--state=state.json` or set `"state": "state.json"` in
`fast-build.config.json` to load that file explicitly. Omitting the state path uses
an empty object (`{}`).

## Direct runtime helper imports

The runtime no longer exports `child` or `composite`. Component assignments and
composite attributes use loader-prepared execution recipes.

Integrations that import these helpers directly should express component property
bindings and composite attributes in templates, compile with `compileServerModule`
and call the generated rendering methods. Supported semantic modules already use
`createServerRenderer` and need no regeneration for this cleanup. Object, JSON and
prepared rendering methods retain their input and output contracts.

## Opting into fresh JSON request methods

Newly emitted ESM additionally exports `renderEntryJson`, `renderTemplateJson`,
`renderHostJson` and `renderShadowJson`. Pass required JSON text instead of an
already-parsed object; there is no implicit object serialization or byte decoding.
The helper owns parsing and lighter **full-graph** validation, including unused
finite-number/Unicode checks and negative-zero normalization. Rendering, coercion,
ownership of ordinary/prepared inputs and hydration bytes remain unchanged.

Supported `fast-server-js` and `fast-server-native` semantic schema 1 assets remain
usable unchanged. Retain their decoders and exact managed bytes; do not add
compiler/version rebuild keys. Older ESM export lists lack the new JSON names,
even after upgrading the helper. `writeServerModule` continues reusing those assets
when templates are unchanged. To opt in, explicitly emit and activate a new
destination (with its own sidecar), such as `server-json.mjs`, using the updated
compiler. The additive `ServerModule` declaration describes newly emitted modules,
not historical cached export lists. Object/prepared callers and native hosts need
no API or output changes.
See [the JSON contract](../server-modules.md#owned-fresh-json-requests).
