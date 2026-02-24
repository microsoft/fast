# Contributing Patterns for FAST

Use this guide when contributing changes to the FAST monorepo — creating pull requests, generating change files, and keeping documentation up to date.

# Pull requests

Use the repository's PR template at `.github/pull_request_template.md` as the basis for all pull request descriptions.

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
