# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

## Draft Pull Requests

All CI workflows that run against pull requests are configured to skip draft PRs:

- **GitHub Actions** (`ci-validate-pr.yml`, `ci-validate-platforms.yml`, `ci-validate-rust.yml`): The `pull_request` trigger includes `ready_for_review` in its event types, and each job has a condition that skips execution when the PR is a draft. When a draft PR is marked as ready for review, the workflows will automatically trigger.
- **Azure Pipelines** (`azure-pipelines-bench.yml`, `azure-pipelines-ci.yml`): The `pr` trigger uses `drafts: false` to prevent pipeline runs on draft PRs.

## Continuous Deployment

Nightly publishing is split into two coordinated jobs so that npm credentials never leave the Azure environment:

- **`cd-github-releases.yml`** (GitHub Actions) runs every night at **midnight PST (`0 8 * * *` UTC)** and also accepts `workflow_dispatch`. It installs dependencies, builds all workspaces, runs `npm run publish-ci` (which bumps versions, creates beachball git tags, packs tarballs to `publish_artifacts/`, and pushes to `main`), then runs [`build/scripts/create-github-releases.sh`](../../build/scripts/create-github-releases.sh) which uses the [`gh` CLI](https://cli.github.com/) to create one GitHub release per newly-bumped package (tag format `${name}_v${version}`, matching beachball) and upload the tarball as a release asset.
- **`azure-pipelines-cd.yml`** (Azure Pipelines) runs every night at **1am PST (`0 9 * * *` UTC)**. It runs [`build/scripts/download-github-releases.sh`](../../build/scripts/download-github-releases.sh) which uses the `gh` CLI to list GitHub releases, filters to beachball-style tags, skips package versions already on npm (via `npm view`), downloads any remaining `.tgz` assets into `publish_artifacts/`, then hands off to the existing `FAST.Release.PipelineTemplate.yml@fastPipelines` template for the actual `npm publish`.

Both scripts are thin wrappers around `gh`, `npm`, `tar`, and `jq` — no extra npm dependencies and no custom GitHub API client.