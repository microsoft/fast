# Design — @microsoft/fast-build-tools

This document explains how the build utilities work internally.

---

## publish-rust.mjs

### Purpose

Bridges the gap between Beachball (which manages npm package versioning) and the Rust crate (`microsoft-fast-build`) which lives outside the npm workspace structure. The script replicates Beachball's "inspect commits → bump version → package artifact" pattern for the Rust side.

### Data flow

```
git tag --list "microsoft-fast-build_v*"
        │
        ▼
  latestTag (or null if no tags exist)
        │
        ▼
git log ${latestTag}..HEAD -- crates/microsoft-fast-build/
        │
        ▼
  commit messages (subject + body)
        │
        ▼
  determineBump(commits)
        │
        ├─ BREAKING CHANGE / type!: → "major"
        ├─ feat:                    → "minor"
        └─ anything else            → "patch"
        │
        ▼
  bumpVersion(current, bump)
        │
        ▼
  updateCargoToml(newVersion)     ← in-place version replacement
        │
        ▼
  cargo package --no-verify --allow-dirty
        │
        ▼
  copy .crate → publish_artifacts/cargo/
```

### Design decisions

1. **Tag-based range** — The script finds the latest `microsoft-fast-build_v*` tag via `git tag --list --sort=-version:refname` rather than constructing a tag name from the current `Cargo.toml` version. This avoids breakage if the Cargo.toml version diverges from the most recent tag.

2. **Output to `publish_artifacts/cargo/`** — Packaged crate files are placed under the existing `publish_artifacts/` directory (already in `.gitignore`) in a `cargo/` subdirectory. This mirrors the npm pattern (`publish_artifacts/` for npm packages) without requiring additional `.gitignore` entries.

3. **Conventional commit parsing** — The regex patterns match standard conventional commit prefixes. The `BREAKING CHANGE` trailer and `type!:` syntax both trigger major bumps, matching the conventional commits specification.

4. **No-op on no changes** — If no commits touch the crate directory since the last tag, the script exits with code 0 and produces no side effects. This allows `publish-ci` to always invoke it safely.

5. **`--no-verify --allow-dirty`** — `cargo package` is invoked with these flags because the working tree may contain uncommitted Beachball changes and the crate tests are validated separately in CI.

### Integration

The script is chained before `beachball publish` in the root `package.json`:

```json
"publish-ci": "node build/publish-rust.mjs && beachball publish -y --no-publish"
```

Running the Rust step first ensures the `Cargo.toml` version bump is captured before Beachball creates its commit and tags.
