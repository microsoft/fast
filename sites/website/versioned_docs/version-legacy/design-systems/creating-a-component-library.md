---
id: creating-a-component-library
title: Creating a Component Library
sidebar_label: Creating a Component Library
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/design-systems/creating-a-component-library.md
description: Not only is FAST great for creating individual components, but it also shines when creating libraries or systems of components.
keywords:
    - foundation components
    - design systems
---

Not only is FAST great for creating individual components, but it also shines when creating libraries or systems of components. FAST Foundation exposes several powerful abstractions in order to enable library authors to provide ergonomic APIs to application authors. These APIs ensure that app authors who consume your library have a consistent way to configure, augment, and override various details of the components. For example:

- Custom element tag names are easily configured and disambiguated.
- Custom elements are explicitly registered to avoid tree-shaking.
- Templates, styles, default slotted content, and arbitrary component configurations are all configurable by application authors.
- Shadow DOM options are easily configurable.

All these configuration capabilities are designed to give application authors the flexibility necessary to align library components to application or business requirements. This section walks through the process of defining a component from a library author’s perspective, detailing component, template, and style creation that supports the configuration capabilities described above.

## Defining components

To opt into the features above, begin by extending your components from the `FoundationElement` base class in `@microsoft/fast-foundation` rather than `FASTElement`. `FoundationElement` is a light extension of `FASTElement` that supports element configuration during component registration as well as DOM-scoped, overridable templates and styles. Here's an example of a basic `Counter` component that inherits from `FoundationElement`.

```ts
import { FoundationElement } from "@microsoft/fast-foundation";
import { attr } from "@microsoft/fast-element";

export class Counter extends FoundationElement {
    @attr count = 0;

    increment() {
        this.count++;
    }
}
```

One important detail to note is that we do not use the `@customElement` decorator in this case. The `@customElement` decorator forces immediate template and style resolution, and platform component element name registration. This is fine when building application components, or components not intended to be used as part of a library in another application. However, if used for library components, it prevents the consumer of the component from having the opportunity to customize the component in ways that might be critical for their app. `FoundationElement` helps address this challenge.

### Define Templates and Styles 

With our `Counter` component class written, we now need to define its templates and styles. There are two ways to accomplish this. Just like `FASTElement`, a component that extends `FoundationElement` can be used with the [`html`](../fast-element/declaring-templates.md) and [`css`](../fast-element/leveraging-css.md) tagged template literals. So, we could define our template and styles in the same fashion as any other component, like this:

```ts
import { html, css  } from "@microsoft/fast-element";

const counterStyles = css`/* ... */`;
const counterTemplate = html`<!-- ... -->`;
```

However, a `FoundationElement` also supports a lazily-defined template and style type. This lazy option is a function invoked with [ElementDefinitionContext](../api/fast-foundation.elementdefinitioncontext.md) and [FoundationElementDefinition](../api/fast-foundation.foundationelementdefinition.md) options, providing opportunity to adjust the template or styles based on how the element or other elements are defined. Lazy template and style definitions provide incredible flexibility and are what can allow application authors to re-name component tag names, override default slotted content, and communicate any component-specific configuration options. Here's how we would convert the previous standard templates and styles into lazy templates and styles:

```ts
import { html, css  } from "@microsoft/fast-element";
import { ElementDefinitionContext, FoundationElementDefinition } from "@microsoft/fast-foundation";

const counterStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`/* ... */`;

const counterTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`<!-- ... -->`;
```

Let’s take a closer look at what the two arguments to these lazily evaluated functions give us.

#### What is the `ElementDefinitionContext`?

The first argument is the `ElementDefinitionContext`. This context object provides information that is available *during* the attempt to register the element. For example, it will tell you the HTML element tag `name` that the component will be defined as. You can also see what the default `shadowRootMode` of the `DesignSystem` is. Most of the other APIs are used internally by `FoundationElement.compose` (see below) to define the element, but one particular API of note is the `tagFor()` method of the context. This API is used to inspect the tag-name of other components and allows usage of other library components in a template or stylesheet without knowing ahead of time what the tag-name for the element will be. Here's an example of how the reusable `Counter` component would leverage this to ensure that the `Button`'s tag name is correct, even if the app developer decides to rename `Button` in some way.

```ts
import { html, css } from "@microsoft/fast-element";
import { Button } from "@microsoft/fast-components";
import type { ElementDefinitionContext } from "@microsoft/fast-foundation";

const counterTemplate = (context: ElementDefinitionContext) => {
    const buttonTag = context.tagFor(Button);

    return html`
        <div>The count is ${x => x.count}.</div>
        <${buttonTag} @click=${x => x.increment()}>Count!</${buttonTag}>
    `;
}

const counterStyles = (context: ElementDefinitionContext) => {
    const buttonTag = context.tagFor(Button);

    return css`
        ${buttonTag} {
            margin-inline-start: 12px;
        }
    `;
}
```

#### What is the `FoundationElementDefinition`?

The `FoundationElementDefinition` is the configuration for the element itself. This argument allows you to inspect the aggregated options configured for the component, giving you access to the `shadowOptions`, `elementOptions`, and more.

