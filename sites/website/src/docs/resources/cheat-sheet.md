---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---

# Cheat Sheet                                 
### [@microsoft/fast-components](https://www.fast.design/docs/components/getting-started)     

**A library that includes a common set of components found in many websites and apps.**       

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 
* Expresses Microsoft's [FAST Frame Design System](https://www.fast.design/docs/design-systems/fast-frame/).
* Use this library when you want to integrate [FAST Components](#using-components) into an existing site or app.

To install the components, use either npm or yarn:
```shell
npm install --save @microsoft/fast-components
``` 
```shell
yarn add @microsoft/fast-components
```

To use a Web Component as a custom element in HTML, the custom element must be registered.

```ts
import { 
    fastButton, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton() // custom element
    );
```

---
### [@fluentui/web-components](https://www.fast.design/docs/components/getting-started)

**A library that includes a common set of components found in many websites and apps.**

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 
* Expresses Microsoft's [Fluent Design System](https://www.microsoft.com/design/fluent/#/).      
* Use this library when you want components to look and feel like those found in Windows, Office, Teams, and Edge products.

To install the components, use either npm or yarn:
```shell
npm install --save @microsoft/fast-components
``` 
```shell
yarn add @microsoft/fast-components
```

To use a Web Component as a custom element in HTML, the custom element must be registered.

```ts
import { 
    fluentButton, 
    provideFluentDesignSystem 
} from "@fluentui/web-components";

provideFluentDesignSystem()
    .register(
        fluentButton()
    );
```
---
### [@microsoft/fast-foundation](https://www.fast.design/docs/introduction)

**A library that provides foundational building blocks that can be assembled to create new design systems and component libraries.**

* Exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.   
* Use this library when you want to implement something like Google's Material Design or Twitter Bootstrap.



---
### [@microsoft/fast-element](https://www.fast.design/docs/fast-element/getting-started)

**A library that is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components.**

* Provides a thin layer of opinions on top of Web Components, lifting the level of abstraction just enough to make it easier and FASTer to build components   
* Use this library when you want to create completely new web components. 
* See [Building Components](#building-components).

To install the fast-element library, use either npm or yarn:

```shell
npm install --save @microsoft/fast-element
```

```shell
yarn add @microsoft/fast-element
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { FASTElement } from '@microsoft/fast-element';
```

---
### [FAST Frame Design System](https://www.fast.design/docs/design-systems/fast-frame)

**A Design System composed of Web Components, Design Tokens, stylesheets, and styling tools.**

* Provides a highly configurable design system that you can drop into any app. 
* Provides a set of building blocks that you can use to construct your own design system.   
* Use FAST Frame when you have an existing app, or want to create your own [Design System](#design-system).

---

## Using Components

[@microsoft/fast-components]: A library that includes a common set of components found in many websites and apps.

### Setup

To register custom components:

```ts
import { 
    fastButton, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton() // desired custom component
    );
```

Or, register all available components:

```ts
import { 
    allComponents, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

Visit our Using Components [Getting Started Guide](https://www.fast.design/docs/components/getting-started) for more details, Tips, and Notes.

Launch our [Component Explorer](https://explore.fast.design/) to experience our [FAST Components](https://www.npmjs.com/package/@microsoft/fast-components) and development tools.

---
## Building Components
### Setup

To define a custom element:

```ts
import { FASTElement, customElement } from '@microsoft/fast-element';

@customElement('name-tag') // custom element being created
export class NameTag extends FASTElement {

}
```

With this in place, you can now use your name-tag element anywhere in HTML with the following markup:

```html
<name-tag></name-tag>
```


Visit our Building Components [Getting Started Guide](https://www.fast.design/docs/components/getting-started) for more details, Tips, and Notes.

### Attributes

Add content
### Observables

Add content
### Templates

Add content
### Styles

Add content


---
## Design System
### [Creating a Design System](https://www.fast.design/docs/design-systems/creating-a-component-library#defining-a-design-system)

* Start with the base components defined in `@microsoft/fast-foundation` and compose them with your own styles.

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

* Define your own DesignTokens to be used within your styles.

```ts
import { DesignToken } from "@microsoft/fast-foundation";

export const specialColor = DesignToken.create<string>("special-color");
```


* Export a "provider function" for your community to use in setting everything up.

```ts
export function provideSpecialDesignSystem(element?: HTMLElement): DesignSystem {
    return DesignSystem.getOrCreate(element).withPrefix("special");
}
```

### [Design Tokens](https://www.fast.design/docs/design-systems/design-tokens)

Creating a token:

```ts
import { DesignToken } from "@microsoft/fast-foundation";

export const specialColor = DesignToken.create<string>("special-color");
```

---

## [Contributing to FAST](https://www.fast.design/docs/community/join)

**There are two ways to contribute**:

1. Contribute changes to the `fast-components` design system.
2. Contribute changes to the documentation.

**Unsure of what to work on?**

- Here are [good first issues](https://github.com/Microsoft/fast/labels/community:good-first-issue).

**Connect with us**:

- Join our [Discord](https://discord.gg/FcSNfg4) server.
- Report bugs, request features through [Github](https://github.com/Microsoft/fast/issues/new/choose).
### Contributing to fast-component

```shell
cd packages/web-components/fast-components
yarn start
```

[Storybook](https://storybook.js.org/) will open in a browser window at `localhost:6006`.

### Contributing to documentation

```shell
cd sites/website
yarn start
```

[Docusaurus](https://docusaurus.io/) will open in a browser window at `localhost:3000`.
