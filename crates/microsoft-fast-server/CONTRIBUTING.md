# Contributing to microsoft-fast-server

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- Cargo (included with Rust)

## Setup

```bash
git clone <repo>
cd ideas/create-rust-backend/crates/microsoft-fast-server
```

## Running Tests

```bash
cargo test
```

This runs both unit tests (in each source module) and integration tests (in `tests/`).

## Building

```bash
cargo build
```

## Source File Overview

| File | Purpose |
|------|---------|
| `src/lib.rs` | Public API: `render_template`, `render` |
| `src/json.rs` | `JsonValue` enum and JSON string parser |
| `src/context.rs` | Value resolution (`resolve_value`, `get_nested_property`) |
| `src/expression.rs` | f-when expression evaluator |
| `src/renderer.rs` | Core template rendering logic |
| `tests/integration_test.rs` | Integration tests |
