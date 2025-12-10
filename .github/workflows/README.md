# Testing

To test workflows, use the GitHub CLI and trigger the workflow from a branch.

For more information see the [GitHub CLI documentation](https://cli.github.com/manual/gh_workflow_run).

---

# Bundle Size Tracker GitHub Action

This GitHub Action automatically tracks and reports bundle size changes for the `@microsoft/fast-element` package when pull requests are created or updated.

## Features

- 📦 Tracks bundle size for the main export path (`"."`) of `@microsoft/fast-element`
- 📊 Reports both raw and gzipped bundle sizes
- 📈 Shows size differences compared to the target branch
- 💬 Posts results as PR comments with visual indicators
- 🎯 Focuses only on the main production bundle (`index.js`)
- 🔄 Updates existing comments instead of creating new ones for each run

## What Gets Tracked

The action creates and analyzes an actual bundle for the `@microsoft/fast-element` package:

1. **Main Bundle**: A Vite-generated bundle including the `FASTElement` export from `@microsoft/fast-element` - This represents the base bundle size that users would experience when importing the package and using `FASTElement`.

The bundle includes only the `FASTElement` export using Vite with esbuild minification.

## When It Runs

The action triggers on:
- Pull requests targeting `main`, `releases/*`, or `features/*` branches
- Changes to files in `packages/fast-element/` directory
- Changes to the workflow file itself

## Technical Details

### Bundle Analysis Process

1. **Build**: The action builds both the PR branch and target branch packages
2. **Bundle**: Creates actual bundles using Vite by importing `@microsoft/fast-element` 
3. **Analyze**: Measures raw and gzipped sizes of the generated bundles
4. **Compare**: Calculates size differences and percentage changes
5. **Report**: Posts formatted results as a PR comment

### Size Thresholds

- Changes > 5% trigger visual alerts (🚨 for increases, 🎉 for decreases)
- All changes are reported, regardless of size

### File Structure

- `.github/workflows/bundle-size-tracker.yml` - Main workflow file
- `build/analyze-bundle-size.mjs` - Bundle creation and analysis script
- `build/compare-bundle-sizes.mjs` - Bundle size comparison and report generation script
- `build/comment-pr.mjs` - Generic GitHub PR comment utility
- `build/comment-pr-bundle-size.mjs` - Bundle size specific PR commenting script

## Testing Locally

You can test the bundle analysis locally:

```bash
# Ensure packages are built
npm run build

# Run the analysis
node build/analyze-bundle-size.mjs
```

## Workflow File Location

The workflow is defined in:
```
.github/workflows/bundle-size-tracker.yml
```

## Security

The workflow uses:
- `actions/checkout@v4` for code checkout
- `actions/setup-node@v4` for Node.js setup
- `actions/upload-artifact@v4` and `actions/download-artifact@v4` for data transfer
- `actions/github-script@v7` for GitHub API interactions

All actions are from trusted, official sources and pinned to specific versions.

## Permissions

The workflow requires:
- `contents: read` - To checkout code and read files
- `pull-requests: write` - To post comments on PRs

## Maintenance

The action automatically handles:
- Missing bundles (reports errors gracefully)
- First-time packages (handles missing base branch bundles)
- Comment updates (replaces existing comments instead of creating duplicates)

To update or modify the tracking:
1. Edit the build scripts:
   - `build/analyze-bundle-size.mjs` - for bundle creation and analysis
   - `build/compare-bundle-sizes.mjs` - for size comparison and report generation  
   - `build/comment-pr.mjs` - generic PR commenting utility (reusable)
   - `build/comment-pr-bundle-size.mjs` - bundle size specific PR commenting
2. Test changes locally using the build scripts
3. Update `.github/workflows/bundle-size-tracker.yml` if needed
4. Commit and create a PR to see the action in action!