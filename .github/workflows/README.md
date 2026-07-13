# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

## Draft Pull Requests

All CI workflows that run against pull requests are configured to skip draft PRs:

- **GitHub Actions** (`ci-validate-pr.yml`, `ci-validate-platforms.yml`, `ci-validate-rust.yml`): The `pull_request` trigger includes `ready_for_review` in its event types, and each job has a condition that skips execution when the PR is a draft. When a draft PR is marked as ready for review, the workflows will automatically trigger.
- **Azure Pipelines** (`azure-pipelines-bench.yml`, `azure-pipelines-ci.yml`): The `pr` trigger uses `drafts: false` to prevent pipeline runs on draft PRs.

## Documentation-only Pull Requests

A pull request that only edits prose cannot change a build or test outcome, so CI skips the expensive work for it. [`build/scripts/classify-changed-files.mjs`](../../build/scripts/classify-changed-files.mjs) is the single source of truth for that decision. It reads the pull request's changed files and emits two flags, both inverted so that anything it cannot classify runs the full pipeline:

| Flag | Meaning |
| --- | --- |
| `docs_only` | Every changed file is prose: markdown, `LICENSE`, or a beachball change file. There is nothing to test. |
| `lage_noop` | Every changed file is also ignored by `lage.config.js`, so `lage build --since` would map them to no package and build nothing. Implies `docs_only`. |

Two rules keep this honest, and both are covered by `npm run test:node -w @microsoft/fast-build-tools`:

- **Generated markdown is not prose.** `*.api.md`, `SIZES.md`, `export-sizes.md`, `path-exports.md`, `CHANGELOG.md` and `sites/website/src/docs/<N>.x/api/**` are machine-written. Only `lage build` followed by `test:validation` can prove they are current, so a pull request that touches one runs the full pipeline.
- **Prose inside a workspace still builds.** `lage.config.js` ignores root-level `*.md` only, so markdown under `packages/<name>/docs` or `sites/website` still maps to a package. Those pull requests skip the tests but keep the build and `test:validation`, which is what proves the 11ty site and the generated API docs still build.

The three pipelines gate on the result at different levels, and the level is not a matter of taste:

