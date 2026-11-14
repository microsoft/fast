# FAST Build experimental Node host

Source-built, opt-in N-API prototype over the existing `microsoft-fast-build`
executor. This crate is not published. No prebuilt binaries, npm exports,
automatic fallback or stable addon API are provided. Default FAST Build
compilation and JavaScript rendering are unchanged.

From the repository root, with Node 22, Rust stable and npm dependencies installed:

```sh
npm run build -w @microsoft/fast-build
npm run test:native -w @microsoft/fast-build
```

The second command builds the host-platform release addon from the committed
lockfile and runs Node integration tests. Build without testing using
`npm run build:native -w @microsoft/fast-build`. The binary is placed in
`crates/microsoft-fast-build-node/target/release/fast-build.node`.
macOS, Linux and Windows are source-build targets; cross-compilation is not
provided by this script. Node must support N-API 8.

For a CommonJS host:

```js
const { NativeProgram } = require("./crates/microsoft-fast-build-node/target/release/fast-build.node");
const { readFileSync } = require("node:fs");

const program = new NativeProgram(readFileSync("./generated/server.fast"));
const state = Buffer.from('{"title":"Request-specific state"}', "utf8");
const options = Buffer.from('{"markersV2":true}', "utf8");
const htmlBytes = program.renderEntry(state, options);
```

Compile `server.fast` at build time using `compileServerArtifact` from
`@microsoft/fast-build/server.js`. Artifacts must match the linked Rust compiler
fingerprint; regenerate them with the deployed library on upgrades.

`NativeProgram` provides synchronous `renderEntry(state, options?)`,
`renderTemplate(state, options?)`, `renderHost(name, state, options?)` and
`renderShadow(name, state, options?)`. State and options are UTF-8 JSON Buffers,
not arbitrary JavaScript objects. Omitted options use native defaults.
Options are `markersV2`, `dsd`, `attributeNameStrategy` (`camelCase` or `none`),
`maxOutputBytes` and `maxSteps`; unknown fields and invalid types are rejected.
Optional fields may be null to use their native default (`dsd: null` selects all).
JSON serialization performed by callers is outside the binding and is not the
JavaScript backend's object-validation contract.

The artifact is independently owned after construction. Request inputs are
borrowed only during synchronous calls; do not concurrently mutate shared input
bytes. Every returned Buffer owns complete UTF-8 output and survives destruction
of the program and inputs. Mutation of one result cannot affect subsequent
renders. Handles are isolate-local: create independent programs inside workers,
not structured-cloned or cross-isolate shared handles.

Native errors retain their `.code`, including `invalid-artifact`,
`incompatible-artifact`, `invalid-state`, `missing-template`, `repeat-not-array`
and `render-limit`; option decoding adds `invalid-options`. Incorrect JavaScript
argument types use Node-API conversion errors. Failed calls do not poison later
requests. State/output/step/depth limits retain the
[existing native contract](../../packages/fast-build/docs/server-modules.md#native-rust-artifact-target).

## Measurements

```sh
npm run bench:server -w @microsoft/fast-build -- --native=../../crates/microsoft-fast-build-node/target/release/fast-build.node --samples=3 --iterations=100 --instances=200
```

This explicitly selects the prototype alongside AOT, verifies identical output
hashes and separates artifact loading, state encoding and byte delivery.
Addon paths resolve against the benchmark's working directory, which is
`packages/fast-build` when invoked through the npm workspace script.
Prefer the matched `warmJsonToUtf8MsPerRender` comparison, not raw render-call
times with different input/output representations. See the
[measurement boundaries](../../packages/fast-build/docs/server-modules.md#experimental-native-node-measurements).
