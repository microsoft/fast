---
id: creating-a-design-system
title: Creating a Design System
sidebar_label: Creating a Design System
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/creating-a-design-system.md
---
Creating a design system involves two key steps:
1. Determine what information the Design System should hold
2. Creating a DesignSystemProvider to communicate the Design System

The information the Design System should hold will be dictated by a project's design philosophies and capabilities and can vary widely from project to project. Therefore, this documentation will focus on creating and configuring a DesignSystemProvider and not data in the Design System.

## Creating a DesignSystemProvider
As discussed in the [overview](/docs/design-systems/overview#the-designSystemProvider), the [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) is an HTML element designed to communicate the Design System. To create a [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) element, we'll declare a new [DesignSystemProvider](/docs/api/fast-foundation.designsystemprovider) element using the [designSystemProvider](/docs/api/fast-foundation.designsystemprovider) decorator:

```ts
import { css } from "@microsoft/fast-element";
import {
    DesignSystemProvider,
    designSystemProvider,
    DesignSystemProviderTemplate as template,
} from "@microsoft/fast-foundation";

@designSystemProvider({
    name: "my-design-system-provider",
    template,
    styles: css`:host { display: block }`
})
export class MyDesignSystemProvider extends DesignSystemProvider {}
```
:::note
You may notice that this syntax looks a lot like the [customElement](docs/api/fast-element.customelement) function from `@microsoft/fast-element` - thats because under the hood [designSystemProvider](/docs/api/fast-foundation.designsystemprovider) uses [customElement](docs/api/fast-element.customelement). In fact, it supports the same type signature as [customElement](docs/api/fast-element.customelement).
:::

Loading the script with the above definition, you can now use the following HTML:

```html
<my-design-system-provider>
    hello world
</my-design-system-provider>
```

## Declaring the Design System
The above HTML at this point doesn't do much - let's change that by exploring how to creates properties of the design system using [`designSystemProperty()`](/docs/api/fast-foundation.designsystemproperty). Let's say that we want to add `font-size-large` to our Design System:

```ts
// ...
import { designSystemProperty } from "@microsoft/fast-foundation";

// ...
export class MyDesignSystemProvider extends DesignSystemProvider {
    @designSystemProperty({
        attribute: "font-size-large",
        cssCustomProperty: "font-size-large",
        default: "28px"
    })
    public fontSizeLarge: string;
}
```

The above declares the `fontSizeLarge` property on the `MyDesignSystemProvider` and decorates it as a property of the Design System. Let's take a closer look at the configuration object provided to the decorator.

### `attribute`
The `attribute` property is used to set the HTML attribute that should correspond to the decorated property. This property is optional and defaults to the name of the decorated property; it can also be set to `false` to omit the HTML attribute association. In this case, the `attribute` property is being used to spinal-case the property name for more conventional use in HTML:

**Example: Setting the property from the HTML attribute**
```html
<my-design-system-provider font-size-large="18px"></my-design-system-provider>
```

### `cssCustomProperty`
The `cssCustomProperty` property is used to define the name of the [CSS custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) to which the value is mapped. This allows easy use of the Design System value in CSS stylesheets. This property is optional and defaults to the attribute name of the decorated property; it can also be set to `false` to omit the [CSS custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) association. In this case, the `cssCustomProperty` property is being used to spinal-case the property name.

```ts
const styles = css`:host { font-size: var(font-size-large)}`;
```
### `default`
The `default` property naturally defines the default value for the Design System property. This is the value that gets used when an app author applies the `use-defaults` attribute (more on that later).

:::important
Notice the the default value is assigned as a property of the config and not directly to the *property itself*; the property is declared but never assigned a value. This is important because each instance of a provider inherits unset properties from a parent provider (if it exists); if each provider *set* each property explicitly to the default then there would be no inheritance.
:::

### `converter`
Much like [`@attr()`](/docs/api/fast-element.attr), [`designSystemProperty()`](/docs/api/fast-foundation.designsystemproperty) also supports a `converter` property to convert HTML attributes into JavaScript properties. This is useful when the Design System property value should be represented as a data-type other than a string:

**Example: Using a nullableNumberConverter**
```ts
    // ...
    @designSystemProperty({
        attribute: "design-unit",
        cssCustomProperty: "design-unit"
        default: 4,
        converter: nullableNumberConverter,
    })
    public baseHeightMultiplier: number;
    // ...
```