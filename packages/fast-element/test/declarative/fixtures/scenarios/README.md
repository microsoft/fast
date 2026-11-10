# Scenarios

Fixtures for complex scenarios that may involve multiple features interacting together and edge cases that arise from real-world usage patterns.

| Fixture | Description |
|---|---|
| `duplicate-template-names` | Duplicate connected `<f-template>` publishers with the same `name` attribute keep the first template assignment for a simple bound element. |
| `nested-elements` | Nested custom elements with state propagation through shadow boundaries, parent-to-child property binding hydration, event handling inside `f-repeat` with `$c.parent` context access, and `f-when` conditions within repeated content. |

`nested-elements/composed-components.spec.ts` additionally qualifies the
Build/Convert/client boundary using separate `composed-parent.html` and
`composed-child.html` inputs. It uses native parsing/conversion, the existing
Rollup toolchain and in-memory browser routes to exercise synchronous, prepared
and prepared-chunk output with both hydration marker strategies. The
`composed-*` inputs are built by that spec rather than the standard declarative
fixture builder; the original `nested-elements` fixture remains unchanged.
