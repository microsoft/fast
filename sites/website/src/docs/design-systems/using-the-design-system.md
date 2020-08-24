---
id: using-the-design-system
title: Using the FAST Design System 
sidebar_label: Using the Design System
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/using-the-design-system.md
---

This section goes into further detail on how the Design System can be used. It will use [FAST Frame](/docs/design-systems/fast-frame) Design System as in the examples but none are *specific* to [FAST Frame](/docs/design-systems/fast-frame); use these features with your own Design System if you're not using [FAST Frame](/docs/design-systems/fast-frame).

### Setting Design System Properties
Design System properties can always be set by simple property assignment in JavaScript. Simply obtain a reference to the Custom Element instance and assign the property.

**Example: Setting a Design System value by property assignment**
```ts
const provider = document.querySelector('fast-design-system-provider');
provider.designUnit = 6; // Set the Design System property.
```

*Most* Design System properties can be set by setting an HTML *attribute* on the element instance. The attribute name for the Design System property will be the corresponding JavaScript property name by default, but it can be customized or disabled for each Design System property. See [Declaring the Design System](/docs/design-systems/creating-a-design-system#declaring-the-design-system) for more info.

**Example: Setting a Design System value by HTML attribute**
```html
<fast-design-system-provider design-unit="6">

</fast-design-system-provider>
```

## `use-defaults`
Every [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) supports the `use-defaults` boolean attribute. `use-defaults` is a mechanism to assign the default Design System values to the [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider).

It is generally a good idea to have a [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) with the `use-defaults` attribute wrapping all of the app UI; this will ensure all properties used by descendent components are defined. This is especially important if the Design System properties reflect to CSS custom properties because the CSS custom properties are only created when the value is set.

**Example: using `use-defaults` at the page root**
```html
<!DOCTYPE html>
<html>
    <head>
        <!-- ... -->
    </head>
    <body>
        <fast-design-system-provider use-defaults>
            <!-- App UI goes here -->
        </fast-design-system-provider>
    </body>
</html>
```

`use-defaults` can also be used in conjunction with explicit Design System property attribute assignment. If both `use-defaults` *and* an attribute setting a Design System property exist, the explicit attribute assignment takes priority.

**Example: `use-defaults` with attribute assignment**
```html
<fast-design-system-provider use-defaults design-unit="6">
    <!-- the Design System's design unit will be 6, all other Design System values will be initialized to their default -->
</fast-design-system-provider>
```

- Using design system CSS custom properties
- Using design system resolvers (CSS custom property behaviors, conditional CSS, etc)
    - List the available Design System resolvers
- How to create a Design System resolver.
    - When is this useful? 
        - Adaptive color
        - Directional stylesheets

### Composing Design System Providers
Remember from the [overview](/docs/design-systems/overview#design-system-flow) that the Design System values are inherited and propagate  down the DOM tree. This can be used to scope regions of a page with Design System changes.

```html
<fast-design-system-provider design-unit="6">
    <p style="height: calc(var(--design-unit) * 1px)">6px</p>

    <fast-design-system-provider design-unit="12">
        <p style="height: calc(var(--design-unit) * 1px)">12px</p>
    </fast-design-system-provider>
</fast-design-system-provider>
```

### CSS Custom Properties


### CSS Custom Property Registry
There are some things that CSS just can't do. Advanced math, array manipulation, and conditionals are simply not possible with today's CSS.

To address this gap, the `DesignSystemProvider` is capable of registering `CSSCustomPropertyDefinition` types through the `registerCSSCustomProperty` method:

**EXAMPLE: Register a CSS custom property that is a function of the Design System**

```ts
DesignSystemProvider.registerCSSCustomProperty({
    name: "design-unit-12th",
    value: designSystem => Math.pow(designSystem.designUnit, 12),
});
```

In the above example, the `value` function will be re-evaluated if the Design System ever changes.

The above API is made especially useful when defining a [component stylesheet](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-element/docs/building-components.md#defining-css) - individual stylesheets can declare dependencies on CSS custom properties that are functions of the element instance's *design system*.

**EXAMPLE: creating a recipe dependency**
```ts
import { css } from "@microsoft/fast-element";
import { cssCustomPropertyBehaviorFactory, FASTDesignSystemProvider } from "@microsoft/fast-components";

const styles = css`
    :host {
        height: var(--fancy-height);
    }
`.withBehaviors(
    cssCustomPropertyBehaviorFactory(
        "fancy-height",
        designSystem => Math.pow(designSystem.designUnit, 12),
        FASTDesignSystemProvider.findProvider
    )
)
```
