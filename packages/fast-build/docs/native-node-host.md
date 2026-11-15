# Explicit source-built native Node hosting

This bounded candidate is not a measured shipping recommendation. Generated
JavaScript remains the explicit alternative; no backend changes automatically.
The optional `node-host` Cargo feature lives in `microsoft-fast-build`, with the
facade in the existing `@microsoft/fast-build` package. There is no binding crate,
platform npm package, npm runtime dependency, install script, download or fallback.

## Build and load

Use matching reviewed FAST sources and a Rust toolchain. From the repository root:

```sh
CARGO_BUILD_JOBS=2 CARGO_INCREMENTAL=0 npm run build:native-host \
  -w @microsoft/fast-build -- ../../crates/microsoft-fast-build/target/native-hosting
```

The argument is a dedicated target directory, relative to the npm workspace.
Keep it separate from compiler/WASM, crate packaging and other feature targets.
The script uses `--release --locked --features node-host --lib`, selects the
actual library filename from Cargo JSON, copies it to `fast-build.node`, and
retains `cargo-artifacts.json` as source/build evidence. It never assumes a
platform library name. Source acquisition is an explicit deployment concern:
the npm tarball contains the facade/build script, not the crate or prebuilt addons.
Install the compiler package normally for build-time artifact generation.

```js
import { readFileSync } from "node:fs";
import { loadNativeHost, serializeNativeState } from "@microsoft/fast-build/native-host.mjs";

const Program = loadNativeHost("/absolute/deployment/path/fast-build.node");
const program = new Program(readFileSync("./generated/server.fast"));
const bytes = program.renderEntryJson('{"title":"hello"}');
const html = bytes.toString("utf8"); // Explicit string-consumer conversion.
const objectBytes = program.renderEntryJson(serializeNativeState({ title: "hello" }));
```

`renderEntryJson`, `renderTemplateJson`, `renderHostJson(name, state, options)`
and `renderShadowJson(name, state, options)` return owned UTF-8 Node Buffers
synchronously. State and optional options are explicitly JSON strings or Buffers,
not objects or implicit serializers. The facade rejects ill-formed JS Unicode
before Node's UTF-16 conversion can replace lone surrogates. Rust rejects malformed
UTF-8 Buffers and uses the fresh JSON APIs: one direct parse into validated request
storage, no serde value-tree re-conversion, hashing or snapshot copy.
Use the facade, not the internal addon constructor, for the Unicode contract.

`serializeNativeState` is an explicit object boundary. It reuses the JS runtime's
complete descriptor/prototype validation and immutable snapshot, then serializes
data without calling getters or `toJSON`. Classes, cycles, sparse/extra arrays,
symbols, non-enumerable properties, undefined/functions, malformed Unicode and
nonfinite numbers are rejected; negative zero normalizes to zero. Serialization
and snapshot costs must be included in object-boundary measurements.

## Errors, limits and lifetimes

Native schema 2/hash-free artifacts remain independent of compiler fingerprints.
Malformed/unsupported artifacts are rejected, with no compilation fallback.
State validates fully even when unused; native nesting/node limits remain 64 and
1,000,000. Options use JSON fields `markersV2`, `dsd`, `attributeNameStrategy`,
`maxOutputBytes` and `maxSteps`; unknown fields/types are rejected. Omitted or null
optional fields select native defaults. Defaults remain 64 MiB output and
1,000,000 steps. These native budgets are not promised by the JS alternative.
State errors precede options errors and missing-template lookup; budget errors
return no partial Buffer. Errors retain native `code` values and requests recover.

Artifacts own their decoded storage; input Buffers are borrowed only during the
synchronous call. The facade rejects artifact, state and options Buffers backed
by `SharedArrayBuffer` before entering native code; worker writes must never race
Rust byte reads. It checks the intrinsic backing store, not a caller-shadowable
`.buffer` property. Plain Uint8Array inputs are not accepted. Shared options
produce `invalid-options` after state validation; shared state/artifacts produce
`invalid-state`/`invalid-artifact`. The low-level addon is a trusted internal
transport and must only be called through this facade. Each output moves its Rust `Vec<u8>` through napi-rs's Buffer
ownership/finalizer implementation, independent of the program and later requests.
No hand-written unsafe ownership transfer, global renderer or request scratch is
used. napi-rs/Node manage Buffer external memory and finalization. Each worker
loads its own addon/class/program handles; no cross-environment JS handles exist.
Retained output after program drop, repeated GC, input mutation and four
independent workers are correctness tests, not a heap/leak certification.

## Qualification and migration

This candidate requires exact native-state prerequisite
`af2ccc3166484844653d93d4f0173a04cfc038df`. Its later PR must target baseline
#7825 and temporarily includes that shared prerequisite until it reaches the base;
the hosting commit does not duplicate native execution changes.

The locally built macOS arm64 release addon is 787,648 bytes before stripping.
The current npm dry-run tarball is 405,100 compressed / 1,123,285 unpacked bytes,
including existing WASM assets; its three added facade/types/build-script files
total 6,227 bytes and it contains no `.node` binaries. These local source-mode
figures are not an all-platform native tarball estimate.
Node-API 8 is requested and the package requires Node >=22.18.0. Only the current
macOS arm64/Node installation is tested; Windows, Linux glibc/musl, other
architectures, other Node versions and universal/prebuilt packaging are not
qualified. No all-platform tarball size or prebuilt ABI coverage claim is made.
Default Cargo builds, WASM exports and default npm build do not enable the feature.
No automatic prebuilt distribution is introduced.

Migration is opt-in: retain JS imports for JS requests; explicitly source-build
and select `loadNativeHost` for JSON-first requests. Native returns Buffer, not
string, and does not accept JS prepared-state handles. Pass supplied JSON directly
or explicitly validate/serialize objects; do not substitute `JSON.stringify`
on arbitrary objects. Include decode, object snapshot/serialization, load/first
request, memory and recovery in matched end-to-end measurements. Native inner-loop
speedups alone are not evidence this host wins.
