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
  1. **`PrepareRelease`** runs [`build/scripts/pack-pending-releases.mjs --check-only`](../../build/scripts/pack-pending-releases.mjs), which walks the workspaces tree (no `npm ci` required), computes `${name}_v${version}` for every non-private workspace, and emits `shouldBuild=true` plus a JSON `selectedReleaseTags` output containing the exact tags whose releases should be built.
  2. **`BuildArtifacts`** (real releases, `validationMode: false`) or **`ValidateArtifacts`** (`validationMode: true`) runs only when `shouldBuild == 'true'`, using the shared [`templates/pack-release-steps.yml`](../../.ado/pipelines/templates/pack-release-steps.yml) step template. The selected tag output is passed through as `SELECTED_RELEASE_TAGS`; malformed, empty, duplicate, or unknown selections fail rather than changing the batch. Production packing immediately re-checks every selected tag on `origin` and fails with all conflicting tags if a concurrent release created any after selection. Validation mode expects existing tags and skips only that race check, while still packing the exact selection. The stage installs Node, the Rust toolchain and `wasm-pack` (needed by `@microsoft/fast-build`'s WASM build step), installs npm workspace dependencies, builds the repo (`npm run build`), then runs the same script in its default mode. For every selected workspace the script packs the npm tarball into `publish_artifacts_npm/`, packs any paired Rust crates into `publish_artifacts_crates/`, and writes schema-versioned `publish_artifacts_meta/release-manifest.json`. Schema version 1 records the release commit and each package's name, version, tag, output prefix, npm asset `{ fileName, sha256 }`, and crate asset array using the same filename/hash shape. If a release batch has no crate assets at all, the script writes a `.no-crates-packed` placeholder file into `publish_artifacts_crates/` so publishing and downloading that otherwise-empty pipeline artifact stays robust; the placeholder is never included as a manifest asset. `@microsoft/fast-build` is a bundled release: one npm package, one tag, and both `microsoft-fast-build` and `microsoft-fast-convert` crate assets. The script errors if a paired crate's version does not match the npm package's version — a safety net, since the [`postbump` hook in `beachball.config.js`](../../beachball.config.js) keeps them in sync automatically whenever `npm run bump` runs. The stage publishes `npm_packages`, `crate_packages`, and `release-metadata` (the manifest plus the `validationMode` used) as pipeline artifacts.

     `BuildArtifacts` and `ValidateArtifacts` are two distinct stage *names* (chosen at compile time via `${{ if eq(parameters.validationMode, ...) }}`), not one stage gated by a runtime condition. `FAST - CD`'s pipeline-resource trigger only fires when a stage literally named `BuildArtifacts` completes on `main`, so a `validationMode: true` run — which always executes under `ValidateArtifacts` instead — can never auto-trigger a real `FAST - CD` run. A skipped stage (e.g. nothing pending) does not fire that trigger either, since Azure Pipelines only triggers on stages that actually complete.
- **`FAST - CD`** (`azure-pipelines-cd.yml`) is an 1ES Official pipeline triggered automatically when `FAST - CD Build`'s `BuildArtifacts` stage completes on `main` (it can also be queued manually). It extends `1ES.Official.PipelineTemplate.yml` and runs:
  1. **`PrepareRelease`** — downloads the selected build pipeline resource's metadata and npm/crate artifacts, verifies that the metadata's `validationMode` matches the queued pipeline, and reads `release-manifest.json` via [`build/scripts/read-release-manifest.mjs`](../../build/scripts/read-release-manifest.mjs). The validator accepts only the supported schema, requires safe unique basenames, verifies every required file's exact SHA-256, and rejects unexpected files or directories. `.no-crates-packed` is ignored only when the manifest contains no crate assets. It also requires the manifest's formatted `releaseCommit` to exactly match `resources.pipeline.releaseBuild.sourceCommit`; production runs (`validationMode: false`) additionally require `resources.pipeline.releaseBuild.sourceBranch` to be `refs/heads/main`. These resource variables describe the exact run selected for automatic or manual CD queues. Only after these checks pass does the script emit one `<prefix>NeedsRelease` / `<prefix>ReleaseTag` / `<prefix>ReleaseVersion` output per currently-publishable workspace, plus the validated `releaseCommit`.
  2. **`TagRelease`** (skipped when `validationMode: true`) — creates an annotated `${name}_v${version}` tag at the manifest's validated `releaseCommit` for every package whose `<prefix>NeedsRelease` output is true. Each package task first fetches the remote tag: an existing tag is accepted only when it resolves to the expected commit. If a concurrent run wins the push race, the task fetches and validates the winner before succeeding.
  3. **`PublishRelease`** (skipped when `validationMode: true`) — depends directly on both `PrepareRelease` and `TagRelease`, then runs three ordered jobs:
     - **`Publish`** downloads both artifact folders, removes whichever one is empty (stripping the `.no-crates-packed` placeholder first), then hands both to a single invocation of `FAST.Release.PipelineTemplate.yml@fastPipelines`, which performs the actual `npm publish` / `cargo publish` for whichever asset types are present. Calling the release template once for both asset types means one destination succeeding while the other fails can never leave a package half-published without the whole job failing as one unit.
     - **`MarkDeployed`** (`dependsOn: Publish`, `condition: succeeded()`) creates a lightweight `deployed/${name}_v${version}` marker for every package whose `<prefix>NeedsRelease` value is true. Each marker points to the manifest's validated `releaseCommit`; an existing marker is accepted only at that commit, and concurrent push races are fetched and validated before the job succeeds. Keeping markers in their own job lets maintainers retry a partial marker failure without rerunning registry publication.
     - **`PublishGitHub`** (`dependsOn: MarkDeployed`, `condition: succeeded()`) runs only after registry publication and deployment-marker validation succeed. It first downloads the release metadata and runs [`build/scripts/check-github-releases.mjs`](../../build/scripts/check-github-releases.mjs), which freshly checks (via Node 22's global `fetch` against the public GitHub REST API `/repos/microsoft/fast/releases/tags/{tag}`) whether each package's GitHub Release already exists on `microsoft/fast` — independent of the `NeedsRelease` variables computed earlier, since those only reflect the state before `Publish` ran. HTTP 200 means release exists; 404 means not found; any other status/network/JSON error fails loudly. If `PublishGitHub` partially fails (e.g. one package's `GitHubRelease@1` task succeeds before another fails) and a maintainer reruns the failed job, Azure Pipelines reruns every task in the job, including those that already succeeded; the release-existence check lets each per-package `GitHubRelease@1` task skip packages whose release already exists on GitHub, so rerunning is safe. The tasks then create releases and attach assets to the pre-existing tags created by `TagRelease`, conditioned on both `NeedsRelease` and the GitHub release not already existing.

  The `${name}_v${version}` release tags reserve work before publication, while `deployed/${name}_v${version}` markers record successful registry deployment afterward. A registry publish failure leaves the release tag but no deployment marker; after diagnosing the failure, a maintainer must manually delete the affected release tag before rebuilding and retrying that version. A partial failure of the `PublishGitHub` job (one package's release successfully created before another failed) is recoverable by rerunning the job: already-created releases are skipped, and failed releases are retried. Deployment markers remain valid because registry publication already succeeded.

Release selection remains idempotent through `${name}_v${version}` tags, so nothing needs to talk to npm.org or crates.io to decide whether work is required. Deployment markers provide a separate, auditable record that the combined registry publication completed. `FAST - CD Build` runs use `<count>-build-<BuildId>`, where `count` comes from the pending package selection (or all publishable workspaces in `validationMode`). A no-pending `PrepareRelease` run is named `0-build-<BuildId>` and skips artifact construction. Downstream `FAST - CD` runs use `<count>-cd-<BuildId>`, with the count read from the release manifest produced by the build run.

The queue-time `validationMode` parameter (both pipelines) defaults to `false`; setting it to `true` treats every publishable workspace as pending so its artifact contract can be rebuilt and validated through `PrepareRelease`, without creating tags or publishing anywhere.

> **Note:** `FAST.Release.PipelineTemplate.yml` lives in the internal `open-source/FASTPipelineTemplates` Azure DevOps repository, which is not accessible from GitHub tooling. Its exact parameter contract (in particular how it handles an absent artifact directory) could not be independently verified while authoring this pipeline; the empty-directory removal step in the `Publish` job is a defense-in-depth measure taken because that contract could not be confirmed.

### Adding a publishable package

`pack-pending-releases.mjs` discovers publishable workspaces automatically from the root `package.json` `workspaces` list, but `.ado/pipelines/azure-pipelines-cd.yml` must be updated because Azure Pipelines cannot create `GitHubRelease@1` tasks dynamically from the runtime manifest.

When adding a new non-private workspace that should publish through CD:

1. Ensure the workspace is included in the root `package.json` `workspaces` list and has a `name` and `version`.
2. If the package has paired crate assets, place each crate at `crates/<crate-name>/Cargo.toml`. By default, `<crate-name>` is the npm package name with the leading `@` removed and `/` replaced by `-`. `@microsoft/fast-build` is the special bundled release and pairs with both `crates/microsoft-fast-build/Cargo.toml` and `crates/microsoft-fast-convert/Cargo.toml`.
3. Add the package's `NeedsRelease` and `ReleaseTag` output variables to `TagRelease`, plus a conditional annotated-tag task using the same fetch/validate/push/race handling as the existing package tasks. The output prefix is generated from the npm package name by converting `@microsoft/<name>` to camel case.
4. Add package-specific `NeedsRelease`, `ReleaseTag`, and `ReleaseVersion` output variables to `PublishRelease`, then add the package's `NeedsRelease` and `ReleaseTag` environment mappings and `mark_if_needed` call to the post-publication marker task.
5. Add a conditional `GitHubRelease@1` task for the package in the `PublishGitHub` job, using the `fast` GitHub service connection, `repositoryName: microsoft/fast`, `tagSource: userSpecifiedTag`, and the package's `$(<prefix>ReleaseTag)` variable. The task consumes the tag already created by `TagRelease` and is conditioned on both the package's `<prefix>NeedsRelease` and `releaseCheck.<prefix>GitHubReleaseExists` variables, so rerunning `PublishGitHub` after a partial failure skips packages whose releases already exist on GitHub.
6. Confirm the task's `assets` globs use the exact versioned filename per asset (`$(<prefix>ReleaseVersion)`, not a prefix wildcard) for the package's npm tarball and any paired crate archives, to avoid picking up a stale tarball left over from a previous packing attempt.

Example Azure additions for `@microsoft/fast-foo`:

TagRelease variables and task:

```yml
variables:
  fastFooNeedsRelease: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooNeedsRelease'] ]
  fastFooReleaseTag: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooReleaseTag'] ]

- task: Bash@3
  displayName: "Tag @microsoft/fast-foo release"
  condition: and(succeeded(), eq(variables['fastFooNeedsRelease'], 'true'))
  # Copy the complete idempotent annotated-tag implementation from an
  # existing package task in azure-pipelines-cd.yml.
```

PublishRelease variables and task:

```yml
variables:
  fastFooNeedsRelease: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooNeedsRelease'] ]
  fastFooReleaseTag: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooReleaseTag'] ]
  fastFooReleaseVersion: $[ stageDependencies.PrepareRelease.Validate.outputs['release.fastFooReleaseVersion'] ]

steps:
- task: GitHubRelease@1
  displayName: "Create @microsoft/fast-foo GitHub Release"
  condition: and(succeeded(), eq(variables['fastFooNeedsRelease'], 'true'), eq(variables['releaseCheck.fastFooGitHubReleaseExists'], 'false'))
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