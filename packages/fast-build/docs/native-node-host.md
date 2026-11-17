# Explicit source-built native Node hosting

This bounded candidate is not a measured shipping recommendation. Generated
JavaScript remains the explicit alternative; no backend changes automatically.
The optional `node-host` Cargo feature lives in `microsoft-fast-build`, with the
facade in the existing `@microsoft/fast-build` package. There is no binding crate,
platform npm package, npm runtime dependency, install script, download or fallback.

## Build and load

Use matching reviewed FAST sources and a Rust toolchain. From the repository root:

```sh
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run build:native-host \
  -w @microsoft/fast-build -- ../../crates/microsoft-fast-build/target/r3-native-hosting
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

`fast-server-native` semantic schema 1 artifacts remain independent of compiler
fingerprints. The wire format uses named operation objects, a required `entry`,
named `templates` and component-name references to complete DSD templates, with
optional `host-attributes` metadata. The native loader retains its private indexed
execution layout; no old numeric or experimental schema-2 artifacts are accepted.
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

The host delegates to the shared typed native executor and its fresh-JSON APIs,
including bounded attribute writes. It does not duplicate native execution or
retain a separate state-borrowing implementation. Artifacts remain execution-only;
build-time JavaScript generation compiles the authored templates directly.

Earlier addon/tarball sizes and performance results predate this rebase and do
not qualify this source revision. Rebuild and remeasure before making a shipping
recommendation. The npm package contains source-mode facade/types/build script,
not `.node` binaries or crate sources.
Node-API 8 is requested and the package requires Node >=22.18.0. Only the current
macOS arm64/Node installation was tested before this rebase; Windows, Linux glibc/musl, other
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

### Source and worker proof for validation

Rebuild both the addon and `native-host-fixture` example from the same clean
candidate commit. Use a separate target for the fixture/default-feature build:

```sh
mkdir -p crates/microsoft-fast-build/target/r3-native-fixture
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 cargo build --release --locked \
  --manifest-path crates/microsoft-fast-build/Cargo.toml \
  --example native-host-fixture \
  --target-dir crates/microsoft-fast-build/target/r3-native-fixture \
  --message-format=json \
  > crates/microsoft-fast-build/target/r3-native-fixture/cargo-artifacts.json
```

Select `FAST_NATIVE_FIXTURE` from the `compiler-artifact` record's `executable`
for `native-host-fixture`, not an old path guessed from the target layout.
Set `FAST_NATIVE_ADDON` to the freshly copied `r3-native-hosting/fast-build.node`.
Both variables must be absolute paths when running
`npm run test:native-host -w @microsoft/fast-build` from the root.
Keep both Cargo JSON logs, exact source commit, feature/target settings and
SHA-256 hashes of the emitted library, copied addon and fixture executable.
The fixture emits its crate version, native semantic artifact and matching JS
module at test startup; tests reject a mismatched package/crate version.
The frozen expected output must match both targets in all four render contexts.

Worker proof requires four distinct worker thread IDs, each independently loading
the selected addon/facade and constructing its own program. Each worker renders
32 requests and sends exactly one final matching output before a successful exit.
An exit without that proof message is a failure, not a pass. Retained Buffers must
remain correct across program collection, repeated GC and worker completion.
These checks do not certify absence of leaks or qualify other platforms.
