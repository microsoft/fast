# Design Token Resolution with Dependency Injection
This repo explores cascading design-token infrastructure platformed off dependency injection.

## TODO:
### P1
- [x] Can get access to read/write design tokens using ~~class decorator~~ mixin. (This sets up element as DesignToken container).
- [ ] DesignTokens get emitted to CSSStyleSheet instances, one sheet per token value.
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