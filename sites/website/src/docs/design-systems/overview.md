---
id: overview
title: What is the Design System?
sidebar_label: Overview
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/overview.md
---
A *Design System* is somewhat of an amorphous term but can generally be thought of as a collection of resources for interactive media that promotes brand alignment. While that definition is intentionally broad, in UI development, Design Systems generally manifest as component libraries surrounded by usage guidance and design principles.

FAST uses "Design System" in a narrower sense than the above; the Design System is a dictionary of data that informs the visual (and sometimes functional) representation of UI elements. The Design System captures, stores, and reflects any information that should inform the rendering of a UI element. This data is often referred to as *Design Tokens*. Common examples of data in a Design System are:
- UI Colors
- Fonts and type ramps
- Motion data such as timings and easing curves
- UI Density
- Spacing values

## How the Design System is used
There are two ways that Design System values (Design Tokens) are used:
1. In CSS
2. In JavaScript

### Design System in CSS
Many Design Tokens are used as CSS property values in component stylesheets. Assume for a moment that a Design Token `font-size-large` exists in a Design System, you may see something like the following:

```css
:host {
    font-size: var(--font-size-large);
}
```

### Design System in JavaScript
The Design System can also be required by JavaScript. Assume for a moment that a Design Token `fadeInDuration` exists in a Design System, you may see something like the following:

```js
const keyFrames = new KeyframeEffect(
    targetElement,
    [{ opacity: "0"}, {opacity: "1"}],
    {duration: designSystem.fadeInDuration}
)
```

## The DesignSystemProvider
The Design System itself manifests through a [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider): it is the vessel through which the Design System is expressed. The [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) is an HTML element that facilitates usage, configuration, and propagation of the Design System through a UI view. The [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) is responsible for expressing the Design System both as a readable JavaScript property *and* as CSS custom properties.

### Design System flow
The Design System is mutable and inherited. Think of the Design System as a flow of data through the DOM toward leaf nodes, where every [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) element inherits Design System data from it's closest ancestor [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) and provides opportunity to *change* that data for all descendent elements. Let's visualize this, and assume there is a `font-size-large` Design Token in the Design System:

**Example: The Design System flows data down the DOM hierarchy**
```html
<my-design-system-provider font-size-large="28px">
    <my-text style="font-size: var(--font-size-large);" id="one">
        My font size is 29px
    </my-text>

    <my-design-system-provider font-size-large="15px">
        <my-text style="font-size: var(--font-size-large);" id="two">
            My font size is 15px
        </my-text>
    </my-design-system-provider>
</my-design-system-provider>
```

As shown above, the `font-size-large` Design System property is set on each [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) instance. The [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) reflects that value to a CSS custom property ([more on that later](/docs/design-systems/using-the-design-system#css-custom-properties)), which the `<my-text>` element uses in it's stylesheet.

But we can *also* access that hierarchial information from JavaScript, which opens up many advanced scenarios that will be explored in the [FAST Frame Design System](/docs/design-systems/fast-frame).
