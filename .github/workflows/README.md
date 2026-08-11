# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

## Draft Pull Requests

All CI workflows that run against pull requests are configured to skip draft PRs:

- **GitHub Actions** (`ci-validate-pr.yml`, `ci-validate-platforms.yml`, `ci-validate-rust.yml`): The `pull_request` trigger includes `ready_for_review` in its event types, and each job has a condition that skips execution when the PR is a draft. When a draft PR is marked as ready for review, the workflows will automatically trigger.
- **Azure Pipelines** (`.ado/pipelines/azure-pipelines-bench.yml`, `.ado/pipelines/azure-pipelines-ci.yml`): The `pr` trigger uses `drafts: false` to prevent pipeline runs on draft PRs.

## Continuous Deployment

Release publishing is owned entirely by two Azure Pipelines under [`.ado/pipelines/`](../../.ado/pipelines/) — `azure-pipelines-build.yml` (registered as **`FAST - CD Build`**) and `azure-pipelines-cd.yml` (registered as **`FAST - CD`**) — so release credentials never leave the Azure environment. There is no GitHub Actions release workflow: GitHub Releases are created by Azure, not by CI running on `pull_request`/`push` GitHub Actions triggers.

FAST is multi-package: unlike a single workspace-wide release version, each publishable npm workspace gets its own `${name}_v${version}` git tag (matching beachball's tag format), and "pending" is decided per package rather than for one selected version. A workspace is pending when its tag does not yet exist on `origin`.

- **`FAST - CD Build`** (`azure-pipelines-build.yml`) triggers on every push to `main`.
  1. **`PrepareRelease`** runs [`build/scripts/pack-pending-releases.mjs --check-only`](../../build/scripts/pack-pending-releases.mjs), which walks the workspaces tree (no `npm ci` required), computes `${name}_v${version}` for every non-private workspace, and emits `shouldBuild=true` if any of those git tags do not yet exist on `origin`.
  2. **`BuildArtifacts`** (real releases, `validationMode: false`) or **`ValidateArtifacts`** (`validationMode: true`) runs only when `shouldBuild == 'true'`, using the shared [`templates/pack-release-steps.yml`](../../.ado/pipelines/templates/pack-release-steps.yml) step template. It installs Node, the Rust toolchain and `wasm-pack` (needed by `@microsoft/fast-build`'s WASM build step), installs npm workspace dependencies, builds the repo (`npm run build`), then runs the same script in its default mode. For every pending workspace the script packs the npm tarball into `publish_artifacts_npm/`, packs any paired Rust crates into `publish_artifacts_crates/`, and writes `publish_artifacts_meta/release-manifest.json` describing exactly what was packed (name, version, tag, and asset filenames). If a release batch has no crate assets at all, the script writes a `.no-crates-packed` placeholder file into `publish_artifacts_crates/` so publishing and downloading that otherwise-empty pipeline artifact stays robust. `@microsoft/fast-build` is a bundled release: one npm package, one tag, and both `microsoft-fast-build` and `microsoft-fast-convert` crate assets. The script errors if a paired crate's version does not match the npm package's version — a safety net, since the [`postbump` hook in `beachball.config.js`](../../beachball.config.js) keeps them in sync automatically whenever `npm run bump` runs. The stage publishes `npm_packages`, `crate_packages`, and `release-metadata` (the manifest plus the `validationMode` used) as pipeline artifacts.

     `BuildArtifacts` and `ValidateArtifacts` are two distinct stage *names* (chosen at compile time via `${{ if eq(parameters.validationMode, ...) }}`), not one stage gated by a runtime condition. `FAST - CD`'s pipeline-resource trigger only fires when a stage literally named `BuildArtifacts` completes on `main`, so a `validationMode: true` run — which always executes under `ValidateArtifacts` instead — can never auto-trigger a real `FAST - CD` run. A skipped stage (e.g. nothing pending) does not fire that trigger either, since Azure Pipelines only triggers on stages that actually complete.
- **`FAST - CD`** (`azure-pipelines-cd.yml`) is an 1ES Official pipeline triggered automatically when `FAST - CD Build`'s `BuildArtifacts` stage completes on `main` (it can also be queued manually). It extends `1ES.Official.PipelineTemplate.yml` and runs:
  1. **`PrepareRelease`** — downloads the build pipeline's metadata and npm/crate artifacts, verifies that the metadata's `validationMode` matches the queued pipeline, and reads `release-manifest.json` via [`build/scripts/read-release-manifest.mjs`](../../build/scripts/read-release-manifest.mjs). The script emits one `<prefix>NeedsRelease` / `<prefix>ReleaseTag` / `<prefix>ReleaseVersion` output per currently-publishable workspace, plus a shared `releaseCommit`.
  2. **`PublishRelease`** (skipped when `validationMode: true`) — a single stage with two ordered jobs, deliberately publishing before tagging/releasing:
     - **`Publish`** downloads both artifact folders, removes whichever one is empty (stripping the `.no-crates-packed` placeholder first), then hands both to a single invocation of `FAST.Release.PipelineTemplate.yml@fastPipelines`, which performs the actual `npm publish` / `cargo publish` for whichever asset types are present. Calling the release template once for both asset types (rather than in two parallel jobs, one per asset type, as an earlier version of this pipeline did) means one destination succeeding while the other fails can never leave a package half-published without the whole job failing as one unit.
     - **`PublishGitHub`** (`dependsOn: Publish`, `condition: succeeded()`) runs strictly after `Publish` succeeds. It first runs [`build/scripts/check-release-tags.mjs`](../../build/scripts/check-release-tags.mjs), which freshly checks (via `git ls-remote origin`) whether each package's tag already exists — independent of the `NeedsRelease` variables computed earlier by `PrepareRelease`, since those only reflect the state before `Publish` ran. It then runs one `GitHubRelease@1` per package, conditioned on both that package's `NeedsRelease` variable *and* its tag not already existing (`releaseTagCheck.<prefix>ReleaseTagExists == 'false'`), using `tagSource: userSpecifiedTag` so the task itself creates the tag as part of creating the release.

  This publish-then-tag ordering is the key fix for the release tag's dual role: `pack-pending-releases.mjs` treats a workspace as "pending" purely based on whether its `${name}_v${version}` tag exists on `origin`, so whichever step creates that tag also makes the package invisible to every future release-prep run. An earlier version of this pipeline created the tag *before* publishing (via a dedicated `TagRelease` stage); a publish failure then left the tag behind, permanently stranding that package with no automatic retry. Creating the tag only after `Publish` succeeds means a publish failure never leaves the tag behind, so the very next `FAST - CD Build` run retries that package automatically — and the `releaseTagCheck` guard means rerunning a job that failed partway through `PublishGitHub` (Azure Pipelines reruns every task in a failed job, including ones that already succeeded) is also safe, since already-created releases are skipped rather than recreated.

  Residual risk: if `Publish` succeeds but `PublishGitHub` fails outright for a package (rather than a rerunnable partial failure), that package's tag still won't exist, so the next `FAST - CD Build` run will try to republish it — which fails loudly since it's already published (existing, documented idempotency behavior; see below). That is a bounded, always manually-recoverable state (a maintainer creates the missing tag/GitHub release directly), never a silent or permanent one, and was judged the safest trade-off achievable within a single `PublishRelease` stage.

Idempotency is enforced entirely through git tags (`${name}_v${version}`), so nothing needs to talk to npm.org or crates.io to decide whether work is required — republishing an already-published version simply fails loudly at the `npm publish` / `cargo publish` step, the same as a manual retry would.

The queue-time `validationMode` parameter (both pipelines) defaults to `false`; setting it to `true` treats every publishable workspace as pending so its artifact contract can be rebuilt and validated through `PrepareRelease`, without creating tags or publishing anywhere.

> **Note:** `FAST.Release.PipelineTemplate.yml` lives in the internal `open-source/FASTPipelineTemplates` Azure DevOps repository, which is not accessible from GitHub tooling. Its exact parameter contract (in particular how it handles an absent artifact directory) could not be independently verified while authoring this pipeline; the empty-directory removal step in the `Publish` job is a defense-in-depth measure taken because that contract could not be confirmed.

### Adding a publishable package

`pack-pending-releases.mjs` discovers publishable workspaces automatically from the root `package.json` `workspaces` list, but `.ado/pipelines/azure-pipelines-cd.yml` must be updated because Azure Pipelines cannot create `GitHubRelease@1` tasks dynamically from the runtime manifest.

The `npm run checkchange` command runs `build/scripts/check-publish-pipeline.mjs` to verify that every non-private workspace has matching `PublishRelease` stage variables and a conditional `GitHubRelease@1` task. This guardrail runs in PR validation and fails when a new publishable package is added without updating the publish pipeline.

When adding a new non-private workspace that should publish through CD:

1. Ensure the workspace is included in the root `package.json` `workspaces` list and has a `name` and `version`.
2. If the package has paired crate assets, place each crate at `crates/<crate-name>/Cargo.toml`. By default, `<crate-name>` is the npm package name with the leading `@` removed and `/` replaced by `-`. `@microsoft/fast-build` is the special bundled release and pairs with both `crates/microsoft-fast-build/Cargo.toml` and `crates/microsoft-fast-convert/Cargo.toml`.
3. Add package-specific output variables to the `PublishRelease` stage in `.ado/pipelines/azure-pipelines-cd.yml`. The output prefix is generated from the npm package name by converting `@microsoft/<name>` to camel case. For example, `@microsoft/fast-foo` emits `fastFooNeedsRelease`, `fastFooReleaseTag`, and `fastFooReleaseVersion`.
4. Add a conditional `GitHubRelease@1` task for the package in the `PublishGitHub` job, using the `fast` GitHub service connection, `repositoryName: microsoft/fast`, `tagSource: userSpecifiedTag`, and the package's `$(<prefix>ReleaseTag)` variable. The condition must include the `releaseTagCheck.<prefix>ReleaseTagExists` clause (in addition to `<prefix>NeedsRelease`) so rerunning the job after a partial failure is safe — see `check-release-tags.mjs`.
5. Confirm the task's `assets` globs use the exact versioned filename per asset (`$(<prefix>ReleaseVersion)`, not a prefix wildcard) for the package's npm tarball and any paired crate archives, to avoid picking up a stale tarball left over from a previous packing attempt.

Example Azure additions for `@microsoft/fast-foo`:

```yml
variables:
  fastFooNeedsRelease: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooNeedsRelease'] ]
  fastFooReleaseTag: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooReleaseTag'] ]
  fastFooReleaseVersion: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooReleaseVersion'] ]

steps:
- task: GitHubRelease@1
  displayName: "Create @microsoft/fast-foo GitHub Release"
  condition: and(succeeded(), eq(variables['fastFooNeedsRelease'], 'true'), eq(variables['releaseTagCheck.fastFooReleaseTagExists'], 'false'))
  inputs:
    gitHubConnection: fast
    repositoryName: microsoft/fast
    action: create
    target: $(releaseCommit)
    tagSource: userSpecifiedTag
    tag: $(fastFooReleaseTag)
    title: $(fastFooReleaseTag)
    releaseNotesSource: inline
    releaseNotesInline: "Automated FAST release for @microsoft/fast-foo@$(fastFooReleaseVersion)."
    addChangeLog: false
    assets: |
      $(Build.SourcesDirectory)/publish_artifacts_npm/microsoft-fast-foo-$(fastFooReleaseVersion).tgz
    assetUploadMode: replace
    isDraft: false
    isPreRelease: false
    makeLatest: legacy
```