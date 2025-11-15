# FASTElement

The `FASTElement` is our extension of the `HTMLElement`. As such it leverages the lifecycles but also requires additional setup before before the class `constructor` or the `connectedCallback` method is executed which are explained in the [overview](./ARCHITECTURE_OVERVIEW.md). This document explains specifically what `FASTElement` leverages inside the `HTMLElement`s lifecycle hooks.

For an explanation into `HTMLElement` lifecycle hooks refer to the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).

## A Custom Element is Detected by the Browser

Because the `FASTElement` is an extension of the `HTMLElement`, it makes use of the same lifecycle hooks and extends them with `$fastController`. It also initializes using another class `ElementController`, the methods this are called during the custom elements native `constructor`, `connectedCallback`, `disconnectedCallback`, and `attributeChangedCallback` lifecycle hooks.

### 🔄 **Lifecycle**: Initialization

```mermaid
flowchart TD
    A[A <code>FASTElement</code> web component is added to the <code>DOM</code>] --> B
    B[<code>FASTElement</code> initializes the <code>ElementController.forCustomElement</code> passing the Custom Element instance] --> C
    B --> F[Observables applied to the <code>FASTElement</code> are updated on the FAST global without values]
    C{Is an <code>ElementController</code> available?}
    C --> |yes|E
    C --> |no|D
    D[Initialize a new <code>ElementController</code> referred to as setting an element controller strategy]
    D --> F
    E[<code>ElementController</code> captures the Custom Element instance and the definition and attaches them to the <code>$fastController</code> which is then attached to the instance]
```

### 🔄 **Lifecycle**: Component is connected

```mermaid
flowchart TD
    A[browser <code>HTMLElement</code>'s <code>connectedCallback</code> is called] --> B
    B[<code>this.$fastController.connect</code> in FASTElement is called] --> C
    B --> D
    B --> E
    B --> F
    C[bind observables by capturing the Custom Elements properties and setting the values from the bound observables on the Custom Element]
    D[connect behaviors by call the <code>connectedCallback</code> on all behaviors]
    E[render template, execute an <code>ElementViewTemplate</code>'s render method]
    F[add styles either as an appended <code>StyleElement</code> node or an <code>adoptedStylesheet</code> which may include and attach behaviors]
```

#### Render Template

The rendering of the template on the `ElementController` is by the `renderTemplate` method which is called during the `ElementController.connect` method which is triggered by `HTMLElement`s `connectedCallback` lifecycle.

The `renderTemplate` identifies the Custom Element, and the shadow root associated with the Custom Element. This then places a rendering of the template (an `ElementView`) onto the internal `view` of the controller. When creating the `ElementView`/`HTMLView` using the `ViewTemplate.render`, the `Compile.compile()` method identifies a `DocumentFragment` either by using an existing `<template>` tag, or creating one to wrap the contents of the shadow root. A new `CompilationContext` is created and the `compileAttributes` function is called, this results in the replacement of the placeholder attributes initally set-up during the pre-render step with their values if a value has been assigned. The factories with the associated nodes identified are then passed to the context. The view then binds all behaviors to the source element. The `CompilationContext.createView` is executed with the `DocumentFragment` as the root, and returns an `HTMLView`. This `HTMLView` includes an `appendTo` method to attach the fragment to the host element, which it then does. It should be noted that the compiled HTML is a `string`, which when set on the `DocumentFragment` as `innerHTML`, this allows the browser to dictate the creation of HTML nodes.

### 🔄 **Lifecycle**: Component is disconnected

When a component is disconnected, a cleanup step is created to remove associated behaviors.

### 🔄 **Lifecycle**: Attribute has been changed

Attributes have an `AttributeDefinition` which allows for converters, attachment of the `<attributName>Changed` aspect of the `@attr` decorator among other capabilities.

```mermaid
flowchart TD
    A[The browser <code>HTMLElement</code>'s <code>attributeChangedCallback</code> is called] --> B
    B[<code>this.$fastController.onAttributeChangedCallback</code> in <code>FASTElement</code> is called] --> C
    C[calls the attribute definitions <code>onAttributeChangedCallback</code> method with the updated value] --> D
    D[An <code>Updates.enqueue</code> is called which places the update in the task queue which is then executed, these are performed async unless otherwise specified]
```

These changes are observed and similar to the way `Observables` work, they utilize an `Accessor` pattern which has a `getValue` and `setValue` in which DOM updates are applied.