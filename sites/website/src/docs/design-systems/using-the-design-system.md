---
id: using-the-design-system
title: Using the FAST Design System 
sidebar_label: Using the Design System
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/using-the-design-system.md
---

- use defaults
- composing design system providers
- Using design system CSS custom properties
- Using design system resolvers (CSS custom property behaviors, conditional CSS, etc)
    - List the available Design System resolvers
- How to create a Design System resolver.
    - When is this useful? 
        - Adaptive color
        - Directional stylesheets

### Composing Design System Providers

*Design System Providers* are designed to compose their values with ancestor *Design System Providers* to facilitate changing values for decedents of the provider.

```html
<fast-design-system-provider design-unit="4" background-color="#FFFFFF">
    <p style="height: calc(var(--design-unit) * 1px)">4px</p>
    <p style="background: var(--background-color)">#FFFFFF</p>

    <fast-design-system-provider design-unit="8">
        <p style="height: calc(var(--design-unit) * 1px)">8px</p>
        <p style="background: var(--background-color)">#FFFFFF</p>
    </fast-design-system-provider>
</fast-design-system-provider>
```


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
