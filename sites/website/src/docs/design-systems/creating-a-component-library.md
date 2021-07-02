---
id: creating-a-component-library
title: Creating a Component Library
sidebar_label: Creating a Component Library
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/creating-a-component-library.md
---

FAST exposes powerful abstractions for component library authors to allow ample opportunity for application authors to configure, augment, and override a FAST component. For example:
- Custom element tag names are easily configured and disambiguated.
- Custom elements are explicitly registered to avoid tree-shaking.
- templates, styles, default slotted content, and arbitrary component configurations are all configurable by application authors.
- Shadow DOM options are easily configurable.
All these configuration capabilities are designed to give application authors the flexibility necessary to align library components to application or business requirements.
This section walks through the process of defining a component from a library author’s perspective, detailing component, template, and style creation that supports the configuration capabilities described above.

## Defining components
Defining a component for a library is easy; simply extend the `FoundationElement` base class from `@microsoft/fast-foundation`. `FoundationElement` is a light extension of `FASTElement` that supports element configuration during component registration.

```ts
import { FoundationElement } from “@microsoft/fast-foundation”;

export class MyElement extends FoundationElement {
	/* component implementation */
}
```

### Define Templates and Styles 
There are two ways to define templates and styles. 
Just like `FASTElement`, a component that extends `FoundationElement` can be used with the [`html`](/docs/fast-element/declaring-templates) and [`css`](/docs/fast-element/leveraging-css) tagged template literals.

```ts
import { html, css  } from "@microsoft/fast-element";

const myElementStyles = css`/* ... */`;
const myElementTemplate = html`<!-- ... -->`;
```

A `FoundationElement` also supports a lazily-defined template and style type. This lazy option is a function invoked with an [ElementDefinitionContext](/docs/api/fast-foundation.elementdefinitioncontext) and [FoundationElementDefinition](/docs/api/fast-foundation.foundationelementdefinition) options, providing opportunity to adjust the template or styles based on how the element or other elements are defined. Lazy template and style definitions provide incredible flexibility, and is what can allow application authors to re-name component tag names, override default slotted content, and communicate any component-specific configuration options:

```ts
import { html, css  } from "@microsoft/fast-element";
import { ElementDefinitionContext, FoundationElementDefinition } from "@microsoft/fast-foundation";

const myElementStyles = (
context: ElementDefinitionContext,
definition: FoundationElementDefinition)
 => css`/* ... */`;
const myElementTemplate = (
context: ElementDefinitionContext,
definition: FoundationElementDefinition
) => html`<!-- ... -->`;
```

Let’s take a closer look at what these two arguments give us.

#### What is the `ElementDefinitionContext`?
// TODO Rob - I'm not sure how to explain this argument well or what all of it's capabilities are

Importantly, the ElementDefinitionContext can be used to inspect the tag-name for other components using the `ElementDefinitionContext.tagFor()` method. This allows usage of other library components in a template or stylesheet without knowing ahead of time what the tag-name for the element will be:

```ts
import { html } from "@microsoft/fast-element";
import { FASTButton } from "@microsoft/fast-components";
import type { ElementDefinitionContext } from "@microsoft/fast-foundation";

const template = (context: ElementDefinitionContext) => {
	const buttonTag = context.tagFor(FASTButton);

	return html`<${buttonTag}>Click me!</${buttonTag}>`
}
```

#### What is the `FoundationElementDefinition`?
The `FoundationElementDefinition` is the configuration for which the element was defined, allowing inspection of the aggregated options configuration for the component.

This definition can be extended arbitrarily by components during registration, which is what facilitates default slotted content overrides and arbitrary element configuration:

```ts
import { html } from "@microsoft/fast-element";
import { ElementDefinitionContext, FoundationElementDefinition } from "@microsoft/fast-foundation";

interface MyElementDefinition extends FoundationElementDefinition {
    defaultContent?: string;
}

const template = (context: ElementDefinitionContext, definition: MyElementDefinition) => {
    return html`<slot>${definition.defaultContent}</slot>`
}
```

During component registration with the Design System, an application author can provide a `defaultContent` field as a configuration, which is used by the template if it exists.

### Compose and Export Registration
Lastly, create and export the registration function so that application authors can register the component in their Design System:

```ts
export const myElementRegistration = MyElement.compose({
  baseName: ‘my-element’,
  template,
  styles,
  defaultContent: "Click me!"
})
```

Note that the registration is composed with a "defaultContent" value. This value can be provided during composition or as a conditional in the template; either approach will work.

### Registering Library Components in an Application
To register the component, an application author will import the registration and register it in their DesignSystem, overriding any properties as necessary:

```ts
import { myElementRegistration } from "your-package";
import { DesignSystem } from "@microsoft/fast-foundation";

DesignSystem.getOrCreate().register(
	myElementRegistration({defaultContent: "Don’t click me!"})
)
```