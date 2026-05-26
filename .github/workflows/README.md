# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

## Draft Pull Requests

All CI workflows that run against pull requests are configured to skip draft PRs:

- **GitHub Actions** (`ci-validate-pr.yml`, `ci-validate-platforms.yml`, `ci-validate-rust.yml`): The `pull_request` trigger includes `ready_for_review` in its event types, and each job has a condition that skips execution when the PR is a draft. When a draft PR is marked as ready for review, the workflows will automatically trigger.
- **Azure Pipelines** (`azure-pipelines-bench.yml`, `azure-pipelines-ci.yml`): The `pr` trigger uses `drafts: false` to prevent pipeline runs on draft PRs.

## Continuous Deployment

Nightly publishing is split into two coordinated jobs so that npm credentials never leave the Azure environment. The flow mirrors the pattern used by [microsoft/webui](https://github.com/microsoft/webui/blob/main/.github/workflows/publish.yml): GitHub Releases are the source of truth, and `deployed/<tag>` git marker tags track which releases have already been published.

- **`cd-github-releases.yml`** (GitHub Actions) triggers on **`push` to `main`** and on `workflow_dispatch`. It does **not** bump versions or push source changes to `main` — version bumps land on `main` through ordinary human-authored pull requests (for example, by running `npm run bump` locally and opening a PR). The workflow has two jobs:
  1. **`detect`** — checks out `main` with `fetch-depth: 0` and runs [`build/scripts/create-github-releases.mjs --check-only`](../../build/scripts/create-github-releases.mjs). The script walks the workspaces tree (no `npm ci` required), computes `${name}_v${version}` for every non-private workspace, and emits `hasMissingReleases=true` if any of those git tags do not yet exist.
  2. **`release`** — runs only when `hasMissingReleases == 'true'`. Installs Node, the Rust toolchain (for `cargo package`), and the npm workspace dependencies, builds the repo, then runs the script in default mode. For every missing release the script: packs the npm tarball into `publish_artifacts_npm/`, packs the paired Rust crate (if `crates/<crate-name>/Cargo.toml` exists) into `publish_artifacts_crates/`, pushes an annotated `${name}_v${version}` git tag, and creates the GitHub release with both assets attached (via `gh release create --verify-tag`). The script errors if a paired crate's version does not match the npm package's version, forcing the version-bump PR to keep them in sync.
- **`azure-pipelines-cd.yml`** (Azure Pipelines) runs every night at **1am PST (`0 9 * * *` UTC)** with `always: true` so it still runs on no-op nights (it is checking external GitHub state, not repo commits). It is split into two stages so the heavy publish work is skipped on no-op nights:
  1. **`Check`** — runs [`build/scripts/download-github-releases.mjs --check-only`](../../build/scripts/download-github-releases.mjs). The script lists every git tag matching the beachball-style `${name}_v${version}` pattern that does **not** also have a `deployed/<tag>` counterpart and emits the comma-separated list via Azure Pipelines `setvariable` output variables (`needsDeployment`, `undeployedTags`). No network calls to npm or crates.io.
  2. **`Package`** — depends on `Check` and runs only when `needsDeployment == 'true'`. Downloads every undeployed release's assets via `gh release download`, sorts them into `publish_artifacts_npm/` (`.tgz`) and `publish_artifacts_crates/` (`.crate`), hands off to `FAST.Release.PipelineTemplate.yml@fastPipelines` for the actual `npm publish` / `cargo publish`, and on success pushes a `deployed/<tag>` git marker tag for each release that was just published. The next nightly run will see those markers and skip the corresponding releases.

Both scripts are thin Node.js wrappers around `gh`, `npm`, `cargo`, and `git` — no extra npm dependencies and no custom GitHub API client. Idempotency is enforced entirely through git tags (`${name}_v${version}` on the GitHub side, `deployed/${name}_v${version}` on the Azure side), so neither side needs to talk to npm.org or crates.io to decide whether work is required.