---
id: design-system
title: Design System
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-components/docs/guide/design-system.doc.md
---

In FAST, the *design system* is a collection of properties and values that inform the visual design language of the components. These properties are managed and provided through implementations of the [*DesignSystemProvider*](fast-foundation/fast-design-system-provider.md).

For the purposes of this section, just know the *DesignSystemProvider* is a Custom Element that will create CSS Custom Properties that can be consumed by component stylesheets and provide mechanisms to synchronize, update, and consume those properties programmatically.

### Design System Properties
The following properties are provided by the `FASTDesignSystemProvider` and should be used as appropriate.

| Name                                   | Type | Description   |
|----------------------------------------|--------------------  |----------------------------------------------------------------------------|
| `--background-color`                   | `string` (hex color) | Defines the background color of the node. This is used by color recipes and should represent the color UI is rendering on for a given node tree. |
| `--density`                            | `number`             | A multiplier to control the density of UI elements.                        |
| `--design-unit`                        | `number`             | The core sizing unit that all sizes are derived from.                      |
| `--base-height-multiplier`             | `number`             | The number of design units used for component height at the base density.   |
| `--base-horizontal-spacing-multiplier` | `number`             | The number of design units used for horizontal spacing at the base density. |
| `--corner-radius`                      | `number`             | The corner radius of controls.                                             |
| `--outline-width`                      | `number`             | The width of the outline of outline controls.                              |
| `--focus-outline-width`                | `number`             | The width of the focus indicator.                                             |
| `--disabled-opacity`                   | `number`             | Opacity of disabled controls.                                              |
