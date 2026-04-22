# Extensions

Fixtures for additional functionality that augments the core `@microsoft/fast-html` behavior beyond developer direct configuration, such as automatic attribute mapping and deep property observation.

| Fixture | Description |
|---|---|
| `attribute-map` | Automatic attribute mapping with `attributeMap: "all"` configuration. |
| `attribute-map-naming-strategy` | The `attribute-name-strategy` configuration for mapping HTML attribute names to property names via `attributeMap` options. |
| `attribute-map-naming-strategy-camel-case` | Explicit `@attr` decorator behavior with `camelCase` attribute name strategy in the build configuration. |
| `observer-map` | The `observerMap: "all"` configuration for automatic deep reactive observation. |
| `observer-map-config-object` | `observerMap` and `attributeMap` configuration objects applied via `TemplateElement.options()`. |
| `observer-map-deep-merge` | Nested object merging behavior for complex state structures. |
| `observer-map-properties` | Selective property observation using `observerMap: { properties: {...} }` for fine-grained control. |
