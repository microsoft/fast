# Contributing to microsoft-fast-build

Rust, Cargo and Node.js are required. Run commands from the monorepo root:

```sh
cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml
npm run build -w @microsoft/fast-build
npm run test:node -w @microsoft/fast-build
npm run bench:server -w @microsoft/fast-build
```

Compiler, metadata, stylesheet composition, authored slot analysis and filesystem
tests run natively. Rendering assertions compile and execute generated JavaScript
using test-only adapters in tests/common; do not restore a native evaluator.
Legacy chunk-boundary and prepared lifecycle tests are retired with those APIs.
The shared performance corpus remains under benches/fixtures and its byte/hash
baselines run in the Node suite. Historical performance measurements are in
benchmark-baselines and the package's docs/server-modules.md.
See [DESIGN.md](./DESIGN.md) for current ownership and the module map.
