# Contributing to `@microsoft/fast-build`

## Building compiler WASM and the Node addon

The `wasm/` directory is generated locally and must be built before using the package.
These contributor prerequisites are not required for ordinary npm consumers on
supported prebuilt targets; see the [native hosting guide](./docs/native-node-host.md).

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/)

```sh
cargo install wasm-pack
```

### Steps

From the repository root:

```sh
npm run build -w @microsoft/fast-build
```

This builds compiler/converter WASM into `packages/fast-build/wasm/` and the source-built Node addon into `crates/microsoft-fast-build/target/node-host/fast-build.node`.

### Running the Rust tests

```sh
cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml
npm run test:node -w @microsoft/fast-build
```

## Performance benchmarks

```sh
FAST_NATIVE_ADDON="$PWD/crates/microsoft-fast-build/target/node-host/fast-build.node" npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200
```

The runner measures the native JSON Buffer backend in fresh Node processes and verifies
output hashes across samples. See the
[measurement guide](./docs/server-modules.md#qualification-and-measurements)
for timing, memory and size boundaries. Frozen HTML, native Rust/Node conformance, ownership and browser hydration checks remain independent of timing.
