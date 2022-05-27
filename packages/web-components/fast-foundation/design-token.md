```ts
/**
 * Responsible for resolving design tokens inside of DerivableDesignTokenValue instance.
 * Will resolve the token value relative to where it is being evaluated. When the token being
 * resolved is the same as the token being assigned, resolution will resolve the upstream value
 * to avoid recursive resolution.
 */
export type DesignTokenValueResolver = <T>(token: DesignToken<T>) => T;

export type StaticDesignTokenValue<T> = T;
export type DerivableDesignTokenValue<T> = (resolver: DesignTokenResolver) => T
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivableDesignTokenValue<T>;

// Essentially the same interface as before
export interface DesignToken<T> {
    getValueFor(target: FASTElement): StaticDesignTokenValue<T>;
    setValueFor(target: FASTElement, value: DesignTokenValue<T>);
}


// Example derived token value
const token = DesignToken.create<number>("token");
const dependency = DesignToken.create<number>("dependency");

const someEl = document.querySelector("some-element");

token.setValueFor(someEl, (resolve) => {
    return resolve(dependency) * 2;
});


// What happens in this case?
// 1. Derived design token values get converted to BindingObserver instances so the value can be watched
// 2. .setValueFor() will notify for the element if the value is changed, so the binding will be notified
// 3. Notification causes re-resolution 
// Is the dependent token considered a dependency in this case? - no, because it's not the token itself that is a dependency, it is the value for a specific instance.
token.setValueFor(someEl, (resolve) => {
    return dependency.getValueFor(someEl) * 2;
});
```

Providing a 'resolve' function to retrieve design token values allows us to easily know which tokens are being used - which are dependencies of what values.
- We know this from .getValueFor as well. The issue w/ .getValueFor is we need to provide an element to retrieve values for it. This opposes goals of polymorphism and also makes it harder to implement `fillColor` pattern, where the value needs to be retrieved from the parent.