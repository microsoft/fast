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
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200
```

The runner measures generated JavaScript in fresh Node processes and verifies
output hashes across samples. See the
[measurement guide](./docs/server-modules.md#qualification-and-measurements)
for timing, memory and size boundaries. Native artifact execution is qualified
by Rust/JavaScript conformance tests; this command does not measure native speed.
