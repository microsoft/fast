# Source-built native Node hosting

Node server rendering requires the shared Rust executor through the
`@microsoft/fast-build/native-host.mjs` facade. The `node-host` Cargo feature
adds its synchronous Node-API transport to the existing crate. Applications
explicitly source-build and configure an addon path; no platform npm package,
automatic install/download or backend fallback is provided.

## Build and load

Use matching reviewed FAST sources and a Rust toolchain. From the repository root:

```sh
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run build:native-host \
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
import { loadNativeHost } from "@microsoft/fast-build/native-host.mjs";

const Program = loadNativeHost("/absolute/deployment/path/fast-build.node");
const program = new Program(readFileSync("./generated/server.artifact.json"), {
    markersV2: true,
    maxOutputBytes: 8 * 1024 * 1024,
    maxSteps: 1_000_000,
});
const state = Buffer.from('{"title":"hello"}', "utf8");
const bytes = program.renderEntryJson(state);
const html = bytes.toString("utf8"); // Explicit string-consumer conversion.
```

`renderEntryJson(state)`, `renderTemplateJson(state)`,
`renderHostJson(name, state)` and `renderShadowJson(name, state)` synchronously
accept unshared Buffers containing strict UTF-8 JSON and return owned UTF-8 Buffers.
Strings, objects and per-request options are not accepted.
Rust directly parses and validates the complete JSON request, including unused
values, without a serde value-tree re-conversion, hashing or snapshot copy.
The request dependency graph contains no compiler or WASM.

The optional `NativeHostOptions` constructor argument is a plain configuration
object with `markersV2?: boolean`, `dsd?: readonly string[]`,
`attributeNameStrategy?: "camelCase" | "none"`, `maxOutputBytes?: number` and
`maxSteps?: number`. Options are validated and copied into native storage once.
Later mutations to the caller's object or DSD list cannot affect the program.
Unknown fields, accessors, proxies, malformed Unicode and invalid field types are
rejected without invoking getters or `toJSON`; budgets must be nonnegative safe
integers. Omitted or `undefined` fields select defaults. Use separate program
instances when requests require different policies.

## Errors, limits and lifetimes

`fast-server-native` semantic schemas 1 and 2 remain independent of compiler
fingerprints. The compiled `program` uses named operation objects, a required `entry`,
named `templates` and component-name references to complete DSD templates, with
optional `host-attributes` metadata. The native loader retains its private indexed
execution layout. The compiler emits schema 2 with authored `inputs` and a compiled
`program`. Loading discards build metadata before preparing runtime operations;
request methods do not retain or examine it. Schema-1 programs remain accepted.
Malformed/unsupported artifacts are rejected, with no compilation fallback.
State validates fully even when unused; native nesting/node limits remain 64 and
1,000,000. Default request budgets are 64 MiB output and 1,000,000 steps.
Counters reset on every render, including after errors; they are not lifetime
allowances shared by the program. Invalid options fail construction with `invalid-options`.
Request state errors precede missing-template lookup; budget errors return
`render-limit` with no partial Buffer. Errors retain native `code` values and
subsequent valid requests recover.

Artifacts own their decoded storage; input Buffers are borrowed only during the
synchronous call. The facade rejects artifact and state Buffers backed
by `SharedArrayBuffer` before entering native code; worker writes must never race
Rust byte reads. It checks the intrinsic backing store, not a caller-shadowable
`.buffer` property. Plain Uint8Array inputs are not accepted. Shared state/artifacts
produce `invalid-state`/`invalid-artifact`. The low-level addon is a trusted internal
transport and must only be called through this facade. Each output moves its Rust
`Vec<u8>` through napi-rs's Buffer
ownership/finalizer implementation, independent of the program and later requests.
No hand-written unsafe ownership transfer, global renderer or request scratch is
used. napi-rs/Node manage Buffer external memory and finalization. Each worker
loads its own addon/class/program handles; no cross-environment JS handles exist.
Retained output after program drop, repeated GC, input mutation and four
independent workers are correctness tests, not a heap/leak certification.

## Deployment and measurement

The host delegates to the shared typed native executor and its fresh-JSON APIs,
including bounded attribute writes. It does not duplicate native execution or
retain a separate state-borrowing implementation. Runtime loading is execution-only;
build-time JavaScript APIs compile authored templates into native artifacts.

The npm package contains the facade, types and source-build script,
not `.node` binaries or crate sources.
Node-API 8 is requested and the package requires Node >=22.18.0. Only the current
macOS arm64/Node installation is locally exercised; Windows, Linux glibc/musl, other
architectures, other Node versions and universal/prebuilt packaging are not
qualified. No all-platform tarball size or prebuilt ABI coverage claim is made.
Default Rust/WASM builds do not enable the transport feature; the repository npm build also builds the required local Node addon.
No automatic prebuilt distribution is introduced.

Source-build and configure `loadNativeHost` for UTF-8 JSON requests. Object validation/serialization is
an application-owned boundary, not part of this API. Do not silently substitute
`JSON.stringify` for descriptor-safe validation of arbitrary objects.

Measure application-matched input/output boundaries. Native measurements include
NAPI, request parsing/validation and owned output, plus input encoding or output
decoding when the application requires strings. Report constructor/load and first
request separately from warm rendering. Include memory, concurrency and error
recovery; inner-loop speed alone does not establish an end-to-end win.
Use the [measurement guide](./server-modules.md#qualification-and-measurements).

### Source and worker proof for validation

Rebuild both the addon and `native-host-fixture` example from the same clean
candidate commit. Use a separate target for the fixture/default-feature build:

```sh
mkdir -p crates/microsoft-fast-build/target/native-fixture
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 cargo build --release --locked \
  --manifest-path crates/microsoft-fast-build/Cargo.toml \
  --example native-host-fixture \
  --target-dir crates/microsoft-fast-build/target/native-fixture \
  --message-format=json \
  > crates/microsoft-fast-build/target/native-fixture/cargo-artifacts.json
```

Select `FAST_NATIVE_FIXTURE` from the `compiler-artifact` record's `executable`
for `native-host-fixture`, not an old path guessed from the target layout.
Set `FAST_NATIVE_ADDON` to the freshly copied `native-hosting/fast-build.node`.
Configured paths must be absolute when running
`npm run test:native-host -w @microsoft/fast-build` from the root.
Keep both Cargo JSON logs, exact source commit, feature/target settings and
SHA-256 hashes of the emitted library, copied addon and fixture executable.
The fixture emits its crate version, native semantic artifact and Rust-rendered context outputs at test startup; tests reject a mismatched package/crate version.
Node and Rust outputs must also match independent frozen bytes in all four contexts.

Worker proof requires four distinct worker thread IDs, each independently loading
the selected addon/facade and constructing its own program. Each worker renders
32 requests and sends exactly one final matching output before a successful exit.
An exit without that proof message is a failure, not a pass. Retained Buffers must
remain correct across program collection, repeated GC and worker completion.
These checks do not certify absence of leaks or qualify other platforms.
