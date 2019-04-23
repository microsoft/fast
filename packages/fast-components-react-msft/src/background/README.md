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

The *background* expects a `value` property that can be either a color string or a number. When the value is a color string, the color will be used directly and applied to CSS and the DesignSystem. When the value is a number, that number will be treated as an index and used to obtain a color from the `DesignSystem.neutralPalette`.

For convince, we've also exported both light-mode and dark-mode enums with common background colors, `LightModeBackgrounds` and `DarkModeBackgrounds` respectively. Each of these objects has the following properties:

- `L1`
- `L1Alt`
- `L2`
- `L3`
- `L4`

```jsx
<Background value={DarkModeBackgrounds.L1}>
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
