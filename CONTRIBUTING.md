# Contributing to FAST

## Getting started

To submit changes to FAST, the first step is to build the monorepo which requires the following to be setup:

- Sync down a copy of the fast repository
- Install Node.js version 22+ (run `node --version`) and npm version 10+ (run `npm --version`) which can be downloaded from https://nodejs.org/en/download/

From the `fast` directory:

1. Run `npm install`
2. Run `npm run build`

## Pull request policies

Each pull request should add a small increment of high-quality well-tested value to FAST. To keep PRs small you can add functionality incrementally but each PR should contain appropriate tests for the functionality being added and shouldn't introduce technical debt to be fixed later.

### Beachball change file

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:

1. Every pull request that affects a published package must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
2. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json files, and create git tags for the updated package versions.
3. A pipeline will run for each newly created git tag and invoke the `npm run publish` command for the associated package.

When generating a change file, follow these guidelines:
1. Follow [semantic versioning](https://semver.org) when choosing the change type.
2. Write a brief but useful description with clients in mind. If making a major (breaking) change, explain what clients need to do to adopt it. The description can be plain text or [markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), with newlines specified via `\n` if needed.
3. If you prefer not to expose your email address to the world, [configure GitHub to "Keep my email address private"](https://github.com/settings/emails) before generating the change file.

#### Recovering from a failed beachball publish

If a beachball publish command fails on the pipeline so packages are partially published, perform the following steps to get the repo in a good state:

1. Create a branch from main which should still have change files from the failed publish and, if applicable, fix the underlying issue in the branch.
2. In the repo root run `npm run sync`. Beachball will:
    - Find the latest packages that were published successfully to npm.
    - Update the `package.json` for each of those packages to align with the latest published version. It also handles cross-dependencies.
3. Commit the changes from `npm run sync` and run `npm run change` for those changes.
4. Submit a PR for the branch and merge.

## Handling intermittent test failures

Intermittent test failures can be a huge drain on productivity as they can cause unrelated failures in builds and block merging PRs or creating releases. The general policy is that intermittent failures that can fail a build should be addressed in main immediately.

Some resolutions for an intermittent test are:

1. Immediately submit a PR to address the underlying issue causing the failure. This can be done if the change can be approved and merged by the end of the day that the issue was discovered and if there is high confidence in the change.
2. If the underlying issue is not well-known or the fix does not give high confidence in resolving the intermittent test then the test should be disabled with `xit` and a tech debt issue created to handle the intermittent test. The disabled test should include a comment linking to the corresponding issue. Then the new issue itself must be handled as follows.

### Handling new intermittent test tech debt issues

The policy is that intermittent test tech debt issues should be actively assigned and worked on. Intermittent tests should not be disabled and allowed to be unaddressed for extended periods of time.

Some ways to make progress on an intermittent test tech debt issue are:

1. In a branch a developer can try and re-enable the test and reproduce the failure by including additional logging, etc. Creating a PR is not necessary to queue a build in this repo; every commit has an associated build and will re-run the tests.
2. If the failure is too intermittent to detect by manually queuing builds in a branch and needs additional logging and executions in main, then modify the test so that it will not fail the test suite and add the additional logging needed to make it run in main. Actively monitor the change and have a pre-defined date to disable the test and re-evaluate how to handle the issue.
