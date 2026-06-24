# Contributing to FAST

## Getting started

### Machine setup

To work with the FAST [monorepo](https://en.wikipedia.org/wiki/Monorepo) you'll need Git, Node.js, Npm, Rust, and wasm-pack set up on your machine.

FAST uses Git as its source control system. If you haven't already installed it, you can download it [here](https://git-scm.com/downloads) or if you prefer a GUI-based approach, try [GitHub Desktop](https://desktop.github.com/).

Once Git is installed, you'll also need Node.js, which FAST uses as its JavaScript runtime, enabling its build and test scripts. Node.js instructions and downloads for your preferred OS can be found [here](https://nodejs.org/en/).

FAST includes a Rust crate (`crates/microsoft-fast-build`) that is compiled to WebAssembly as part of `npm run build`. You'll need the Rust stable toolchain — install it via [rustup](https://rustup.rs/):

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installing Rust, add the WebAssembly target:

```shell
rustup target add wasm32-unknown-unknown
```

You'll also need [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/), which compiles the Rust crate to WebAssembly:

```shell
cargo install wasm-pack
```

### Cloning the repository

Now that your machine is setup, you can clone the FAST repository. Open a terminal and run this command:

```shell
git clone https://github.com/microsoft/fast.git
```
Cloning via SSH:

```shell
git clone git@github.com:microsoft/fast.git
```

### Installing and building

From within the `fast` folder where you've cloned the repo, install all package dependencies and build all workspaces (local dependencies) with this command:

```bash
npm ci
```

After the initial install, you can re-build all workspaces in the future with:

```bash
npm run build
```

Build and test commands are powered by [Lage](https://microsoft.github.io/lage/), which respects the package dependency graph. To build or test only packages that have changed since a given ref, use the `--since` flag:

```bash
lage build --since origin/main
```

### Testing

To run all tests for all packages, use the following command:

```bash
npm run test
```

To run only Chromium tests (faster for local development):

```bash
npm run test:chromium
```

To run tests only for packages changed since the `main` branch:

```bash
lage test:node test:chromium --since origin/main
```

This command can also be run from within individual package folders to execute only tests from that package.

:::note
Packages are located within the `packages` folder of the repository. Each package has a `package.json` file with a `scripts` section that defines the commands available to you for common tasks such as build, test, lint, etc.
:::

### Submitting a pull request

If you'd like to contribute by fixing a bug, implementing a feature, or even correcting typos in our documentation, you'll want to submit a pull request. Before submitting a pull request, be sure to [rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) your branch with the default branch or use the *merge* button provided by GitHub.

:::note
For additional details on branch management, read the [branch guide](./BRANCH_GUIDE.md) documentation.
:::

#### Change Files

Any pull request which includes changes within the `packages/*` directory requires a corresponding change file. Before pushing your changes to create a pull request, be sure you have included the necessary change file(s). To generate a change file, run `npm run change` in the root of the repository. The generated file will be checked into the repo automatically for you as part of the process.

:::note
When working across feature branches, you'll need to target the branch using the following command: `npm run change --branch origin/{branch-name}`.
:::

**Example: Generated change file:**
```json
{
  "type": "minor",
  "comment": "add fancy new feature to FASTElement",
  "packageName": "@microsoft/fast-element",
  "email": "name@example.com",
  "dependentChangeType": "minor",
  "date": "2021-03-01T19:10:06.323Z"
}
```

Running `npm run change` will walk you through a CLI process for generating change files. The process will walk you through selecting the type of change as well as ask you to provide a description of any changes. As a convenience, the utility looks to provide recent commit messages for use in the description. *For changes that do not affect the published package(s), please use "none" when selecting the change type*.

More information on the change process and change types can be found on the [Beachball website](https://microsoft.github.io/beachball/cli/change.html#change).

:::note
If you are addressing multiple issues which are unrelated, consider either doing multiple pull requests, or generating separate change files to ensure accurate generation of changelogs and versioning of packages.
:::

:::note
If you are finding that your changes are either breaking changes or require multiple pull requests, open a [discussion](https://github.com/microsoft/fast/discussions) to discuss this.
:::

### Merging a pull request

If you are merging a pull request, be sure to use the pull request title as the commit title. The title should follow the [conventional commit guidelines](https://www.conventionalcommits.org/).

### Documenting breaking changes

Make sure to document the migration strategy in a `MIGRATION.md` file in the package(s) that has breaking changes, eg. `packages/fast-element/MIGRATION.md`.

Example of how to format `MIGRATION.md`:

```md
# Migrating from previous versions

## v1 to v2

- Export `Foo` has been renamed to `Bar`.
- `Bat` has been updated to use the new API [`BatConfig`](link/to/api).
```

### Publishing

Releases are produced from a dedicated **bump pull request** authored by a maintainer (not by CI). Once the bump PR lands on `main`, the [`cd-github-releases.yml`](.github/workflows/cd-github-releases.yml) workflow attaches the freshly-packed tarballs to a GitHub release per package, and the nightly Azure pipeline ([`azure-pipelines-cd.yml`](azure-pipelines-cd.yml)) downloads those assets and publishes them to npm and crates.io. The detailed CD design is documented in [`.github/workflows/README.md`](.github/workflows/README.md).

This section covers the maintainer workflow for opening the bump PR.

#### 1. Prerequisites

Every PR that touches a publishable workspace should include a beachball [change file](#change-files). Bump PRs consume the accumulated change files; if a workspace needs to be bumped but has no change file (e.g. on first release, or because a contributor forgot to add one), generate one yourself with `npm run change` before bumping.

#### 2. Create the bump branch

The branch name must match beachball's `publish_<timestamp>` convention so that [`build/scripts/checkchange.mjs`](build/scripts/checkchange.mjs) recognizes the PR as a bump and skips the change-file requirement, provided the actor has the `admin` role on the repo (see [Manual version bumps](#manual-version-bumps) below for the bypass details).

```bash
git checkout main
git pull origin main
git checkout -b "publish_$(node -p 'Date.now()')"
```

#### 3. Run `npm run bump`

```bash
npm run bump
```

This single command:

- Reads every file under `change/`.
- Bumps `package.json` and updates `CHANGELOG.md` / `CHANGELOG.json` for every affected workspace.
- Runs the `postbump` hook in [`beachball.config.js`](beachball.config.js) — for any bumped npm package that has a paired Rust crate at `crates/<crate-name>/Cargo.toml` (where `<crate-name>` is the npm name with the leading `@` dropped and `/` replaced with `-`, e.g. `@microsoft/fast-build` → `microsoft-fast-build`), the hook rewrites the crate's `Cargo.toml` and `Cargo.lock` to the new version so they stay in lock-step with the npm package.
- Deletes the consumed change files.

No commit, push, npm publish, or git tag is made by `npm run bump`.

#### 4. Review the result

```bash
git status
git diff
node build/scripts/create-github-releases.mjs --check-only
```

The third command previews exactly which workspaces the post-merge CD will publish, by listing every workspace whose freshly-bumped `${name}_v${version}` tag is not present in the local git tag list. Run `git fetch --tags --prune origin` beforehand if you want the preview to reflect the current state on `origin` rather than your stale local refs — though for a fresh bump that hasn't been pushed yet, your local tag list is the source of truth anyway.

A typical bump PR touches:

- `packages/<name>/package.json` (`version` field) for each bumped workspace
- `packages/<name>/CHANGELOG.md` and `CHANGELOG.json` for each bumped workspace
- `crates/<crate-name>/Cargo.toml` and `crates/<crate-name>/Cargo.lock` for any paired Rust crate (handled automatically by the postbump hook)
- Deletions under `change/`

#### 5. Open the PR

```bash
git add -A
git commit -m "chore: release packages"
git push origin "$(git rev-parse --abbrev-ref HEAD)"
gh pr create --fill --base main
```

The bump PR goes through normal review. `npm run checkchange` will pass because the branch name matches `publish_<timestamp>` and the actor has admin on the repo (see [Manual version bumps](#manual-version-bumps)); the PR itself does **not** publish anything.

:::note
Do not edit `package.json` or `Cargo.toml` versions by hand as part of a normal feature/fix PR. Let `npm run bump` and the postbump hook do it. [`create-github-releases.mjs`](build/scripts/create-github-releases.mjs) refuses to release a workspace whose npm version and paired crate version disagree.

A narrow exception exists for the **manual version bump** flow described in [the next section](#manual-version-bumps) — hotfix overrides, paired Rust/npm sync recovery, or scripted version pins. Those edits are tolerated by `npm run checkchange` only on a `publish_<timestamp>` branch whose actor has the `admin` role on `microsoft/fast`.
:::

#### 6. After merge

After merge, [`cd-github-releases.yml`](.github/workflows/cd-github-releases.yml) runs on its nightly cron (`0 8 * * *` UTC, ~12am PST) — or you can trigger it immediately via `gh workflow run cd-github-releases.yml` if you don't want to wait. Its `detect` job notices the new `${name}_v${version}` tags don't yet exist; the `release` job packs each `.tgz` (and any paired `.crate`) and atomically creates one GitHub release per bumped package. The next nightly run of [`azure-pipelines-cd.yml`](azure-pipelines-cd.yml) (scheduled ~1 hour later at 09:00 UTC) downloads those assets, hands off to `FAST.Release.PipelineTemplate` for the actual `npm publish` / `cargo publish`, and on success pushes `deployed/<tag>` marker tags so the publish is never repeated.

#### Hotfix or single-package bump

The same flow works for a single-package release — just keep only the relevant change file(s) before running `npm run bump`, or pass `--package` to beachball directly:

```bash
npx beachball bump --package "@microsoft/fast-build"
```

### Manual version bumps

`npm run checkchange` normally requires a beachball [change file](#change-files) for any edit to `packages/*/package.json`, including a single `"version"` line. Three maintainer-driven flows produce legitimate `package.json` edits without a change file:

- The full bump PR documented in [Publishing](#publishing) above (`npm run bump` consumes the change files, so by the time the PR is opened there is nothing left for `npm run change` to record).
- **Hotfix overrides** where the entire change is `1.2.3` → `1.2.4` on one or two workspaces.
- **Paired Rust crate ↔ npm package sync recovery** where the postbump hook missed an entry (the npm version is correct but `Cargo.toml` drifted, or vice versa) and a maintainer is forcing the two back into agreement.

To accommodate these flows without weakening the check for the broad contributor population, [`build/scripts/checkchange.mjs`](build/scripts/checkchange.mjs) skips beachball entirely **only** when both of the following are true for the current run:

1. **Branch name matches `^publish_\d+$`** — beachball's own convention for its temporary publish branch, generated as `'publish_' + String(new Date().getTime())` in [`beachball/lib/commands/publish.js`](https://github.com/microsoft/beachball/blob/master/src/commands/publish.ts). Recommended way to generate one:
   ```bash
   git checkout -b "publish_$(node -p 'Date.now()')"
   ```
2. **Actor has the `admin` role on `microsoft/fast`,** verified live via the GitHub REST API (`GET /repos/microsoft/fast/collaborators/<login>/permission`). The wrapper reads the actor login from `$GITHUB_ACTOR` in CI and falls back to `gh api user --jq .login` locally; it reads the API token from `$GITHUB_TOKEN` → `$GH_TOKEN` → `gh auth token` in order. Maintainership lives in the GitHub repo settings, so adding or removing a maintainer requires no change to this script.

If either condition fails, beachball runs normally and the change-file requirement applies. The bypass is granted only when the GitHub API responds with `"admin"`; any short-circuit before that (missing token, missing login, network error, non-admin role) falls through to `beachball check` and the wrapper logs the reason.

Every bypass writes a multi-line banner to the CI log naming the branch, the actor, the resolved role, and the source of each (env var vs. local CLI). Reviewers should spot-check that banner on bump PRs and either close the PR or rename the branch (drop the `publish_` prefix) if the diff turns out to contain real source-code changes rather than a version bump.

To grant or revoke the bypass for someone, change their role on `microsoft/fast` (Settings → Collaborators and teams). The wrapper picks up the change on the next CI run.

### Recommended Settings for Visual Studio Code

You can use any code editor you like when working with the FAST monorepo. One of our favorites is [Visual Studio Code](https://code.visualstudio.com/). VS Code has great autocomplete support for TypeScript and JavaScript APIs, as well as a rich ecosystem of plugins.

Default VS Code settings for this project are configured as [Workspace settings](https://code.visualstudio.com/docs/getstarted/settings) in the `.vscode` directory. These settings override user settings for the workspace and are configured to ensure consistent code formatting across different environments. We also include a list of [Workspace recommended extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions) for VS Code for syntax highlighting and code linting.

## Contribution policy

A “Contribution” is work voluntarily submitted to a project. This submitted work can include code, documentation, design, answering questions, or submitting and triaging issues.

Many contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to grant and do grant the rights to use your contribution. For details, visit [https://cla.microsoft.com](https://cla.microsoft.com).

When you submit a pull request, a CLA-bot automatically determines if you need to provide a CLA and decorates the pull request appropriately (e.g., label, comment). Follow the instructions provided by the bot. You only need to do this once across all repositories using our CLA.

## Guiding principle

Owners, the steering committee, collaborators, code owners, and contributors work in concert with one another on behalf of the FAST community and prioritize the community's interests over their own.

The development, release, and work management processes must reflect this principle. Accepting contributions to the project requires a review by collaborators.

## Governance

### Owners

*Owners* have admin access and are responsible for the management, maintenance, and operations of the FAST repository.

### Steering committee

*Steering committee* members are key *collaborators* who have demonstrated design or technical expertise critical to driving the FAST project and community forward.

* Aaron Wentzel
* Brian Heston
* Chris Holt
* Jane Chu
* Jason Falk
* Nicholas Rice
* Rob Eisenberg

### Collaborators

*Collaborators* have write access and have an active and sustained impact on the project and participate in triaging issues, reviewing code, mentoring, and working to improve the architectural quality. 

### Code owners

As subject matter experts, *code owners* approve pull requests on the packages they own. There is a required minimum of one code owner for each package. *Code owners* are listed in [CODEOWNERS](https://github.com/microsoft/fast/blob/main/.github/CODEOWNERS).

### Contributors

*Contributors* have read access and can be anyone who has contributed a completed pull request to the project.

### Nominations & appointments

* To become a *contributor*, a community member must have a pull request approved and merged into the FAST project main branch.
* To become a *collaborator*, a *contributor* will petition the *steering committee*, who will approve or deny the request.
* To become a *code owner*, a *collaborator* will be (a) nominated by a *steering committee* member or (b) petition the *steering committee*, who will approve or deny the request.
* To join the *steering committee*, a *collaborator* will be nominated by a *steering committee* member and the *steering committee*, who will approve or deny the request.

## Acceptance and consensus seeking process

Acceptance of contributions follows the consensus-seeking process.

All pull requests must be approved by an assigned *collaborator* before the pull request can be accepted. A *collaborator* will be assigned to a pull request within [a reasonable period of time](#response-time) of the pull request creation. The assignee will be responsible for:

1. Reviewing the pull request if they are not the creator of it
2. Adding any additional reviewers to review at their discretion
3. Ensuring the pull request is given feedback in [a reasonable period of time](#response-time) from *collaborators* or *code owners* with the expertise to evaluate the changes
4. Merging the pull request

When a pull request : (a) has a significant impact on the project, (b) is inherently controversial, or (c) has not reached consensus with *collaborators*; add a "status:controversial" label to the pull request for the *steering committee* to review the pull request. Pull requests labeled with "status:controversial" are not approved until the *steering committee* reviews the issue and makes a decision.

Additionally, *owners* can temporarily enable [interaction limits](https://help.github.com/articles/limiting-interactions-with-your-repository/) to allow a "cool-down" period when hot topics become disruptive.

Specific *collaborators* or *code owners* can be added to a pull request by including their user alias in the "Reviewers" section.

### Response time

The amount of time can vary but at least 3 days during the typical working week and 5 days over weekends should be given to account for international time differences and work schedules. This is considered a reasonable period of time.

## Stability policy

An essential consideration in every pull request is its impact on the system. To manage impacts, we work collectively to ensure that we do not introduce unnecessary breaking changes, performance or functional regressions, or negative impacts on usability for users or supported partners. To learn more about our approaches to planning and releases, see [our release planning document](../community/release-planning.md).

## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* a. The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
* b. The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or
* c. The contribution was provided directly to me by some other person who certified (a), (b), or (c) and I have not modified it.
* d. I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

## Resources

Several open source projects have influenced our contribution policy:

* [Project Governance @Node](https://nodejs.org/en/about/governance/)
* [Contributions @Node](https://github.com/nodejs/node/blob/main/CONTRIBUTING.md)
* [Open Source @GitHub](https://github.com/blog/2039-adopting-the-open-code-of-conduct)
* [Open Source examples @todogroup](https://github.com/todogroup/policies)
