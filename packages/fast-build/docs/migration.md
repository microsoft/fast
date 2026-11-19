# Migration guidance

Migration guides cover the current publish, not a permanent history of changes.
For current APIs and behavior, see the [native artifact contract](./server-modules.md).

## 0.22.0

No migrations are required for this publish. Supported Node.js hosts can use
prebuilt native packages with optional dependencies enabled; see the
[native hosting guide](./native-node-host.md).

## Release preparation

Review and delete guides belonging to previous publishes and remove their entries
above. Retain guidance for the publish being prepared. Keep this index even when
empty, noting that there are no migrations for the current publish, so links from
root documents remain valid. Cleanup is a release-preparation step, not automated
by the publishing pipeline.
