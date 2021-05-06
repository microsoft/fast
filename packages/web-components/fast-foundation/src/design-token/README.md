**This guide describes APIs and systems that are alpha and subject to change. Please keep that in mind before using these tools. If you have feedback, please don't hesitate to file an issue!**

# Design Tokens
The FAST Design Token implementation is designed to provide first-class support for Design Tokens and make setting, getting, and using Design Tokens simple.

## What is a Design Token
A Design Token is a semantic, named variable used to describe a Design System. They often describe design concepts like typography, color, sizes, UI spacing, etc. FAST encourages checking out [the Design Tokens Community Group](https://github.com/design-tokens/community-group#design-tokens) for more information on Design Tokens themselves.

## Using Design Tokens in FAST
This usage guide walks through creating and using a Design Token *background-color*, which is represented in code as a hexadecimal color string.

### 1. Create a Token
The first step to using a token is to create it:

```ts
import { DesignToken } from "@microsoft/fast-foundation";

export const fillColor = DesignToken.create<string>("fill-color");
```

The type assertion informs what types the token can be set to (and what type will be retrieved), and the name parameter will serve as the CSS Custom Property name (more on that later).

### 2. Setting the Design Token
A `DesignToken` *value* is set for a `FASTElement` or `HTMLBodyElement` node. This allows tokens to be set to different values for distinct DOM trees:

```ts
const ancestor = document.querySelector("my-element") as FASTElement;
const descendent = ancestor.querySelector("my-element") as FASTElement;

fillColor.setValueFor(ancestor, "#FFFFFF");
fillColor.setValueFor(descendent, "#F7F7F7");
 ```

### 3. Getting the Design Token value
Once the value is set for a node, the value is available to use for that node or any descendent node. The value returned will be the value set for the nearest ancestor (or the element itself).

```ts
fillColor.getValueFor(ancestor); // "#FFFFFF"
fillColor.getValueFor(descendent); // "#F7F7F7"
```

### 4. Deleting Design Token values
Values can be deleted for a node. Doing so causes retrieval of the nearest ancestor's value instead:

```ts
fillColor.deleteValueFor(descendent);
fillColor.getValueFor(descendent); // "#FFFFFF"
```

### 5. Setting a default value
A default value can be set for a token, so that the default value is returned from `getValueFor()` in cases where no other token value is found for a node tree.

```ts
fillColor.withDefault("#FFFFFF");
```
### 6. Emit a token to a CSS Custom Property
DesignToken emits a token to CSS automatically whenever the value is set for an element. In the case when a DesignToken is assigned a (derived value)[#derived-design-token-values], the CSS custom property will also be emitted when any dependent tokens change.

#### Values with a 'createCSS' method
It is sometimes useful to be able to set a token to a complex object but still use that value in CSS. If a DesignToken is assigned a value with a `createCSS` method on it, the product of that method will be used when emitting to a CSS custom property instead of the Design Token value itself:

```ts
interface RGBColor {
    r: number;
    g: number;
    b: number;
    createCSS(): string;
}
const fancyFillColor = DesignToken.create<RGBColor>("fancy-fill-color");
const value = {
    r: 255,
    g: 0,
    b: 0,
    createCSS() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}
fancyFillColor.setValueFor(descendent, value)
```

## Using Design Tokens in CSS
Any token can be used directly in a FAST stylesheet by using the Design Token as a CSS directive. Assuming the token value has been set for the element or some ancestor element, the value of the token embedded in the stylesheet will be the token value for that element instance.

```ts
import { css } from "@microsoft/fast-element";

const styles = css`
    :host {
        background: ${fillColor};
    }
`
```

At runtime, the directive is replaced with a CSS custom property, and the Directive ensures that the CSS custom property is added for the element.

## Derived Design Token Values
In the examples above, the design token is always being set to a simple string value. But, we can also set a Design Token to be a function that *derives* a value. A derived value receives the target element as it's only argument and must return a value with a type matching the Design Token:

```ts
const token = DesignToken.create<number>("token");
token.setValueFor(target, (element) => 12);
```

The above example is contrived, but the target element can be used to retrieve *other* Design Tokens:

**Example: A derived token value that uses another design token**
```ts
const foregroundColor = DesignToken.create<string>("foreground-color");

foregroundColor.setValueFor(target, (element) => 
     fillColor.getValueFor(element) === "#FFFFFF"
        ? "#2B2B2B" 
        : "#262626"
);
```

For derived Design Token values, any change to dependent tokens will force the derived value to update (and update the CSS custom property if applicable). The same is true if an observable property is used by the derived value:

```ts
import { observable } from "@microsoft/fast-element";

class ModeManager {
    @observable
    mode: "light" | "dark" = "light"
}

const modeManager = new ModeManager();

fillColor.setValueFor(target, () => modeManager.mode === "light" ? "#FFFFFF" : "#242424");
foregroundColor.setValueFor(target, () => modeManager.mode === "light" ? "#2B2B2B" : "#F5F5F5");

modeManager.mode = "dark"; // Forces the derived tokens to re-evaluate and CSS custom properties to update if applicable
```


## Aliasing Design Tokens
In some design systems, Design Tokens may have complex hierarchies with tokens referencing other tokens. This can be accomplished by setting a Design Token to another Design Token.

```ts
const neutralFill = DesignToken.create<string>("neutral-fill");
const buttonFill = DesignToken.create<string>("button-fill");

neutralFill.setValueFor(target, "#EDEDED");
buttonFill.setValueFor(target, neutralFill);

buttonFill.getValueFor(target); // "#EDEDED"
```
