# Branch guide

This is the branch guide for the FAST repository. When contributing to this project please follow the standards defined in this guide.

## Default

The `main` branch is the default branch. It is used for ordinary releases of the current development line. Most pull requests should be merged directly into this branch so that they can be automatically checked for publishing. Version-specific hotfixes use the maintenance flow below.

## Maintenance and hotfixes

Use a `releases/*` branch, such as `releases/fast-element-3.0`, for a reviewed
backport from an exact published package tag. Keep the branch name to one
segment after `releases/` so existing validation triggers match it. Configure
Beachball's comparison branch accordingly and scope bumps to the selected
package.

Hotfix source tags use `hotfix/<package>_v<version>` and must never be moved.
They are not ordinary release tags and must never have GitHub Releases.
Create the tag at the maintenance branch's reviewed commit. Queue the Azure
pipeline definition from `main`; the tag, not Azure's branch selector, selects
the source to build. Later branch commits do not change the tagged source.
Publish only through the manual Azure hotfix pipeline described in
[build/README.md](build/README.md#version-specific-hotfixes). Forward-port code
fixes independently; do not merge backlevel package versions into `main`.

## Features

If a large feature or a breaking change has been defined, a feature branch may be created. To be significant enough work to require a feature branch, the work must comprise of more than one pull request. The feature branch should follow the naming convention `features/*`. This will allow GitHub workflows, including the build gate, to trigger on any pull request opened against the feature branch.

### Changelog

Due to the default behavior of beachball (the package publishing utility used in this repository), the `beachball.config.js` which defaults to checking for changes against the default branch must be updated to point to the feature branch, and if necessary, allowed to add major changes. The branch creation should start by updating `beachball.config.js`, to do this refer to the [beachball options](https://github.com/microsoft/beachball/blob/master/docs/overview/configuration.md#options). This change must be reverted before inclusion to the default branch.

### Merging

When merging a feature branch to the default branch, changes should not be squashed to preserve history. This will require a special action from someone with the necessary security privileges to change the settings in the repository for pull requests to merge without squashing. The user performing this action will, after merging the feature branch in, need to change this setting back.