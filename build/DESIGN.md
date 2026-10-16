# Build and publishing tools

The `@microsoft/fast-build-tools` workspace is private. Its Node utilities use
built-in modules and existing command-line tools rather than adding publishing
SDK dependencies.

## Release metadata

`scripts/release-metadata.mjs` centralizes workspace discovery, paired Cargo
manifest inspection, tag checks, and hotfix exclusion. Ordinary releases retain
their existing package tags and `deployed/` completion markers.
`create-github-releases.mjs` and `download-github-releases.mjs` both exclude a
package/version reserved by `hotfix/<package>_v<version>` or its deployment
marker. A hotfix is never a GitHub Release candidate, including when its version
accidentally reaches the default branch or an ordinary package tag is added.

## Hotfix provenance and isolation

`azure-pipelines-hotfix.yml` has no push, PR, or scheduled trigger. A manual run
selects an already-published baseline tag, a pushed non-main `hotfixBranch`,
and a reviewed `hotfix/` source tag at that branch's tip.
`scripts/hotfix-release.mjs` verifies:

- The package is a current non-private workspace with an agreeing tagged
  manifest, and its source descends from the baseline.
- The baseline's deployment marker identifies the same baseline commit.
- The hotfix uses a fresh, higher-precedence version on the same major/minor
  line and does not reuse an ordinary release tag.
- Any paired crates present in that source have the expected names and version.
- Existing completion markers agree with the selected source SHA.
- The requested branch is a valid Git branch name and is not `main` or a tag
  ref. For a new hotfix, its `origin` head must equal the source tag's commit.
  Local-only branches and remote lookup failures cannot fall back to `main`.

The pipeline definition/tooling comes from the pipeline checkout, while a
separate detached worktree contains the exact historical source. Publishing is
allowed only from a manual central-definition `main` run, never with `main` as
the hotfix package source, and every new valid run includes the
publishing stage, subject to protected-resource approvals. There is no
build-only parameter. The source SHA is resolved explicitly
from the hotfix tag, never from the pipeline checkout or `GITHUB_SHA`.
The mutable remote branch is checked only during initial planning. Packing,
registry verification, and deployment marking use the original pinned SHA and
revalidate the immutable tags, not the branch's later head. No publishing
infrastructure needs to be backported into the maintenance branch.
The historical worktree stays under `Build.SourcesDirectory` so it is within
the official pipeline's source-analysis tree.

The build job installs and tests the selected source without publishing
credentials. Packing disables npm lifecycle scripts, selects exactly one npm
workspace, and includes only its paired Rust archives. A versioned manifest
records the normalized source branch, both source commits, the pipeline commit,
archive identities, SHA-256 checksums, and npm SHA-512 integrity. Verification checks actual archive
manifests and rejects extra publication files and channel overrides. The
verifier scripts travel with the governed Azure artifact; there is no separate
self-checksum protocol for tooling or an artifact-local `.npmrc`.

## Governed artifact publication

The build uploads `fast-hotfix-inputs` through the official Azure pipeline
artifact mechanism. The checkout-free production `releaseJob` consumes that
declared artifact. No GitHub Release, GitHub release asset API, or download task
is involved, and no npm/crates credentials are exposed to the source build.
The job also compares the artifact's branch, tags, source SHAs, and tooling commit
with this run's parameters, planning outputs, and pipeline commit before submission.

`scripts/hotfix-registry.mjs` requires every selected npm/Rust version to be
unused before publication. A 404 means an unpublished version; all other
request errors stop publication. An existing version stops the job for manual
investigation, even when its bytes match. ESRP consumes the original archive
folders directly, without pending-asset copies or partial-publication recovery.

The maintenance npm channel is always `hotfix-<major>.<minor>`. ESRP receives it
explicitly through `productstate`, not an assumed local npm configuration.
The job refuses backward channel movement. Protected-resource approval,
branch-control, and exclusive-lock checks are part of activation and must
serialize publishers sharing a channel; YAML cannot install those checks.

ESRP failures remain failures. Post-publication verification waits for bounded
registry propagation, compares every archive, requires the maintenance channel
to identify this exact version, and rejects a hotfix owning `latest`. Only a strictly
successful, verified deployment allows the marker job to run. That job checks
both source tags again and creates `deployed/<hotfix-tag>` at the original
source SHA, never at the marker job's checkout.

Tags and registry writes cannot form one transaction. A partial publication,
moved source tag, changed registry bytes, unavailable registry, or incorrect
channel requires manual investigation. The pipeline does not skip existing
versions, repair channels, or automatically resume partial publication. Retain
the original immutable artifact as the reference for any approved recovery.

## Tests

The workspace's `test:node` script participates in the existing Lage Node test
tasks. Tests use isolated temporary Git repositories and local bare remotes,
real npm tarballs and offline Cargo archives, and mocked registry responses.
They cover source/tag/version checks, artifact integrity, paired crates,
unused-version preflight, scoped registry URL encoding, always-included publication
and central manual/main enforcement, non-main remote source selection, branch/tag
identity, pinning despite later branch movement, completion provenance, and
exclusion from both ordinary GitHub release paths.
