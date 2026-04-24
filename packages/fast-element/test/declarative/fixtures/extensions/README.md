# Extensions

Fixtures for additional functionality that augments the core declarative FAST
Element behavior beyond developer direct configuration, such as automatic
attribute mapping and deep property observation.

| Fixture | Description |
|---|---|
| `attribute-map` | Automatic attribute mapping enabled with the `attributeMap()` definition extension. |
| `attribute-map-naming-strategy` | The `attributeMap({ "attribute-name-strategy": "camelCase" })` definition extension for mapping HTML attribute names to property names. |
| `attribute-map-naming-strategy-camel-case` | Explicit `@attr` decorator behavior with `camelCase` attribute name strategy in the build configuration. |
| `observer-map` | Automatic deep reactive observation enabled with the `observerMap()` definition extension. |
| `observer-map-config-object` | Explicit non-default configuration objects applied via `observerMap(...)` and `attributeMap(...)` definition extensions. |
| `observer-map-deep-merge` | Nested object merging behavior for complex state structures. |
| `observer-map-properties` | Selective property observation using `observerMap({ properties: {...} })` for fine-grained control. |
