# Migration guidance

Migration guides cover the current publish, not a permanent history of changes.
For current APIs and behavior, see the [server module contract](./server-modules.md).

## Current publish

- [Standard Declarative Shadow DOM output](./migration/standard-dsd-output.md)
- [Compiled semantic server rendering](./migration/aot-server-rendering.md)
- [Execution-only typed native artifacts](./migration/typed-native-plans.md)
- [Plugin integrations](./migration/plugin-integrations.md)
- [Stylesheet composition](./migration/stylesheet-composition.md)

## Release preparation

Review and delete guides belonging to previous publishes and remove their entries
above. Retain guidance for the publish being prepared. Keep this index even when
empty, noting that there are no migrations for the current publish, so links from
root documents remain valid. Cleanup is a release-preparation step, not automated
by the publishing pipeline.
