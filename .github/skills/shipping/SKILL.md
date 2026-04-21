---
description: Use this skill when contributing changes to the FAST monorepo — creating pull requests, generating change files, writing PR descriptions, and keeping documentation up to date.
name: shipping
---

# Shipping Patterns for FAST

Use this guide when shipping changes in the FAST monorepo — writing PR descriptions, generating change files, and keeping documentation up to date.

# Guardrails

Do NOT perform any of the following actions autonomously. These require explicit human action:

- **Do not push branches** — no `git push`, `git push --force`, or any remote push operations.
- **Do not create pull requests** — no GitHub API calls, `gh pr create`, or MCP tools that create PRs.
- **Do not create or modify GitHub issues** — no `gh issue create`, issue comments, or label changes.
- **Do not merge or close pull requests** — no `gh pr merge`, `gh pr close`, or equivalent.
- **Do not publish packages** — no `npm publish`, `beachball publish`, or release operations.
- **Do not modify branch protection or repository settings**.

You may prepare all of these (e.g., draft a PR description, generate change files, stage commits) but the human must execute the final action.

## Key references

Read these documents for additional context when needed:

- [`.github/pull_request_template.md`](../../pull_request_template.md) — PR description template (source of truth for PR structure).
- [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) — Full contributor guide (machine setup, branching, governance).
- [`BRANCH_GUIDE.md`](../../../BRANCH_GUIDE.md) — Branch management conventions.
- [`beachball.config.js`](../../../beachball.config.js) — Beachball configuration (ignored patterns, publish settings).
- [`CODE_OF_CONDUCT.md`](../../../CODE_OF_CONDUCT.md) — Community standards.

### Package/Crate references

Read these documents, they are located at the root of the specific package or crate, e.g. `packages/<package>/<file>.md` and relate to the package/crates they are located in. When making changes in the package/crate afterwards update these files if necessary.

- `DESIGN.md` - Explains the code patterns.
- `README.md` - Explains how a developer/agent would use this package/crate.

# Commit and PR title conventions

Use [conventional commit](https://www.conventionalcommits.org/) format for PR titles and merge commit messages:

```
<type>: <short summary>
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`.

Examples:
- `feat: add shadow DOM support to fast-html parser`
- `fix: resolve memory leak in template binding`
- `chore: update dev dependencies`

# Pull requests

Use the repository's PR template at [`.github/pull_request_template.md`](../../pull_request_template.md) as the basis for all pull request descriptions.

Provide the markdown code block only, without any additional commentary or explanation.

The comments in the template can be removed since they're only meant to provide guidance on how to fill out the template, and are not intended to be part of the final PR description.

Fill out each section as detailed below.

## Description

The Description should be either a summary description of the content of the branch,
or a list of the most relevant changes made in the branch. The goal is to address
the purpose of the pull request in a concise manner, rather than detailing every change. "Why"
and "what" over "how".

## Issues

Determine if any current github issues are being addressed by this work, and
list them in the Issues section with links. If none are found, remove the Issues section.

## Reviewer Notes

The reviewer notes section is optional. Include it only if there are specific
areas where you would like feedback or attention from the reviewer.

## Test Plan

The Test Plan section should outline any issues that need to be verified before merging,
or steps to reproduce the behavior locally. Even a brief note is helpful, such as "All existing tests pass".

## Checklist

The checklist section should be completed to indicate the status of various
aspects of the pull request.

If there are change files that have been added to the PR, check the box labeled "I have included a change request file using `$ npm run change`".

If any new tests have been added, check the box labeled "I have added tests for my changes."

Check the terminal output for evidence of passing tests, and check the box labeled "I have tested my changes." if tests have been run and are passing. If not, leave the box unchecked.

If any doc blocks have been added or modified, or if any documentation files have been added or modified, check the box labeled "I have updated the project documentation to reflect my changes." This also applies to any changes made to api-report files.

The final checkbox must be checked by the pull request author. It should never be checked when generating this PR description.

## Next Steps

The Next Steps section is optional. Include it only if there are specific follow-up tasks
or work items that should be addressed after merging this PR, such as updating documentation, adding new tests, or performing code cleanup. If any existing issues are being addressed by the next steps, reference them here.

# Acceptance checklist

Before finishing any change, run these commands from the monorepo root and confirm they pass:

```bash
npm run build            # all packages build successfully
npm run test             # all tests pass
npm run format:check     # Prettier formatting is correct
npm run checkchange      # Beachball change files exist for packages/* changes
```

# Change files

After completing a change to any package under `packages/`, generate a Beachball change file:

```bash
# This should be run from the monorepo root
npm run change
```

This walks through the steps to create a change description file that is required for versioning and publishing. The CI gate `npm run checkchange` will fail if a change file is missing for a modified package.

## Change types

When prompted, select the appropriate change type:

| Type | When to use |
|---|---|
| `major` | Breaking changes to public API |
| `minor` | New features, non-breaking additions |
| `patch` | Bug fixes, minor corrections |
| `none` | Changes that don't affect the published package (tests, docs, tooling) |

## When change files are NOT required

The Beachball config ([`beachball.config.js`](../../../beachball.config.js)) ignores these paths — changes limited to them do not need change files:

- `.github/` — CI configs, templates, skills
- Test files (`src/e2e/`, `src/tests/`, `src/fixtures/`)
- `package-lock.json`
- `.vscode/`, `.prettierrc`

## Cross-branch targeting

When working across feature branches, target the branch explicitly:

```bash
npm run change -- --branch origin/{branch-name}
```

## Multiple unrelated changes

If addressing multiple unrelated issues, prefer separate pull requests.

# Breaking changes

When introducing breaking changes:

1. Select `major` as the change type when running `npm run change`.
2. Document the migration strategy in `packages/<package>/MIGRATION.md`.

Format for `MIGRATION.md`:

```md
# Migrating from previous versions

## v1 to v2

- Export `Foo` has been renamed to `Bar`.
- `Bat` has been updated to use the new API [`BatConfig`](link/to/api).
```

If the breaking change is significant or requires multiple PRs, open a [discussion](https://github.com/microsoft/fast/discussions) first.

# Documentation

After any changes ensure that the documentation is up to date, this includes the files DESIGN.md and README.md files for any packages/crates that have been modified. If your changes update or add to the public API, update the sites/website/src/docs/ files. Only update the latest version, these are denoted by major versions in their folder names inside the docs folder, 1.x, 2.x, etc., find the latest version of the docs and modify them if necessary.

When adding or modifying exported APIs, run the website prebuild script to regenerate API documentation from the api-extractor output:

```bash
npm run prebuild -w sites/website
```

This runs [`sites/website/scripts/generate-docs.cjs`](../../../sites/website/scripts/generate-docs.cjs), which copies API documentation from each package's extracted API reports into the website source. Run this after building packages to ensure generated documentation stays in sync with the codebase.
