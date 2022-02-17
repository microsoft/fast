# Branch guide

This is the branch guide for the FAST repository. When contributing to this project please follow the standards defined in this guide.

## Default

The `master` branch is the default branch. It is used for all releases pinned to the current major version. Most pull requests should be merged directly into this branch so that it can be automatically checked for publishing.

## Features

If a large feature or a breaking change has been defined, a feature branch may be created. To be significant enough work to require a feature branch, the work must comprise of more than one pull request. The feature branch should follow the naming convention `features/*`. This will allow GitHub workflows including the build gate to trigger on any pull request opened against the feature branch.

### Changelog

Due to the default behavior of beachball (the package publishing utility used in this repository) the script in `package.json` using `beachball check` which defaults to checking for changes against the default branch must be updated. The branch creation should start by targeting the check for changes against the feature branch specifically, to do this refer to the branch settings in [beachball options](https://github.com/microsoft/beachball/blob/master/docs/overview/configuration.md#options). This change must be reverted before inclusion to the default branch.

### Merging

When merging a feature branch to the default branch, changes should not be squashed to preserve history. This will require a special action from someone with the necessary security privileges.