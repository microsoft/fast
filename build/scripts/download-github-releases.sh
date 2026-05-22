#!/usr/bin/env bash
#
# Download GitHub release tarballs whose `${name}@${version}` has not yet been
# published to npm.
#
# Invoked by azure-pipelines-cd.yml before the existing
# FAST.Release.PipelineTemplate publishes from publish_artifacts/. For every
# GitHub release in $GITHUB_REPOSITORY whose tag matches beachball's
# `${name}_v${version}` format, we ask npm whether that exact version is
# already published. Anything missing has its `.tgz` assets downloaded into
# publish_artifacts/ so the downstream 1ES template can `npm publish` them.
#
# Requires: gh CLI (auth via GH_TOKEN), npm, jq.

set -euo pipefail

repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY must be set to owner/repo}"

mkdir -p publish_artifacts

downloaded_releases=0

# gh release list returns the most recent first; --limit 1000 is plenty for the
# nightly cadence in this repo.
while IFS= read -r tag; do
    if [[ "$tag" != *_v* ]]; then
        echo "Skipping non-beachball release tag: $tag"
        continue
    fi

    name="${tag%_v*}"
    version="${tag##*_v}"

    # `npm view <pkg>@<version> version` exits 0 with a non-empty value when
    # the version exists and either exits non-zero (E404) or returns nothing
    # otherwise. We use --json so the output is empty when nothing matches.
    if [[ -n "$(npm view "$name@$version" version --json 2>/dev/null || true)" ]]; then
        echo "Already on npm: $name@$version"
        continue
    fi

    echo "Downloading $name@$version assets..."
    gh release download "$tag" --repo "$repo" --pattern '*.tgz' --dir publish_artifacts/ --clobber
    downloaded_releases=$((downloaded_releases + 1))
done < <(gh release list --repo "$repo" --limit 1000 --json tagName --jq '.[].tagName')

if (( downloaded_releases == 0 )); then
    echo "No new releases to publish — all GitHub releases already match versions on npm."
else
    echo "Downloaded assets for $downloaded_releases release(s)."
fi
