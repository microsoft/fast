# FAST build tools

This private npm workspace contains the monorepo's cleaning, Biome, change-file,
and publishing utilities. Run commands from the monorepo root.

```bash
npm run test:node -w @microsoft/fast-build-tools
node build/scripts/create-github-releases.mjs --check-only
GITHUB_REPOSITORY=microsoft/fast node build/scripts/download-github-releases.mjs --check-only
```

The Node tests use temporary local repositories, real npm tarballs, offline
Rust crate fixtures, and mocked registry responses. They do not publish packages
or create GitHub Releases.

## Ordinary releases

Follow [CONTRIBUTING.md](../CONTRIBUTING.md#publishing) to prepare a version-bump
PR. The GitHub workflow creates release assets, and the nightly Azure pipeline
publishes them. Only use the scripts' `--check-only` mode for local previews;
running `create-github-releases.mjs` without it creates GitHub Releases.

## Version-specific hotfixes

Hotfixes use [azure-pipelines-hotfix.yml](../azure-pipelines-hotfix.yml). They
**never create or download GitHub Releases**. The pipeline builds a reviewed
source tag, transfers its tarballs through an Azure pipeline artifact, and
publishes through a governed ESRP release job.

### Prepare the source

Start a maintenance branch, such as `releases/fast-element-3.0`, from the exact
published package tag. Backport only the reviewed fixes and necessary
compatibility adjustments. Include regression tests for that version's behavior.
Use separate reviewed code/change-file and metadata-only bump PRs, as for
ordinary releases, targeting the maintenance branch rather than `main`.
Configure Beachball's branch comparison for that maintenance branch, and scope
the bump to the selected package. Include the lockfile and changelog updates.

The new version must be unused, newer than the base, and on the same major/minor
line. Package versions are immutable. A prerelease version is allowed, but it
must have greater SemVer precedence than the base; `3.0.3-hotfix.1` is **older**
than `3.0.3`. Prereleases also require explicit consumer opt-in.

After review, a maintainer creates an immutable tag at the approved commit:

```text
Base:       @microsoft/fast-element_v3.0.4
Hotfix:     hotfix/@microsoft/fast-element_v3.0.5
Completion: deployed/hotfix/@microsoft/fast-element_v3.0.5
```

These are examples, not version reservations. Verify availability before
choosing a version. The base must have a matching `deployed/<base-tag>` marker.
A subsequent hotfix can instead use a previously deployed `hotfix/` tag as its
base. Never move an existing tag.

To publish code from a particular branch, create the hotfix tag at that branch's
reviewed commit, including its version bump. For example, replace
`REVIEWED_COMMIT_SHA` with the approved commit from `releases/fast-element-3.0`:

```bash
git tag "hotfix/@microsoft/fast-element_v3.0.5" REVIEWED_COMMIT_SHA
git push origin "refs/tags/hotfix/@microsoft/fast-element_v3.0.5"
```

The source branch does not need to be merged into `main`. The tag pins its exact
commit; later commits on the branch do not change what the pipeline builds.

Do not create the ordinary `@microsoft/fast-element_v3.0.5` tag or a GitHub
Release. Do not merge the maintenance branch's version metadata into `main`.
Forward-port code fixes separately when they are not already on `main`.
Both ordinary release scripts exclude a version reserved by a `hotfix/` tag or
its deployment marker, even if that version or an ordinary tag accidentally
appears on `main`.

### Run the pipeline

Select the pipeline definition from `main`, then supply:

| Parameter | Example | Meaning |
| --- | --- | --- |
| `baseTag` | `@microsoft/fast-element_v3.0.4` | Exact published baseline |
| `hotfixTag` | `hotfix/@microsoft/fast-element_v3.0.5` | Reviewed source and new version |

Every new, valid, approved run publishes; there is no build-only switch.
Azure's branch selector chooses the pipeline definition and tooling, so keep it
on `main`. The `hotfixTag` parameter selects the package source independently.

The build resolves both tags to commits and verifies their ancestry and package
manifests. It installs the historical snapshot's dependencies using `npm ci`,
builds the selected workspace and its dependencies, and runs that workspace's
Node and browser suites. The snapshot must support the npm-workspace/Lage build
and test commands used by this pipeline; it does not retrofit older toolchains.
An already-completed hotfix skips the build and publication.

The `fast-hotfix-inputs` artifact contains only the selected npm tarball, any
paired crate archives, verification tooling, and a provenance/checksum manifest.
FAST Build includes both `microsoft-fast-build` and `microsoft-fast-convert` when
present in the selected source; their versions must match the npm package.
The `FAST_RELEASE_SKIP_CRATES` escape hatch does not apply to hotfixes.

Publication is manual and `main`-only. Its npm channel is derived, not supplied:
`hotfix-<major>.<minor>`, such as `hotfix-3.0`. The ESRP task receives that channel
through its **`productstate` input**; `.npmrc` alone does not configure ESRP.
An archived `publishConfig.tag` cannot override the maintenance channel, and
`publishConfig.registry` must not redirect publication to another registry.
The job requires every selected version to be unused, rejects backward channel
movement, and refuses to mark a hotfix that unexpectedly becomes npm's `latest`.
Publication uses the original artifact folders directly; there is no automatic
recovery of partially published npm/crate batches.

Consumers pinned to the original version must update their dependency. A
maintenance dist-tag does not constrain existing SemVer dependency ranges.

### Activation and permissions

Before enabling real publication, a human administrator must:

1. Register `azure-pipelines-hotfix.yml` as a **manual** production pipeline and
   authorize the existing official template, pool, and repository resources.
2. Create/authorize the `fast-hotfix-publishing` variable group with `clientId`,
   `keyvault`, `tenantId`, `releaseOwners`, and `releaseApprovers`, using the
   approved ESRP service connection, signing identity, and release approvers.
   Keep credential values in Azure, not source control.
3. Apply branch-control checks requiring `main`, release approvals, and an
   exclusive lock to the protected publishing resources. `lockBehavior:
   sequential` only serializes runs when an exclusive-lock check is configured.
   Use a dedicated hotfix publishing connection/identity where required by
   local governance; serialize every run that can update the same channel.
4. Restrict creation/deletion of all tags in the `hotfix/` and
   `deployed/hotfix/` namespaces, including the slash in scoped package names.
   Source tags are maintainer-owned; the pipeline identity needs permission to
   create completion markers. Do not grant the build job persistent Git
   credentials or registry credentials.
5. Confirm the governed release job can read public npm and crates.io metadata.
   A timeout, authentication error, or unavailable registry fails closed.
   Validate the YAML with Azure's preview API and review the built artifact
   before approving the first publication. Queuing a run requests publication,
   not a dry run.

Adding this YAML does not register a pipeline, change permissions, create a
variable group, or publish anything.

### Recovery

If publication fails, retain the original artifact and inspect the ESRP result
and every selected npm/crate version before taking further action. A missing
deployment marker does not mean nothing was published. Preflight rejects any
existing version, including identical bytes: do not rerun the release job to
automatically resume a partial batch or rebuild archives for an existing version.

After ESRP completes, the job waits for registry visibility, verifies every
archive, and requires the maintenance channel to identify this exact version.
Only then can the marker job push `deployed/<hotfix-tag>` at the built source SHA.
If registry verification or the
marker push fails, retain the artifact and investigate; do not force tags,
ignore checksum conflicts, or mark an unverified release successful. A failed
marker-only job can be retried after the original deployment was verified.

Partial publication or a missing/incorrect maintenance channel requires an
approved manual recovery using the retained artifact and registry checksums.
The pipeline does not silently skip versions, republish, or repair dist-tags.
