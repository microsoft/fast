# Design - microsoft-fast-build-node

This nonpublished, standalone `cdylib` owns only Node-API transport and hosting.
The path dependency on `microsoft-fast-build` owns artifact validation, state
normalization, execution, limits and rendering semantics. No compiler or
executor is duplicated, and no npm runtime dependency or supported package
export is introduced.

`NativeProgram` owns an immutable `CompiledArtifact` after constructor-time
validation. Node handles remain isolate-local. Each synchronous invocation
borrows input Buffers, decodes state through `parse_render_state`, decodes typed
options and invokes one existing native render method. No request state is
retained in the program. Native domain errors map to recoverable JavaScript
errors with their original code; transport option errors use `invalid-options`.

The executor still traverses JSON IR and validates/normalizes/copies state.
Parsing state here and validation in the executor are intentionally preserved,
not claimed as allocation optimizations. Owned Rust strings become UTF-8 byte
vectors transferred into owned Node Buffers without another output encoding.
Input storage and program lifetime do not bound output lifetime.

The committed standalone Cargo lockfile makes source builds reproducible.
`napi-build` configures host linking; the opt-in Node build script copies the
host library to `.node` inside the ignored crate target directory. There is no
prebuilt distribution, automatic fallback, async offload, cross-compilation
support or stable addon API promise. Tests qualify frozen rendering bytes,
all four targets/options, limits/errors, lifetime and independent workers.

The optional phased benchmark loads one addon/program per fresh child and
reports native artifact loading separately from library import. A second warm
loop uses identical JSON bytes as input and complete UTF-8 bytes as output for
both backends. The ordinary AOT-only benchmark retains its existing boundaries.
Typed IR, state-allocation reductions and production packaging are follow-ups.