This definition can also be arbitrarily extended by library authors, allowing custom configuration to flow through the registration process. For example, this mechanism can facilitate default slotted content overrides. To see how our `Counter` could leverage this, let's enable the `Button` content to be overridden by the application developer. Here's what that would look like:

```ts
import { html } from "@microsoft/fast-element";
import { ElementDefinitionContext, FoundationElementDefinition } from "@microsoft/fast-foundation";
import { Button } from "@microsoft/fast-components";

// Extend the configuration with custom properties
interface CounterDefinition extends FoundationElementDefinition {
    defaultButtonContent?: string;
}

const counterTemplate = (context: ElementDefinitionContext, definition: CounterDefinition) => {
    const buttonTag = context.tagFor(Button);

    return html`
        <div>The count is ${x => x.count}.</div>
        <${buttonTag} @click=${x => x.increment()}>
            <slot>${definition.defaultButtonContent}</slot> <!--Use the custom configuration-->
        </${buttonTag}>
    `;
}
```

When the library author creates the registration function (see next section), they can provide the default content. Then, during component registration with the `DesignSystem`, an application author can optionally provide a `defaultButtonContent` field as a configuration to override this setting.

### Compose and Export Registration

The final step in the process is to create and export the registration function so that application authors can register the component in their `DesignSystem`. Here's how we would create the registration function for `Counter`, using our extended `CounterDefinition` configuration:

```ts
export const counter = Counter.compose<CounterDefinition>({
    baseName: 'counter',
    template,
    styles,
    defaultButtonContent: "Count!"
});
```

Here we provide the base component name of `counter`, which will be combined with the `DesignSystem` element prefix during registration. We also provide our lazy template and styles. Finally, we specify the `defaultButtonContent` value.

### Registering Library Components in an Application

To register the component, an application author will import the registration and register it in their `DesignSystem`, overriding any properties as necessary. For example, if this component had been created for the FAST Frame design system, then the following code could be used:

```ts
import { counter } from "your-package";
import { provideFASTDesignSystem, fastButton } from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton(),
        counter({ defaultButtonContent: "Please count." })
    );
```

The advantage of setting `defaultButtonContent` here is that it overrides the `Counter`'s default slotted content for **all** instances of `your-counter`. Instead of having to define it everywhere in the app that the button is used, the app author provides the configuration once in a centralized location. This can be extremely useful in scenarios where components contain default icons that the app author may need to swap.

## Defining a design system

The above examples show how to build a single component that can be flexibly registered with an existing design system. But, you can create your own design system as well. To do so, you would start with the base components defined in `@microsoft/fast-foundation` and compose them with your own styles. You would also define your own `DesignToken`s to be used within your styles. Finally, you would export a "provider function" for your community to use in setting everything up.

### FAST design system thinking

When creating a design system, it can be helpful to think in terms of layers and use cases.

1. **foundation components**: A reusable set of component classes and templates, independent of any design system, and designed for maximum flexibility.
2. **design system**: Leverages the flexibility of the foundation components, but adds the unique opinions of the design system (e.g. styles, element prefix, design tokens, theme colors, etc). It exports the component registration functions so that apps can decide what to use. This layer may also choose to "lock down" certain options so that the design system remains coherent when used.
3. **application**: Registers only the components needed by the app itself.
4. **features**: Only uses the components available in the app. Get access to design tokens to create feature-specific styled components in alignment with the design system.

Notice that the strength of the opinions increases as you proceed down the list, with each layer further constraining the system. When creating a design system, it's important to think through these use cases and consider how different scenarios are impacted.

### Composing a foundation component

Let's imagine that we want to add a `Button` to our design system. We only need to import the `@microsoft/fast-foundation` `Button` component class and template, and then compose them with our design system's button styles:

```ts
import {
    Button,
    buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { buttonStyles as styles } from "./special-button.styles";

export const specialButton = Button.compose({
    baseName: "button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

export const buttonStyles = styles;
```

As a practice, always be sure to export your styles independently as well. This enables the consumers of your components to build their own versions of your component, reusing and augmenting your styles as needed.

When authoring your own styles, you'll also want to leverage design tokens. Please see [the design token documentation](./design-tokens.md) for how to create and use design tokens.

### Creating a design system provider function

For convenience, and to ensure consistent design system configuration, it's a good idea to provide a simple function that sets up your design system. If we wanted to create a function for the "special" design system, we would use the following code:

```ts
export function provideSpecialDesignSystem(element?: HTMLElement): DesignSystem {
    return DesignSystem.getOrCreate(element).withPrefix("special");
}
```

The underlying `DesignSystem.getOrCreate` API gets the design system directly attached to the provided element. If one does not exist, it creates one. By default, if no element is provided, the design system is created on the `document.body`. Using this function abstracts those details and provides a much-improved set of ergonomics to those using your components, while also giving you the opportunity to bake in certain configuration yourself, such as defining the default element prefix.

Now consumers of your components can setup your design system in their application with the button component as follows:

```ts
provideSpecialDesignSystem()
    .register(
        specialButton()
    );
```
