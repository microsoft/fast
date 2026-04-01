# Contributing to `@microsoft/fast-build`

## Regenerating the WASM

The compiled WebAssembly output is pre-built and committed to the repository under `wasm/`. You only need to regenerate it if you make changes to the Rust crate at `crates/microsoft-fast-build`.

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/)

```sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### Steps

From the repository root:

```sh
npm run build:wasm -w @microsoft/fast-build
```

This runs `wasm-pack build --target nodejs` on the Rust crate and writes the output to `packages/fast-build/wasm/`. Commit the updated files in `wasm/` alongside any Rust changes.

### Running the Rust tests

```sh
cd crates/microsoft-fast-build
cargo test
```
