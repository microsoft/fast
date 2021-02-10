# General-Purpose Primitives
## Design Tokens

### Requirements
- Accessible relative to DOM location
- Observable
- Container must reflect to CSS custom property (when configured)
A design token is a simple value (calculated or static) that can be consumed through DI containers.

### `DesignToken`
Fundamentally, a Design Token is just a named value. This value can change, so it must be observable. To facilitate observation using `@microsoft/fast-element` infrastructure, a `DesignToken` will be represented by the following interface:

```ts
interface DesignToken<T> {
    /** @observable */
    value: T;
}
```

In implementation, there are actually two types of Design Tokens:
1. Simple Design Tokens (a token without dependencies or calculating logic, e.g. FAST's existing "design-unit" is a simple Design Token.)  
2. Derived Design Tokens (a token with dependencies and calculating logic, e.g. FAST's color recipes). 

Effectively, a `DerivedDesignToken` is responsible for *updating itself*. It can thus be minimally represented by the following interface:

```ts
interface DerivedDesignToken<T> {
    /** @observable */
    readonly value: T;
}
```

Each Design Token will have a DI interface, with concrete values being resolved by DI containers (see below).

### `DesignTokens`
There are 2 concerns that make using raw DI containers un-suitable for directly registering Design Token DI implementations:
1. Some Design Tokens, when registered or mutated, should be reflected to CSS custom properties.
2. Due to the readonly nature of a `DerviedDesignToken`, *setting* a `DerviedDesignToken` to another value (e.g. setting `backgroundColor` from `neutralFillRest` to `neutralFillHover`) requires managing any observers that may be observing the underlying value. [See Managing Derived Token Observers](###managing-derived-token-observers) for details.

To address these two concerns, a `DesignTokens` interface and concrete implementation can help us:

```ts
interface DesignTokens {
    /**
     * Constructed with an element or FASTElement, which serves
     * as the DI container owner and target for CSS custom properties.
     */
    new(host: HTMLElement | FASTElement): DesignTokens;

    /**
     * Set a design token
     */
    set<T>(token: Key, value: DesignToken<T> | DerivedDesignToken<T>);

    /**
     * Gets a design token, effectively an alias for Container.get()
     */ 
    get<T>(token: Key): DesignToken<T> | DerivedDesignToken<T>;

    /**
     * Alias one token to another, providing scaffolding for infinite
     * layers of token abstraction
     */
    static alias(originalKey: Key, aliasKey: Key);

    /**
     * Maps a DI key to a css custom property name. Whenever the key is set, 
     * the value will be reflected to a CSS custom property on the host element.
     */
    static reflectToCSS(key: Key, propertyName: string); // How do I know what this will be? How do I take a dependency on this token?
}
```


### Using in CSS
To use a design token in CSS, we can leverage CSS custom properties. To do this, we'll leverage `Behavior` and `ElementStyles.withBehavior()` (or hopefully the less verbose css directive)[https://github.com/microsoft/fast/issues/3748].

When binding, the behavior will get the nearest `DesignTokens` for the element provided to `Behavior.bind()`. It will then ask to use the Design Token as a CSS custom property. Using as a CSS custom property will cause `DesignTokens` to write the CSS custom property to the owner, making it available in CSS.
```ts
interface CustomPropertyTarget {
    static getOrCreateCustomPropertyTarget(host: HTMLElement | FASTElement): CustomPropertyTarget;

    set(key: Key);
}
```

```ts
interface DesignTokens {
    useCustomProperty(token: Key);
}
```
>>> What does this API look like?



































### Implementation
#### Reflecting to CSS Custom Properties
How do we establish a relationship between DesignToken interfaces and CSS custom properties in a way that avoids redundant setting of property values?

One option would be to provide a static method that can be invoked to map a key to a property name. Internally, this creates a map that can be referenced when keys are registered. Upon registration, the property is written to the host.
```ts
interface DesignTokens {
    static cssCustomProperty(key, propertyName);
}
```

Another option would be to require a `DesignToken` to be defined, either by the root `DesignTokens` interface of as a static method on the concrete implementation.

```ts
interface DesignTokenDefinition<T> {
    defaultValue: T
    cssCustomProperty?: string;
    /* etc */
}

interface DesignTokens {
    define<T>(key: Key, definition: DesignTokenDefinition<T>)
}
```

Yet another option would be to require registration in the `DesignSystem`:
```ts
    DesignSystem.defineDesignToken(key: Key, definition: DesignTokenDefinition<T>)
```

The benefit to a definition step is it provides a future extensibility point.

#### Aliasing Tokens
Aliasing tokens can be performed by the underlying DI resolving mechanisms, and will allow infinite abstraction layers over the tokens. The `DesignTokens` type will implement a static method to do this:

```ts
interface DesignTokens {
    static alias(originalKey, newKey)
}
```

### Managing Derived Token Observers 
For a `DesignToken` that is mutable, we can simply *set* the value. For `DerivedDesignTokens` this is a bit more complicated though, because setting the value *redefines* the value. Take the example of setting `backgroundColor` to a color recipe (derived design token) from another token (say for a rest -> hover state change). The product of the recipe is derived. This in effect *changes* the dependency being consumed by DI consumers.

One way to circumvent this challenge is to introduce a proxy object to which the value is reflected. Internally, the `DesignTokens` instance would hold a `Map` of `DesignToken` interface keys to plain objects w/ a `value` property. When a `DesignToken` is set to a new derived property, the proxy would be mutated to the value of the new token. 
