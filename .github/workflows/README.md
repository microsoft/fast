# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

## Draft Pull Requests

All CI workflows that run against pull requests are configured to skip draft PRs:

- **GitHub Actions** (`ci-validate-pr.yml`, `ci-validate-platforms.yml`, `ci-validate-rust.yml`): The `pull_request` trigger includes `ready_for_review` in its event types, and each job has a condition that skips execution when the PR is a draft. When a draft PR is marked as ready for review, the workflows will automatically trigger.
- **Azure Pipelines** (`azure-pipelines-bench.yml`, `azure-pipelines-ci.yml`): The `pr` trigger uses `drafts: false` to prevent pipeline runs on draft PRs.

## Continuous Deployment

Nightly publishing is split into two coordinated jobs so that npm credentials never leave the Azure environment:

- **`cd-github-releases.yml`** (GitHub Actions) runs every night at **midnight PST (`0 8 * * *` UTC)** and also accepts `workflow_dispatch`. It does **not** bump versions or push to `main` — version bumps land on `main` through ordinary human-authored pull requests (for example, by running `npm run bump` locally and opening a PR). The workflow installs dependencies, builds all workspaces, and then runs [`build/scripts/create-github-releases.mjs`](../../build/scripts/create-github-releases.mjs), which uses `npm query` + `npm pack` + the [`gh` CLI](https://cli.github.com/) to pack every non-private workspace at its current `package.json` version and create a GitHub release for any `${name}_v${version}` tag (matching beachball's tag format) that does not already exist. Re-running the workflow is idempotent.
- **`azure-pipelines-cd.yml`** (Azure Pipelines) runs every night at **1am PST (`0 9 * * *` UTC)** and is split into two stages so the heavy publish work is skipped on no-op nights:
  1. **`Detect`** — a lightweight stage that runs [`build/scripts/download-github-releases.mjs`](../../build/scripts/download-github-releases.mjs) and emits a `hasReleases` output variable based on whether any tarballs landed in `publish_artifacts/`.
  2. **`Publish`** — depends on `Detect` and runs only when `hasReleases == 'true'`. It re-runs the download script (idempotent), installs dependencies, and hands off to the existing `FAST.Release.PipelineTemplate.yml@fastPipelines` template for the actual `npm publish`. The download script uses the `gh` CLI to list GitHub releases, filters to beachball-style tags, skips package versions already on npm (via `npm view`), and downloads any remaining `.tgz` assets into `publish_artifacts/`.

Both scripts are thin Node.js wrappers around `gh`, `npm`, and `tar` — no extra npm dependencies and no custom GitHub API client.