- **`ci-validate-pr.yml`** — always runs, and gates individual steps. `checkchange` and `biome:ci` must run on every pull request, including a documentation change inside a package, which still needs a change file.
- **`ci-validate-platforms.yml`**, **`ci-validate-rust.yml`** — a `classify` job gates the real job with `needs` + `if`. Neither runs `checkchange`, so both are safe to skip outright, but they are *not* skipped with `paths-ignore`: [a workflow that a path filter skips never reports a conclusion](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks), so if either is a required check, `paths-ignore` would leave it pending and the documentation pull request could never merge. A job skipped by an `if:` condition reports success instead, so gating one level down takes the whole saving with no such trap.
- **`azure-pipelines-ci.yml`** — `paths.exclude` under the `pr` trigger, so the pipeline does not run at all. Azure Pipelines *does* [post a neutral status back to GitHub](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/github#paths) when a path exclusion skips a validation build, so it has none of the required-check problem above.

## Continuous Deployment

Nightly publishing is split into two coordinated jobs so that npm credentials never leave the Azure environment. GitHub Releases are the source of truth, and `deployed/<tag>` git marker tags track which releases have already been published.

- **`cd-github-releases.yml`** (GitHub Actions) runs nightly via cron (`0 8 * * *` UTC, ~12am PST) and on `workflow_dispatch`. It does **not** bump versions or push source changes to `main` — version bumps land on `main` through ordinary human-authored pull requests (for example, by running `npm run bump` locally and opening a PR). The cron is scheduled ~1 hour before the Azure CD pipeline (09:00 UTC) so any GitHub releases this job creates are picked up by that same night's publish run. The workflow has two jobs:
  1. **`detect`** — checks out `main` with `fetch-depth: 0` and runs [`build/scripts/create-github-releases.mjs --check-only`](../../build/scripts/create-github-releases.mjs). The script walks the workspaces tree (no `npm ci` required), computes `${name}_v${version}` for every non-private workspace, and emits `hasMissingReleases=true` if any of those git tags do not yet exist.
  2. **`release`** runs only when missing releases exist. Installs Node, the Rust toolchain (for `cargo package`), and the npm workspace dependencies, builds the repo, then runs the script in default mode. For every missing release the script: packs the npm tarball into `publish_artifacts_npm/`, packs any paired Rust crates into `publish_artifacts_crates/`, and creates the GitHub release with all assets attached via `gh release create --target <sha>`. `@microsoft/fast-build` is a bundled release: it uses one npm package, one tag, and one GitHub release containing both `microsoft-fast-build` and `microsoft-fast-convert` crate assets. The `gh` CLI creates the git tag atomically with the release, so "tag exists" and "release exists" are always the same fact — a failed release is safely retried on the next workflow run, with no orphan tag stranded behind. The script errors if a paired crate's version does not match the npm package's version — but this is purely a safety net: the [`postbump` hook in `beachball.config.js`](../../beachball.config.js) rewrites each crate's `Cargo.toml` (and the matching entry in `Cargo.lock`) automatically whenever `npm run bump` bumps the paired npm package, so they stay in sync from the same commit.
- **`azure-pipelines-cd.yml`** (Azure Pipelines) runs every night at **1am PST (`0 9 * * *` UTC)** with `always: true` so it still runs on no-op nights (it is checking external GitHub state, not repo commits). It is split into two stages so the heavy publish work is skipped on no-op nights:
  1. **`Check`** — runs [`build/scripts/download-github-releases.mjs --check-only`](../../build/scripts/download-github-releases.mjs). The script walks the current publishable workspaces, keeps only workspaces whose current `${name}_v${version}` release tag exists, filters out tags that already have a `deployed/<tag>` counterpart, and emits Azure Pipelines output variables for the overall deployment decision, npm dist-tag, and each package-specific release tag. No network calls to GitHub, npm, or crates.io are needed.
  2. **`Package`** — depends on `Check` and runs only when `needsDeployment == 'true'`. Conditional `DownloadGitHubRelease@0` tasks download undeployed release assets through the `fast` GitHub service connection, a shell step sorts them into `publish_artifacts_npm/` (`.tgz`) and `publish_artifacts_crates/` (`.crate`), configures npm to publish companion packages with the detected dist-tag, then `FAST.Release.PipelineTemplate.yml@fastPipelines` performs the actual `npm publish` / `cargo publish`. On success, the pipeline pushes a `deployed/<tag>` git marker tag for each release that was just published. The next nightly run will see those markers and skip the corresponding releases.

Both scripts are thin Node.js wrappers around existing CLI tools and repository metadata — no extra npm dependencies and no custom GitHub API client. Idempotency is enforced entirely through git tags (`${name}_v${version}` on the GitHub side, `deployed/${name}_v${version}` on the Azure side), so neither side needs to talk to npm.org or crates.io to decide whether work is required.

### Adding a publishable package

`cd-github-releases.yml` discovers publishable workspaces automatically from the root `package.json` `workspaces` list, but `azure-pipelines-cd.yml` must be updated because Azure Pipelines cannot create `DownloadGitHubRelease@0` tasks dynamically from the runtime detection output.

The `npm run checkchange` command runs `build/scripts/check-publish-pipeline.mjs` to verify that every non-private workspace has matching Azure CD variables and a conditional `DownloadGitHubRelease@0` task. This guardrail runs in PR validation and fails when a new publishable package is added without updating the publish pipeline.

When adding a new non-private workspace that should publish through CD:

1. Ensure the workspace is included in the root `package.json` `workspaces` list and has a `name` and `version`.
2. If the package has paired crate assets, place each crate at `crates/<crate-name>/Cargo.toml`. By default, `<crate-name>` is the npm package name with the leading `@` removed and `/` replaced by `-`. `@microsoft/fast-build` is the special bundled release and pairs with both `crates/microsoft-fast-build/Cargo.toml` and `crates/microsoft-fast-convert/Cargo.toml`.
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