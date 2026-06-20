# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

## Draft Pull Requests

All CI workflows that run against pull requests are configured to skip draft PRs:

- **GitHub Actions** (`ci-validate-pr.yml`, `ci-validate-platforms.yml`, `ci-validate-rust.yml`): The `pull_request` trigger includes `ready_for_review` in its event types, and each job has a condition that skips execution when the PR is a draft. When a draft PR is marked as ready for review, the workflows will automatically trigger.
- **Azure Pipelines** (`azure-pipelines-bench.yml`, `azure-pipelines-ci.yml`): The `pr` trigger uses `drafts: false` to prevent pipeline runs on draft PRs.

## Continuous Deployment

Nightly publishing is split into two coordinated jobs so that npm credentials never leave the Azure environment. GitHub Releases are the source of truth, and `deployed/<tag>` git marker tags track which releases have already been published.

- **`cd-github-releases.yml`** (GitHub Actions) runs nightly via cron (`0 8 * * *` UTC, ~12am PST) and on `workflow_dispatch`. It does **not** bump versions or push source changes to `main` — version bumps land on `main` through ordinary human-authored pull requests (for example, by running `npm run bump` locally and opening a PR). The cron is scheduled ~1 hour before the Azure CD pipeline (09:00 UTC) so any GitHub releases this job creates are picked up by that same night's publish run. The workflow has two jobs:
  1. **`detect`** — checks out `main` with `fetch-depth: 0` and runs [`build/scripts/create-github-releases.mjs --check-only`](../../build/scripts/create-github-releases.mjs). The script walks the workspaces tree (no `npm ci` required), computes `${name}_v${version}` for every non-private workspace, and emits `hasMissingReleases=true` if any of those git tags do not yet exist.
  2. **`release`** runs only when missing releases exist. Installs Node, the Rust toolchain (for `cargo package`), and the npm workspace dependencies, builds the repo, then runs the script in default mode. For every missing release the script: packs the npm tarball into `publish_artifacts_npm/`, packs the paired Rust crate (if `crates/<crate-name>/Cargo.toml` exists) into `publish_artifacts_crates/`, and creates the GitHub release with both assets attached via `gh release create --target <sha>`. The `gh` CLI creates the git tag atomically with the release, so "tag exists" and "release exists" are always the same fact — a failed release is safely retried on the next workflow run, with no orphan tag stranded behind. The script errors if a paired crate's version does not match the npm package's version — but this is purely a safety net: the [`postbump` hook in `beachball.config.js`](../../beachball.config.js) rewrites the crate's `Cargo.toml` (and the matching entry in `Cargo.lock`) automatically whenever `npm run bump` bumps the paired npm package, so the two stay in sync from the same commit.
- **`azure-pipelines-cd.yml`** (Azure Pipelines) runs every night at **1am PST (`0 9 * * *` UTC)** with `always: true` so it still runs on no-op nights (it is checking external GitHub state, not repo commits). It is split into two stages so the heavy publish work is skipped on no-op nights:
  1. **`Check`** — runs [`build/scripts/download-github-releases.mjs --check-only`](../../build/scripts/download-github-releases.mjs). The script walks the current publishable workspaces, keeps only workspaces whose current `${name}_v${version}` release tag exists, filters out tags that already have a `deployed/<tag>` counterpart, derives the npm dist-tag (`latest` by default, or `rc-<date>` from FAST Element v3 RC companion versions), derives any package-specific tag overrides (FAST Element v3 RC publishes under `rc`), and emits Azure Pipelines output variables for the overall deployment decision plus each package-specific release tag. No network calls to GitHub, npm, or crates.io are needed.
  2. **`Package`** — depends on `Check` and runs only when `needsDeployment == 'true'`. Conditional `DownloadGitHubRelease@0` tasks download undeployed release assets through the `fast` GitHub service connection, a shell step sorts them into `publish_artifacts_npm/` (`.tgz`) and `publish_artifacts_crates/` (`.crate`), configures npm to publish companion packages with the detected dist-tag, then `FAST.Release.PipelineTemplate.yml@fastPipelines` performs the actual `npm publish` / `cargo publish`. If needed, a follow-up step corrects package-specific npm dist-tags such as `@microsoft/fast-element` v3 RC's `rc` tag. On success, the pipeline pushes a `deployed/<tag>` git marker tag for each release that was just published. The next nightly run will see those markers and skip the corresponding releases.

