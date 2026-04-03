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
cd crates/microsoft-fast-build
cargo test
```
