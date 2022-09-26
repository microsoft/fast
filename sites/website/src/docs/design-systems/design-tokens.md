---
id: design-tokens
title: Design Tokens
sidebar_label: Design Tokens
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/design-tokens.md
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

A `DesignToken` *value* can be set for any `FASTElement` instance. This allows tokens to be set to different values for distinct DOM trees:

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

Once the value is set for a node, the value is available to use for that node or any descendent node. The value returned will be the value set for the nearest ancestor (or the FASTElement itself).

```ts
specialColor.getValueFor(ancestor); // "#FFFFFF"
specialColor.getValueFor(descendent); // "#F7F7F7"
```

The default value for a token can be retrieved directly from the token:

```ts
const value = specialColor.default;
```
## Deleting Values

Values can be deleted for a node. Doing so causes retrieval of the nearest ancestor's value instead:

```ts
specialColor.deleteValueFor(descendent);
specialColor.getValueFor(descendent); // "#FFFFFF"
```

## CSS Custom Property Emission

Unless configured not to, a DesignToken emits a token to CSS automatically whenever the value is set for a FASTElement. In the case when a DesignToken is assigned a [derived value](#derived-design-token-values), the CSS custom property will also be emitted when any dependent tokens change.

### DesignToken Default Style Roots
In order for *default* DesignToken values to be emitted to a CSS custom property, 
DesignToken will need to be configured:

```ts
DesignToken.create<number>('my-token').withDefault(2); // This will not immediately emit to a CSS custom property

DesignToken.registerDefaultStyleTarget();
```

Invoking `DesignToken.registerDefaultStyleTarget()` will cause CSS custom properties to be emitted for the entire document. A FASTElement can also be provided so that CSS custom properties are scoped to that target, or a structure implementing `PropertyTarget` can be provided for complete control over emission.

```ts
const target = document.querySelector("#style-target")! as FASTElement;
DesignToken.registerDefaultStyleTarget(target);
```

`DesignToken.unregisterDefaultStyleTarget()` can be invoked to remove default custom properties from a root and prevent further emission to that root.

```ts
// ...
DesignToken.unregisterDefaultStyleTarget(target);
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

A DesignToken can be configured **not** to emit to a CSS custom property by passing a configuration object without a `cssCustomPropertyName`:

```ts
DesignToken.create<number>({ 
    name: "my-token"
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

`DesignToken` supports subscription, notifying a subscriber when a value changes for a node.

**Example: Subscribe to changes for any node**

```ts
const subscriber = {
    handleChange<T extends DesignToken<any>>(token: DesignToken<T>, record: DesignTokenChangeRecord<T>) {
        console.log(`DesignToken ${record.token} changed for ${record.target}`);
    }
};

specialColor.subscribe(subscriber);
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

In the examples above, the design token is always being set to a simple string value. But, we can also set a Design Token to be a function that *derives* a value. A derived value receives a `DesignTokenResolver` as its only argument and must return a value with a type matching the Design Token:

```ts
const token = DesignToken.create<number>("token");
token.setValueFor(target, (resolve) => 12);
```

The above example is contrived, but resolver can be used to retrieve *other* Design Token values:

**Example: A derived token value that uses another design token**
```ts
const foregroundColor = DesignToken.create<string>("foreground-color");

foregroundColor.setValueFor(target, (resolve) => 
     resolve(specialColor) === "#FFFFFF"
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

## SSR
`DesignToken` can be used with `@microsoft/fast-ssr`, but must be configured to do so.

### Configuring the Resolution Strategy
The resolution strategy is a configurable abstraction that allows `DesignToken` to build element hierarchies and resolve token values, and must be configured with a strategy supported by `@microsoft/fast-ssr`.

```ts
// server.js
import { DesignToken, DesignTokenEventResolutionStrategy} from "@microsoft/fast-foundation";

DesignToken.withStrategy(DesignTokenEventResolutionStrategy);
```

### Default Value CSS
DesignToken is generally used to emit default values to the document. During template rendering in an SSR environment, there is no document to emit CSS to. Instead, a lightweight `PropertyTarget`, such as the provided `DesignTokenStyleTarget`, should be used to collect CSS values for tokens. The CSS can then be retrieved and interpolated into the SSR response.

For more info on `@microsoft/fast-ssr` see the (SSR Documentation)[https://github.com/microsoft/fast/blob/master/packages/web-components/fast-ssr/README.md], and for an SSR example using `DesignToken` see the (SSR Example App)[https://github.com/microsoft/fast/tree/master/examples/ssr].

```ts
import { DesignTokenStyleTarget } from "@microsoft/fast-foundation";

const styleTarget = new DesignTokenStyleTarget();
DesignToken.registerDefaultStyleTarget(styleTarget);

const defaultStyles = `<style>:root{${styleTarget.cssText}}</style>`;
```