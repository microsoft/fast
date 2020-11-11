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

> This issue is solved by emitting a change notification when the value updates after connection / disconnection. Any concerned implementation can attach a listener to
the decorated property with `Observable.getNotifier(target).subscribe(...)`.

### @microsoft/fast-element
We'll need to change the notifier code so that a subscriber receives previous and next values when the `handleChange` is invoked. The signature should become:

```ts
interface Subscriber<T> {
    // We should probably enhance the type so source isn't `any` and key exists in source
    handleChange(source: any, key: string, previous: T, next: T): void; 
}
```