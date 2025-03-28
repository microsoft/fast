---
id: design-tokens
title: Design Tokens
sidebar_label: Design Tokens
custom_edit_url: https://github.com/microsoft/fast/edit/main/sites/website/versioned_docs/version-legacy/design-systems/design-tokens.md
description: The FAST Design Token implementation is designed to provide first-class support for Design Tokens and make setting, getting, and using Design Tokens simple.
keywords:
    - design tokens
---

The FAST Design Token implementation is designed to provide first-class support for Design Tokens and make setting, getting, and using Design Tokens simple.

## What is a Design Token

A Design Token is a semantic, named variable used to describe a Design System. They often describe design concepts like typography, color, sizes, UI spacing, etc. FAST encourages checking out [the Design Tokens Community Group](https://github.com/design-tokens/community-group#design-tokens) for more information on Design Tokens themselves.

## FAST Frame Design Tokens

The `@microsoft/fast-components` have extensive support for predefined design tokens. See [configuring styles](./fast-frame.md#configuring-styles) for details on adjusting or using the existing tokens, or read on to create your own.

## Create a Token

:::note
Note that this example uses color because it's an easy concept to describe, but we generally discourage the use of fixed colors as they don't benefit from the [adaptive color system](./fast-frame.md#adaptive-color-system) with support for light and dark mode and other adjustments.
:::

The first step to using a token is to create it:

```ts
import { DesignToken } from "@microsoft/fast-foundation";

export const specialColor = DesignToken.create<string>("special-color");
```

The type assertion informs what types the token can be set to (and what type will be retrieved), and the name parameter will serve as the CSS Custom Property name (more on that later).

## Setting Values

A `DesignToken` *value* is set for a `FASTElement` or `HTMLBodyElement` node. This allows tokens to be set to different values for distinct DOM trees:

```ts
const ancestor = document.querySelector("my-element") as FASTElement;
const descendent = ancestor.querySelector("my-element") as FASTElement;

specialColor.setValueFor(ancestor, "#FFFFFF");
specialColor.setValueFor(descendent, "#F7F7F7");
 ```

## Setting a Default Value

A default value can be set for a token so that the default value is returned from `getValueFor()` in cases where no other token value is found for a node tree.

```ts
specialColor.withDefault("#FFFFFF");
```

## Getting Values

Once the value is set for a node, the value is available to use for that node or any descendent node. The value returned will be the value set for the nearest ancestor (or the element itself).

```ts
specialColor.getValueFor(ancestor); // "#FFFFFF"
specialColor.getValueFor(descendent); // "#F7F7F7"
```

## Deleting Values

Values can be deleted for a node. Doing so causes retrieval of the nearest ancestor's value instead:

```ts
specialColor.deleteValueFor(descendent);
specialColor.getValueFor(descendent); // "#FFFFFF"
```

## CSS Custom Property Emission

Unless configured not to, a DesignToken emits a token to CSS automatically whenever the value is set for an element. In the case when a DesignToken is assigned a [derived value](#derived-design-token-values), the CSS custom property will also be emitted when any dependent tokens change.

### DesignToken Root Registration
In order for *default* DesignToken values to be emitted to a CSS custom property, the
DesignToken root will need to be configured:

```ts
DesignToken.create<number>('my-token').withDefault(2); // This will not immediately emit to a CSS custom property

DesignToken.registerRoot(); // Default values are now emitted
```

Invoking `DesignToken.registerRoot()` will cause CSS custom properties to be emitted for the entire document. A root element can also be provided so that CSS custom properties are scoped to that root.

```ts
const root = document.querySelector("#root")! as HTMLDivElement;
DesignToken.registerRoot(root);
```

There also exists a `DesignToken.unregisterRoot()` method to remove default custom properties from a root.

```ts
// ...
DesignToken.unregisterRoot(root);
```

#### Usage With DesignSystem

If you're using `DesignSystem` to register components and dependencies, then note that `DesignToken` root registration happens automatically when `DesignSystem.register()` is invoked. You can configure the root being registered with `DesignSystem.withDesignTokenRoot()` method:

```ts
const root = document.createElement("div");
DesignSystem.getOrCreate().withDesignTokenRoot(root);
```

or you can disable registration by providing `null`:

```ts
DesignSystem.getOrCreate().withDesignTokenRoot(null);
```

### Customizing CSS Custom Property Name
A DesignToken can also be configured to emit to a CSS custom property that is different than the provided name by providing a CSS custom property name to the configuration:

```ts
DesignToken.create<number>({
    name: "my-token", 
    cssCustomPropertyName: "my-css-custom-property-name" // Emits to --my-css-custom-property-name
});
```
### Preventing CSS Custom Property Emission

A DesignToken can be configured **not** to emit to a CSS custom property by passing a configuration with `cssCustomPropertyName` set to `null` during creation:

```ts
DesignToken.create<number>({ 
    name: "my-token", 
    cssCustomPropertyName: null 
});
```

### Values with a 'createCSS' method

It is sometimes useful to be able to set a token to a complex object but still use that value in CSS. If a DesignToken is assigned a value with a `createCSS` method on it, the product of that method will be used when emitting to a CSS custom property instead of the Design Token value itself:

```ts
interface RGBColor {
    r: number;
    g: number;
    b: number;
    createCSS(): string;
}

const extraSpecialColor = DesignToken.create<RGBColor>("extra-special-color");

const value = {
    r: 255,
    g: 0,
    b: 0,
    createCSS() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}

extraSpecialColor.setValueFor(descendent, value)
```

## Subscription

`DesignToken` supports subscription, notifying a subscriber when a value changes. Subscriptions can subscribe to *any* change throughout the document tree or they can subscribe changes for specific elements.

**Example: Subscribe to changes for any element**

```ts
const subscriber = {
    handleChange(record) {
        console.log(`DesignToken ${record.token} changed for element ${record.target}`);
    }
};

specialColor.subscribe(subscriber);
```

**Example: Subscribe to changes a specific element**

```ts
// ...
const target = document.body.querySelector("#my-element");

specialColor.subscribe(subscriber, target);
```

Subscribers can be unsubscribed using the `unsubscribe()` method:

```ts
// ...
specialColor.unsubscribe(subscriber);
specialColor.unsubscribe(subscriber, target);
```

## Using Design Tokens in CSS

Any token can be used directly in a FAST stylesheet by using the Design Token as a CSS directive. Assuming the token value has been set for the element or some ancestor element, the value of the token embedded in the stylesheet will be the token value for that element instance.

```ts
import { css } from "@microsoft/fast-element";

const styles = css`
    :host {
        background: ${specialColor};
    }
`
```

At runtime, the directive is replaced with a CSS custom property, and the Directive ensures that the CSS custom property is added for the element.

## Derived Design Token Values

In the examples above, the design token is always being set to a simple string value. But, we can also set a Design Token to be a function that *derives* a value. A derived value receives the target element as its only argument and must return a value with a type matching the Design Token:

```ts
const token = DesignToken.create<number>("token");
token.setValueFor(target, (element) => 12);
```

The above example is contrived, but the target element can be used to retrieve *other* Design Tokens:

**Example: A derived token value that uses another design token**
```ts
const foregroundColor = DesignToken.create<string>("foreground-color");

foregroundColor.setValueFor(target, (element) => 
     specialColor.getValueFor(element) === "#FFFFFF"
        ? "#2B2B2B" 
        : "#262626"
);
```

For derived Design Token values, any change to dependent tokens will force the derived value to update (and update the CSS custom property if applicable). The same is true if an observable property is used by the derived value:

```ts
import { observable } from "@microsoft/fast-element";

class ThemeManager {
    @observable
    theme: "blue" | "red" = "blue"
}

const themeManager = new ThemeManager();

specialColor.setValueFor(target, () => themeManager.theme === "blue" ? "#0000FF" : "#FF0000");

themeManager.theme = "red"; // Forces the derived tokens to re-evaluate and CSS custom properties to update if applicable
```

> Note: *volatile* token values that conditionally access DesignTokens or other observable properties are currently not supported by DesignToken. If you need to use conditionals,
ensure all DesignTokens or observable properties are accessed outside of conditional blocks. See [Observables and State](../fast-element/observables-and-state.md#observable-features) for more information.

## Aliasing Design Tokens

In some design systems, Design Tokens may have complex hierarchies with tokens referencing other tokens. This can be accomplished by setting a Design Token to another Design Token.

```ts
const specialColor = DesignToken.create<string>("special-color");
const buttonSpecialColor = DesignToken.create<string>("button-special-color");

specialColor.setValueFor(target, "#EDEDED");
buttonSpecialColor.setValueFor(target, specialColor);

buttonSpecialColor.getValueFor(target); // "#EDEDED"
```
