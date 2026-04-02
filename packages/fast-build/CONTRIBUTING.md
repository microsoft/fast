# Contributing to `@microsoft/fast-build`

## Building the WASM

The compiled WebAssembly output is **not committed** to the repository. The `wasm/` directory is listed in `.gitignore` and must be generated locally before using the package.

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/)

```sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### Steps

From the repository root:

```sh
npm run build -w @microsoft/fast-build
```

This runs `wasm-pack build --target nodejs` on the Rust crate and writes the output to `packages/fast-build/wasm/`. The generated files should **not** be committed.

### Running the Rust tests

```sh
cd crates/microsoft-fast-build
cargo test
```
