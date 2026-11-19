# Native Node hosting

Node server rendering requires the shared Rust executor through the
`@microsoft/fast-build/native-host.mjs` facade. The `node-host` Cargo feature
adds its synchronous Node-API transport to the existing crate. On supported targets,
ordinary npm installation supplies a prebuilt addon and requires no Rust toolchain,
FAST source checkout or path configuration.

## Install and load

```sh
npm install --save @microsoft/fast-build
```

The parent package declares exact-version optional dependencies on platform
packages. Keep optional dependencies enabled; npm's OS/CPU/libc constraints select
the target package. `loadNativeHost()` resolves it relative to the installed facade
through Node package resolution, not relative to the process working directory.

```js
import { readFileSync } from "node:fs";
import { loadNativeHost } from "@microsoft/fast-build/native-host.mjs";

const Program = loadNativeHost();
const program = new Program(readFileSync("./generated/server.artifact.json"), {
    markersV2: true,
    maxOutputBytes: 8 * 1024 * 1024,
    maxSteps: 1_000_000,
});
const state = Buffer.from('{"title":"hello"}', "utf8");
const bytes = program.renderEntryJson(state);
const html = bytes.toString("utf8"); // Explicit string-consumer conversion.
```

For custom provisioning, the existing explicit form remains:
`loadNativeHost("/absolute/deployment/path/fast-build.node")`.
The CLI uses automatic loading when no override is given. CLI `--native-addon`
overrides configured `native-addon`, with `FAST_NATIVE_ADDON` as the environment
override when neither is configured. The loader itself does not read that variable.
An explicit path bypasses automatic platform selection and optional-package
metadata checks; it does not turn an incompatible artifact into a supported one.

Neither loading nor package installation invokes Cargo or downloads an addon
outside npm's normal package acquisition. Loading never contacts the network or
silently switches to JavaScript/WASM execution. Compiler-only imports from
`server.js` remain independent of native loading.

### Supported prebuilt targets

Requires Node >=22.18.0. Release qualification exercises Node 22.18.0, Node 24 and Node 26.
The addon requests Node-API 8, as configured by the crate's `napi8` Cargo feature;
the Node-API level does not broaden the package's Node engine requirement.

| Target | Optional npm package | Build/test baseline |
|---|---|---|
| macOS arm64 | `@microsoft/fast-build-darwin-arm64` | macOS arm64 |
| macOS x64 | `@microsoft/fast-build-darwin-x64` | macOS x64 |
| Linux x64 glibc | `@microsoft/fast-build-linux-x64-gnu` | Ubuntu 22.04, glibc 2.35 |
| Linux arm64 glibc | `@microsoft/fast-build-linux-arm64-gnu` | Ubuntu 22.04 build, glibc 2.35; ARM64 execution |
| Windows x64 | `@microsoft/fast-build-win32-x64-msvc` | Windows MSVC |
| Windows arm64 | `@microsoft/fast-build-win32-arm64-msvc` | Windows ARM64 MSVC |

This is the prebuilt matrix, not a promise of universal native compatibility.
Linux musl, other architectures/libcs and older Linux baselines
are not qualified by these packages. An explicit source build may be possible,
but requires independent qualification for that target.

### Package identity and troubleshooting

Each native package contains `fast-build.node` and `native-build.json`, recording
its package name, version, target, Node-API level and source revision.
Automatic loading checks package/build identity and the native host's reported
version/API contract. Semantic artifact schema compatibility is separate from
package release identity; it is not a compiler fingerprint or source-hash gate.

- **`unsupported-platform`:** use a supported Node host or explicitly provision
  and qualify a custom addon. Prebuilt Linux packages require glibc, not musl.
- **`native-package-missing`:** reinstall dependencies for the actual deployment
  target with optional dependencies enabled, for example `npm ci --include=optional`.
  Check package-manager omit/platform settings and that the lockfile includes the
  target's exact-version optional package. Do not copy macOS `node_modules` to Linux.
- **`native-version-mismatch` / `native-incompatible`:** deploy the parent and
  selected native package at the same exact version. Remove stale deployment output
  and reinstall from the intended lockfile rather than substituting another
  release's binary.
- **`native-api-mismatch`:** use the supported Node version and a native package
  with the expected Node-API and artifact-host contract.
- **`native-load-failed`:** retain the error cause and verify Node version, CPU,
  libc baseline, system loader dependencies and whether deployment tooling retained
  the `.node` file. No download or source-build fallback repairs these failures.

### Explicit source provisioning

Use this route for unsupported targets, custom toolchains or policies requiring
internally reviewed binaries. The npm packages do not contain the Rust crate
sources. Obtain a reviewed FAST source checkout separately.

Inspect the selected package's `native-build.json` source revision and npm release
provenance to identify the matching repository commit. For example, from the
consumer installation:

```sh
node --input-type=module <<'JS'
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const addon = require.resolve("@microsoft/fast-build-linux-x64-gnu");
console.log(readFileSync(join(dirname(addon), "native-build.json"), "utf8"));
JS
npm view '@microsoft/fast-build-linux-x64-gnu@<installed-version>' dist.attestations
```

Select your actual target package and exact installed version. Verify provenance
against the reviewed release tag/revision; do not assume the current `main` branch
or a same-numbered unrelated checkout matches the package.
Check out that reviewed revision before installing repository prerequisites.
From the matching FAST repository root:

```sh
git checkout --detach "<reviewed-release-tag-or-source-revision>"
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run build:native-host \
  -w @microsoft/fast-build -- ../../crates/microsoft-fast-build/target/native-hosting
```

Provision Rust/Cargo and the target's linker/native build tools explicitly.
The argument is a dedicated target directory, relative to the npm workspace.
Keep it separate from compiler/WASM, crate packaging and other feature targets.
The helper uses `cargo build --release --locked --features node-host --lib`,
selects the actual library filename from Cargo JSON, copies it to `fast-build.node`,
and retains `cargo-artifacts.json` as build evidence.
The locked dependency graph and reviewed revision make the build repeatable;
record the Rust toolchain, target, linker and binary hashes as well rather than
assuming byte-for-byte reproducibility across environments.
Deploy that addon explicitly with matching compiler/runtime dependencies.

## Request contract

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

The parent npm package contains the facade, types and source-build script;
the selected optional package contains the native binary, not crate sources.
Install dependencies on the deployment target. Server bundlers and deployment
tracers must retain the selected optional package, its metadata and `.node` file,
and preserve Node package resolution from the facade. Externalizing the native
package is often appropriate; copying a renamed `.node` file alone does not
preserve the automatic-loading package contract. Verify the final packed/bundled
server deployment, not just a source checkout.
This requires a native-addon-capable Node runtime, not a browser or native-addon-free
edge runtime.

Default Rust/WASM builds do not enable the transport feature; the repository npm
build also builds the local Node addon for development.
Object validation/serialization is an application-owned boundary, not part of this
API. Do not silently substitute
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
These checks do not certify absence of leaks or independently extend the supported
platform matrix.
