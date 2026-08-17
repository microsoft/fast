# Azure release pipelines

FAST release publishing is owned by two Azure Pipelines:

- **`FAST - CD Build`** uses
  [`azure-pipelines-build.yml`](./azure-pipelines-build.yml). It selects pending
  package versions, builds and packs their npm and Rust crate assets, and publishes
  pipeline artifacts.
- **`FAST - CD`** uses [`azure-pipelines-cd.yml`](./azure-pipelines-cd.yml). It
  validates the selected build, creates release tags, publishes npm and crate assets,
  records deployment markers, and creates GitHub Releases.

Both pipelines install Node 24. `FAST - CD` extends the 1ES Official pipeline template,
and release credentials remain in Azure.

## Build and selection handoff

FAST is multi-package. Every non-private npm workspace has an independent
`${name}_v${version}` release tag, matching beachball's tag format. A package is pending
when that tag does not exist on `origin`.

`FAST - CD Build` runs on pushes to `main`:

1. `PrepareRelease` runs
   [`prepare-release-artifacts.mjs --check-only`](../../build/scripts/prepare-release-artifacts.mjs)
   without requiring `npm ci`. It emits `shouldBuild` and the exact selected tags as a
   strict comma-separated `selectedReleaseTags` value.
2. Azure passes that value to the packing stage as `SELECTED_RELEASE_TAGS`. Packing
   rejects a missing or empty value, empty entries, surrounding whitespace, duplicate
   tags, unknown tags, and release-tag definitions containing commas. It preserves the
   selected order and never infers a replacement batch.
3. In normal mode, packing rechecks every selected tag on `origin` immediately before
   packing and reports every conflict if another release created a tag after selection.
   This prevents a race from silently shrinking the batch. Validation mode permits
   existing tags while still packing exactly the handed-off selection.

Packing attempts every selected package and reports all npm or crate failures. The
diagnostic manifest contains only assets that were packed and hashed successfully, and
the packing step fails afterward so Azure does not upload or publish a partial batch.

The pipeline uses distinct compile-time stage names: normal mode runs
`BuildArtifacts`; validation mode runs `ValidateArtifacts`. Only a completed
`BuildArtifacts` stage on `main` triggers `FAST - CD`. A validation build or a skipped
stage therefore cannot start publication.

## Artifacts and integrity contract

The shared [`pack-release-steps.yml`](./templates/pack-release-steps.yml) template
installs npm dependencies, Rust, and `wasm-pack`, builds the repository, and packs the
selected releases. It publishes:

- `npm_packages` from `publish_artifacts_npm/`
- `crate_packages` from `publish_artifacts_crates/`
- `release-metadata`, containing `release-manifest.json`

Manifest schema version 1 records `sourceCommit`, `sourceBranch`, validation mode, and
each selected package's name, version, release tag, `outputPrefix`, npm asset filename
and SHA-256, and paired crate asset filenames and SHA-256 values. The
[`validate-release-artifacts.mjs`](../../build/scripts/validate-release-artifacts.mjs)
validator
accepts only the exact supported schema, requires safe unique filenames and output
prefixes, verifies every required file's exact hash, and rejects missing, modified,
unexpected, or nested files. It also requires the manifest's source commit and branch
to match the selected pipeline resource; production runs require `sourceBranch` to be
`refs/heads/main`.

When a batch has no crate assets, the build writes `.no-crates-packed` so Azure can
transport the otherwise-empty artifact. The placeholder is not a manifest asset and is
removed before publication. `@microsoft/fast-build` remains one npm release and one tag
with the paired `microsoft-fast-build` and `microsoft-fast-convert` crate assets.
Packing rejects npm/crate version drift; the beachball `postbump` hook normally keeps
those versions synchronized.

Pipeline checkouts are clean and shallow with automatic tag fetching disabled.
Credentials persist only where selection, packing, release-tag creation, or
deployment-marker creation must query or update remote refs. Those operations use
exact remote queries and targeted fetches instead of downloading full tag history.

## Run-number count

`<count>` always means the number of package entries selected for the manifest, not the
number of npm or crate files:

- Build: `<count>-build-<Build.BuildId>`
- CD: `<count>-cd-<Build.BuildId>`

The build number is set after selection, including `0-build-...` runs and validation
runs. CD sets its number from the validated manifest count.

## Validation mode

Both pipelines expose a queue-time `validationMode` parameter, defaulting to `false`.
To validate end to end:

1. Run `FAST - CD Build` manually with `validationMode: true`.
2. Run `FAST - CD` manually with `validationMode: true` and select that build as the
   `releaseBuild` resource.

The build includes already-tagged workspaces. CD validates the selected build's commit,
mode, manifest, and assets, but does not create tags, publish packages, add deployment
markers, or create GitHub Releases.

## Publication, markers, and reruns

Normal CD runs create annotated release tags from the validated manifest's
comma-separated tag list at the validated commit before registry publication. Existing
or concurrently-created tags are accepted only when they resolve to that commit.
[`manage-release-tags.mjs`](../../build/scripts/manage-release-tags.mjs) owns the shared
release-tag and deployment-marker operations. The publish job passes both npm and crate
directories to one
`FAST.Release.PipelineTemplate.yml@fastPipelines` invocation.

After registry publication succeeds, the separate `MarkDeployed` job creates
`deployed/${name}_v${version}` marker tags from the same validated tag list. Before
creating each marker, it verifies that the release tag resolves to the validated commit.
Keeping markers in a dependent job allows marker retries without repeating registry
publication. A registry failure leaves the release tag but no deployment marker; after
diagnosing the failure, a maintainer must delete the affected release tag before
rebuilding and retrying that version.

`PublishGitHub` runs only after deployment markers succeed. It calls
[`check-github-releases.mjs`](../../build/scripts/check-github-releases.mjs) before the
per-package `GitHubRelease@1` tasks. The check uses bounded retry/backoff for transient
GitHub failures and considers a release complete only when every npm and crate filename
from the validated manifest is present. An incomplete or malformed release fails
explicitly for maintainer repair; on a partial job failure, rerunning the job skips only
complete GitHub Releases and retries missing releases.

## Adding a publishable package

Workspace and crate discovery, release tagging, and deployment markers are automatic,
but Azure cannot generate `GitHubRelease@1` tasks from runtime metadata. For each new
non-private workspace:

1. Add it to the root `package.json` workspaces and provide `name` and `version`.
2. Put paired crates in `crates/<crate-name>/Cargo.toml`. The default crate name removes
   the leading `@` and replaces `/` with `-`; add an explicit bundle mapping in
   [`release-workspaces.mjs`](../../build/scripts/release-workspaces.mjs)
   when one npm package owns multiple crates.
3. Add `<outputPrefix>Included`, `<outputPrefix>ReleaseTag`, and
   `<outputPrefix>ReleaseVersion` variables to `PublishRelease`.
4. Add a conditional `GitHubRelease@1` task using the **`fast`** GitHub service
   connection, `repositoryName: microsoft/fast`, the pre-created release tag, and exact
   versioned npm/crate asset filenames.

The Azure definitions must be registered with the exact names **`FAST - CD Build`** and
**`FAST - CD`**. Checkout credentials need permission to push release and deployment
tags, and the `fast` service connection needs permission to create releases in
`microsoft/fast`.
