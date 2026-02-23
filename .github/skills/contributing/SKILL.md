# Contributing Patterns for FAST

Use this guide when contributing changes to the FAST monorepo — creating pull requests, generating change files, and keeping documentation up to date.

# Pull requests

Use the repository's PR template at `.github/pull_request_template.md` as the basis for all pull request descriptions. Fill out each section:

- **Description** — Summarize the change, what problem it solves, and whether it is a feature, fix, chore, or breaking change.
- **Issues** — Link any related GitHub issues.
- **Reviewer Notes** — Call out areas for focused review or suggest a smoke test.
- **Test Plan** — Describe how the change was tested and any unique testing strategies.
- **Checklist** — Confirm each item before requesting review:
  - A change file has been generated (`npm run change`).
  - Tests have been added and pass.
  - Project documentation has been updated.
  - The [CONTRIBUTING](https://github.com/microsoft/fast/blob/main/CONTRIBUTING.md) guidelines and [standards](https://github.com/microsoft/fast/blob/main/CODE_OF_CONDUCT.md#our-standards) have been followed.
- **Next Steps** — Note any follow-up work.

# Change files

After completing a change to any package under `packages/`, generate a beachball change file:

```bash
npm run change
```

This creates a change description file that is required for versioning and publishing. The CI gate `npm run checkchange` will fail if a change file is missing for a modified package.

# Documentation

Keep the website documentation in `sites/website/src/docs/` updated when making changes that affect public APIs, behavior, or usage patterns. The documentation is organized by version:

- `sites/website/src/docs/2.x/` — Current version documentation (getting started, guides, advanced topics, API reference).

When adding or modifying exported APIs, run the website prebuild script to regenerate API documentation from the api-extractor output:

```bash
npm run prebuild -w sites/website
```

This runs `scripts/generate-docs.cjs`, which copies API documentation from each package's extracted API reports into the website source. Run this after building packages to ensure generated documentation stays in sync with the codebase.
