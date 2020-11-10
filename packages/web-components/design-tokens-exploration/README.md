# Design Token Resolution with Dependency Injection
This repo explores cascading design-token infrastructure platformed off dependency injection.

## TODO:
### P1
- [x] DesignTokenLibrary for getting and setting hierarchial design tokens.
- [x] Can get access to read/write design tokens using ~~class decorator~~ mixin. (This sets up element as DesignToken container).
- [ ] DesignTokens get emitted to CSSStyleSheet instances, one sheet per token value.
- [ ] DesignTokens can be configured to be the product of pure functions that depend on properties of the DesignToken library.
 - [ ] Think through what this means for background-color. How do we *change* background color? Can we do that declaratively? How is this used in stylesheets?
- [ ] ElementStyles can declare dependencies on color recipes.
- [ ] Color recipes can declare dependencies on DesignTokens.
- [ ] Color recipes emit CSSStyleSheet instances that can get attached.

### P2
- [ ] Can get access to read only design tokens using class decorator or property decorator.


## Problem Cases
### Resolution of DesignTokens prior to DOM connection
Suppose the following code:

```js
const element = document.createElement("fast-card");
element.designTokens;
```

The above will resolve the FASTDesignTokenLibrary dependency to the designTokens property, however the element isn't connected to the DOM so the default registration will be resolved.
**How can we invalidate that dependency** after DOM connection so that the DesignToken hierarchy is accurate?

> This problem case has been addressed by the addition of re-resolution behavior to a new `DOMContainer` type and `createDOMInterface` functions. `createDOMInterface` can be provided flag to determine if the container should be re-resolved when element connection changes. It can also be provided a function that receives the previous and next resolved dependency values in case any reconciliation needs to happen when the value changes.