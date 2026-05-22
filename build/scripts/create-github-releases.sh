#!/usr/bin/env bash
#
# Create one GitHub release per packed tarball.
#
# Invoked by .github/workflows/cd-github-releases.yml after `npm run publish-ci`
# has bumped versions, committed, pushed git tags, and packed tarballs into
# publish_artifacts/. For each tarball we:
#
#   1. Read the package's name and version from the embedded package.json.
#   2. Use the beachball tag format `${name}_v${version}` so the GitHub release
#      tag matches the existing git tag (see beachball's generateTag.js).
#   3. Skip if a release with that tag already exists (idempotent).
#   4. Otherwise create the release and upload the tarball as its asset.
#
# Requires: gh CLI (pre-installed on GitHub-hosted runners), tar, jq, node.
# Authentication: gh CLI reads GH_TOKEN from the environment.

set -euo pipefail
shopt -s nullglob

tarballs=(publish_artifacts/*.tgz)

if [[ ${#tarballs[@]} -eq 0 ]]; then
    echo "No tarballs found in publish_artifacts; nothing to release."
    exit 0
fi

for tarball in "${tarballs[@]}"; do
    pkg_json=$(tar -O -xzf "$tarball" package/package.json)
    name=$(echo "$pkg_json" | jq -r .name)
    version=$(echo "$pkg_json" | jq -r .version)
    tag="${name}_v${version}"

    if gh release view "$tag" --json id >/dev/null 2>&1; then
        echo "Skipping $name@$version: release already exists"
        continue
    fi

    notes=$(printf '%s\n' \
        "Nightly release for \`$name@$version\`." \
        "" \
        "The attached tarball will be published to npm by the nightly Azure release pipeline.")

    gh release create "$tag" "$tarball" --title "$name@$version" --notes "$notes"
    echo "Created release $tag with asset $(basename "$tarball")"
done
