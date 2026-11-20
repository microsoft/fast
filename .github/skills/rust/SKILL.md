---
description: Use this guide when working on Rust changes in the FAST monorepo.
name: rust
---

# Working with the Rust crate and the Rust NodeJS CLI

The primary location for the Rust logic should exist within a crate. If the logic is made accessible in the NodeJS environment via wrapping the crate and using a wasm bindgen, as much as possible any logic that exists in Rust should not be duplicated in JavaScript/TypeScript.

## Performance changes

- **Establish a controlled baseline.** Compare against the intended target branch,
  normally main, using identical fixtures, render options, compiler versions and
  release settings. Record source revisions, effective flags and artifact/addon
  identities. Warm each boundary, alternate baseline/candidate process order and
  repeat measurements. Complete builds and tests before timing runs.
- **Separate measurement boundaries.** Measure fresh-JSON parsing plus execution,
  prepared-state execution, Node Buffer delivery and complete string delivery
  separately. Account for preparation and retained state when evaluating reuse.
  Distinguish compilation, loading, first render and warmed request costs.
- **Qualify gains with controls and memory.** Include representative small, static,
  wide, deep, sparse and populated workloads, applicable marker modes, and
  bounded-storage fallback cases. Investigate apparent regressions with repeated
  control runs; report them alongside gains. Measure allocation calls, requested
  bytes, peak live heap and post-request retention. Allocator-requested bytes are
  not RSS or copied-byte measurements. Run profilers and allocation tracking in
  separate diagnostic passes rather than latency comparisons.
- **Remove redundant work before adding machinery.** Prefer eliminating duplicate
  lookups, conversions and allocations, borrowing immutable input or plan data,
  and bounded request-local operand reuse. Measure both the common and fallback
  paths. Avoid unnecessary input-graph clones. Bound and measure any cross-request
  buffer retention, including large-to-small workload transitions.
- **Preserve execution contracts.** Verify exact output, escaping, ownership,
  own-key/null masking, alias precedence, parent fallback, validation and recovery.
  Preserve error ordering, exact step/output limits, complete parsing and required
  validation, including errors in unused or overwritten input. Keep collision
  protection for untrusted keys.
- **Treat configuration changes as experiments.** Release-profile, LTO,
  codegen-unit and buffer-reuse choices require measured workload and platform
  qualification. Preserve the distributed binaries' CPU baseline rather than
  enabling `target-cpu=native`.

Use the [native profiling guide](../../../packages/fast-build/docs/native-profiling.md)
for tools and measurement boundaries. Keep workload-specific results and
reproduction details in package docs, not this skill or architectural DESIGN.md
documents.

## Breaking changes

Understand [semver](https://semver.org/) and check the crate and package version. If the version is currently in a prerelease state, update the APIs with breaking changes as necessary and ensure that any generated pull request descriptions capture this.

Follow the [documentation skill](../documentation/SKILL.md) for per-publish
migration guides linked through `docs/migration.md`. DESIGN.md describes only the
current Rust APIs and internals, without removed-API history or migration links.
