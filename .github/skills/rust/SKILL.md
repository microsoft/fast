---
description: Use this guide when working on Rust changes in the FAST monorepo.
name: rust
---

# Working with the Rust crate and the Rust NodeJS CLI

The primary location for the Rust logic should exist within a crate. If the logic is made accessible in the NodeJS environment via wrapping the crate and using a wasm bindgen, as much as possible any logic that exists in Rust should not be duplicated in JavaScript/TypeScript.

## Breaking changes

Understand [semver](https://semver.org/) and check the crate and package version. If the version is currently in a prerelease state, update the APIs with breaking changes as necessary and ensure that any generated pull request descriptions capture this.

Follow the [documentation skill](../documentation/SKILL.md) for per-publish
migration guides linked through `docs/migration.md`. DESIGN.md describes only the
current Rust APIs and internals, without removed-API history or migration links.
