# Contributing to microsoft-fast-build

Rust, Cargo and Node.js are required. Run commands from the monorepo root:

```sh
cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml
npm run build -w @microsoft/fast-build
npm run test:node -w @microsoft/fast-build
npm run bench:server -w @microsoft/fast-build
```

Compiler, metadata, stylesheet composition, authored slot analysis and filesystem
tests run natively. Rendering assertions compare loaded native artifacts with
generated JavaScript using test-only adapters in tests/common. The shared
performance corpus under benches/fixtures has byte/hash regression assertions
in the Node suite. See the package's
[measurement guide](../../packages/fast-build/docs/server-modules.md#qualification-and-measurements)
for the current JavaScript benchmark and its measurement boundaries.
See [DESIGN.md](./DESIGN.md) for current ownership and the module map.
