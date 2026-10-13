# Contributing to `@microsoft/fast-build`

## Building the WASM

The `wasm/` directory is generated locally and must be built before using the package.

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

This runs `cargo build` on the Rust crate followed by `wasm-pack build --target nodejs`, writing the output to `packages/fast-build/wasm/`.

### Running the Rust tests

```sh
cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml
npm run test:node -w @microsoft/fast-build
```

## Performance benchmarks

```sh
npm run bench:render -w @microsoft/fast-build -- --case=url_sink_siblings --output=/tmp/fast-render.json
cargo bench --manifest-path crates/microsoft-fast-build/Cargo.toml --bench render
```

The Node runner measures the packaged WASM in fresh child processes; native
Criterion groups isolate renderer/state/locator phases. See the
[benchmark guide](../../crates/microsoft-fast-build/benchmark-baselines/README.md)
for comparison commands, golden parity, opt-in scaling checks, and limitations.
