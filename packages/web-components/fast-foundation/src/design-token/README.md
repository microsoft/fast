**This guide describes APIs and systems that are alpha and subject to change. Please keep that in mind before using these tools. If you have feedback, please don't hesitate to file an issue!**

# Design Tokens
The FAST Design Token implementation is designed to provide first-class support for Design Tokens and make setting, getting, and using Design Tokens simple.

## What is a Design Token
A Design Token is a semantic, named variable used to describe a Design System. They often describe design concepts like typography, color, sizes, UI spacing, etc. FAST encourages checking out [https://github.com/design-tokens/community-group#design-tokens](the Design Tokens Community Group) for more information on Design Tokens themselves.

## Using Design Tokens in FAST
This usage guide walks through creating and using a Design Token *accent-color*, which is represented in code as a hexadecimal color string.

### 1. Create a Token
The first step to using a token is to create it:

```ts
import { DesignToken } from "@microsoft/fast-foundation";

export const accentColor = DesignToken.create<string>("accent-color");
```

The type assertion informs what types the token can be set to (and what type will be retrieved), and the name parameter will serve as the CSS Custom Property name (more on that later).

### 2. Setting the Design Token
A `DesignToken` *value* is set for a `FASTElement` node. This allows tokens to be set to different values for distinct DOM trees:

```ts
const ancestor = document.querySelector("my-element") as FASTElement & HTMLElement;
const descendent = ancestor.querySelector("my-element")

accentColor.setValueFor(ancestor, "#DA1A5F");
accentColor.setValueFor(descendent, "#ADA1F5");
 ```

### 3. Getting the Design Token value
Once the value is set for a node, the value is available to use for that node or any descendent node. The value returned will be the value set for the nearest ancestor (or the element itself).

```ts
accentColor.getValueFor(ancestor); // "#DA1A5F"
accentColor.getValueFor(descendent); // "#ADA1F5"
```

### 4. Deleting Design Token values
Values can be deleted for a node. Doing so causes retrieval of the nearest ancestors value instead:

```ts
accentColor.deleteValueFor(descendent);
accentColor.getValueFor(descendent); // "#DA1A5F"
```

### 5. Emit a token to a CSS Custom Property
A Design Token can be made available in CSS through CSS custom properties. The custom property value will be set to the token's value for the supplied target element.

```ts
accentColor.addCustomPropertyFor(descendent); // --accent-color: #DA1A5F;
```

If the value of the token *changes* for the target element, the CSS custom property will be updated to the new value:

```ts
accentColor.setValueFor(descendent, "#FF0000"); // --accent-color: #FF0000;
```

The CSS custom property can also be removed through a parallel method:

```ts
accentColor.removeCustomPropertyFor(descendent);
```

## Using Design Tokens in CSS
Any token can be used directly in a FAST stylesheet by using the Design Token as a CSS directive. Assuming the token value has been set for the element or some ancestor element, the value of the token embedded in the stylesheet will be the token value for that element instance.

```ts
import { css } from "@microsoft/fast-element";

const styles = css`
    :host {
        color: ${accentColor};
    }
`
```

At runtime, the directive is replaced with a CSS custom property, and the Directive also ensure that the CSS custom property is added for the element.

## Derived Design Token Values
In the examples above, the design token is always being set to a simple string value. But, we can also set a Design Token to be a function that *derives* a value. A derived value receives the target element as it's only argument and must return a value with a type matching the Design Token:

```ts
const token = DesignToken.create<number>("token");
token.setValueFor(target, (element) => 12);
```

The above example is contrived, but the target element can be used to retrieve *other* Design Tokens:

**Example: A derived token value that uses another design token**
```ts
const multiplier = DesignToken.create<number>("multiplier");
const size = DesignToken.create("size");
multiplier.setValueFor(target, 2);

size.setValueFor(target, (element) => {
    return 12 * multiplier.getValueFor(element);
});
```

For derived Design Token values, any change to dependent tokens will force the derived value to update (and update the CSS custom property if applicable). The same is true if an observable property is used by the derived value:

```ts
import { observable } from "@microsoft/fast-element";

class ModeManager {
    @observable
    mode: "light" | "dark" = "light"
}

const modeManager = new ModeManager();

const foreground = DesignToken.create<string>("foreground");
foreground.setValueFor(target, () => modeManager.mode === "light" ? "#000000" : "#FFFFFF");

modeManager.mode = "dark"; // Forces the derived token to re-evaluate and CSS custom properties to update if applicable
```
