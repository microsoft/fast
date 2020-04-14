# Background

The *background* component is used to create regions of a page that have a background color. The component will coordinate applying the supplied background color to both the created element *and* adjusting the `DesignSystem` for all child components.

## Usage

Ensure that a `DesignSystemProvider` that supplies a `neutralPalette` property is wrapping any `Background` instance. The easiest way to do this is using `DesignSystemDefaults`.

```jsx

import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";

<DesignSystemProvider designSystem={DesignSystemDefaults}>
    <Background value={0} />
</DesignSystemProvider>

```

## value

The *background* expects a `value` property that can be a color recipe, color string, or a number. When the value is a color recipe it will be evaluated within the context of the design system. A color string will be used directly and applied to CSS and the DesignSystem. Using a number is not recommended because it doesn't scale with variable length palettes, however, a number will be treated as an index and used to obtain a color from the `DesignSystem.neutralPalette`.

The recommended usage is to provide one of the layer recipes:

- `neutralLayerFloating`
- `neutralLayerCardContainer`
- `neutralLayerL1`
- `neutralLayerL2`
- `neutralLayerL3`
- `neutralLayerL4`

```jsx
<Background value={neutralLayerL1}>
    <Heading>Hello world</Heading>
</Background>
```

## tag

The *background* can also accept a `tag` property to customize the HTML element created. `tag` can be any HTML element tag-name.

```jsx
<Background tag="section" />
```

## drawBackground

By default, the *background* component will write the resolved background-color as CSS onto the root element it creates. There are several cases where this is undesirable though. If `drawBackground` is set to `false`, the resolved background color will be applied to the `DesignSystemProvider` created by the component, but it will not apply the background color via CSS.