Both scripts are thin Node.js wrappers around existing CLI tools and repository metadata — no extra npm dependencies and no custom GitHub API client. Idempotency is enforced entirely through git tags (`${name}_v${version}` on the GitHub side, `deployed/${name}_v${version}` on the Azure side), so neither side needs to talk to npm.org or crates.io to decide whether work is required.

The `releases/fast-element-v3-rc` branch is npm-only for paired artifacts: the `microsoft-fast-build` Rust crate is not packaged or published from that RC branch. The release scripts detect that branch automatically and skip paired crate validation/packaging; local previews can request the same behavior with `FAST_RELEASE_SKIP_CRATES=true`. This is temporary RC-only logic tracked by [issue #7595](https://github.com/microsoft/fast/issues/7595). Before merging the RC branch back to `main` after FAST Element 3.x stable, remove the crate-skip behavior and related finalizer workflow from [PR #7594](https://github.com/microsoft/fast/pull/7594), cross-checking the RC baseline/prep work in [PR #7591](https://github.com/microsoft/fast/pull/7591).

### Adding a publishable package

`cd-github-releases.yml` discovers publishable workspaces automatically from the root `package.json` `workspaces` list, but `azure-pipelines-cd.yml` must be updated because Azure Pipelines cannot create `DownloadGitHubRelease@0` tasks dynamically from the runtime detection output.

The `npm run checkchange` command runs `build/scripts/check-publish-pipeline.mjs` to verify that every non-private workspace has matching Azure CD variables and a conditional `DownloadGitHubRelease@0` task. This guardrail runs in PR validation and fails when a new publishable package is added without updating the publish pipeline.

When adding a new non-private workspace that should publish through CD:

1. Ensure the workspace is included in the root `package.json` `workspaces` list and has a `name` and `version`.
2. If the package has a paired crate, place it at `crates/<crate-name>/Cargo.toml`, where `<crate-name>` is the npm package name with the leading `@` removed and `/` replaced by `-`. For example, `@microsoft/fast-build` pairs with `crates/microsoft-fast-build/Cargo.toml`.
3. Add package-specific output variables to the `Package` stage in `azure-pipelines-cd.yml`. The output prefix is generated from the npm package name by converting `@microsoft/<name>` to camel case. For example, `@microsoft/fast-foo` emits `fastFooNeedsDeployment` and `fastFooReleaseTag`.
4. Add a conditional `DownloadGitHubRelease@0` task for the package using the `fast` GitHub service connection, `defaultVersionType: 'specificTag'`, and the package's `$(<prefix>ReleaseTag)` variable.
5. Confirm the artifact sorting step still covers the package assets. Packages should attach `.tgz` assets, and paired crates should also attach `.crate` assets.

Example Azure additions for `@microsoft/fast-foo`:

```yml
variables:
  fastFooNeedsDeployment: $[ stageDependencies.Check.CheckVersion.outputs['deploymentCheck.fastFooNeedsDeployment'] ]
  fastFooReleaseTag: $[ stageDependencies.Check.CheckVersion.outputs['deploymentCheck.fastFooReleaseTag'] ]

steps:
- task: DownloadGitHubRelease@0
  displayName: "Download @microsoft/fast-foo release assets"
  condition: and(succeeded(), eq(variables['fastFooNeedsDeployment'], 'true'))
  inputs:
    connection: fast
    userRepository: microsoft/fast
    defaultVersionType: 'specificTag'
    version: '$(fastFooReleaseTag)'
    downloadPath: '$(System.ArtifactsDirectory)'
```