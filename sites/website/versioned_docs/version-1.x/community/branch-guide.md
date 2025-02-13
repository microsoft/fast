---
id: branch-guide
title: Branch Guide
sidebar_label: Branch Guide
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/community/branch-guide.md
description: This is the branch guide for the FAST repository. When contributing to this project please follow the standards defined in this guide.
keywords:
  - branch guide
---

This is the branch guide for the FAST repository. When contributing to this project please follow the standards defined in this guide.

## Default

The `master` branch is the default branch. It is used for all releases pinned to the current major version. Most pull requests should be merged directly into this branch so that they can be automatically checked for publishing.

## Features

If a large feature or a breaking change has been defined, a feature branch may be created. To be significant enough work to require a feature branch, the work must comprise of more than one pull request. The feature branch should follow the naming convention `features/*`. This will allow GitHub workflows, including the build gate, to trigger on any pull request opened against the feature branch.

### Changelog

Due to the default behavior of beachball (the package publishing utility used in this repository), the `beachball.config.js` which defaults to checking for changes against the default branch must be updated to point to the feature branch, and if necessary, allowed to add major changes. The branch creation should start by updating `beachball.config.js`, to do this refer to the [beachball options](https://github.com/microsoft/beachball/blob/master/docs/overview/configuration.md#options). This change must be reverted before inclusion to the default branch.

### Merging

When merging a feature branch to the default branch, changes should not be squashed to preserve history. This will require a special action from someone with the necessary security privileges to change the settings in the repository for pull requests to merge without squashing. The user performing this action will, after merging the feature branch in, need to change this setting back.