---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---

# Cheat Sheet                                 
### [@microsoft/fast-components](https://www.fast.design/docs/components/getting-started)     

**A component library that implements Microsoft's [FAST Frame Design System](https://www.fast.design/docs/design-systems/fast-frame/).**

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 

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

**A component library that implements Microsoft's [Fluent Design System](https://www.microsoft.com/design/fluent/#/).**

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 

* Use this library when you want components to look and feel like those found in Microsoft products.

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

```ts
import {
  Button as FoundationButton,
  buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";

export class MyButton extends FoundationButton {
  ...
}

export const buttonStyles = css`
  :host {
    background-color: azure;
  }
`;

export const myButton = MyButton.compose({
  baseName: "button",
  baseClass: FoundationButton,
  template,
  styles: buttonStyles,
  shadowOptions: {
    delegatesFocus: true,
  },
});
```

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
* Provides a set of building blocks that you can customize to your own brand. 
* Use FAST Frame when you want a robust, adaptive, and accessible component library.



---

## Using Components
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

With the components registered, add any component to the HTML.

```html
<fast-button>Hello world</fast-button>
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

### [Attributes](https://www.fast.design/docs/fast-element/defining-elements#customizing-attributes)

To add attributes to your HTML element, create properties decorated by the @attr decorator:

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
```

To use a Web Component with Attributes:

```html
<name-tag greeting="Hola"></name-tag>
```

See [Customizing attributes](https://www.fast.design/docs/fast-element/defining-elements#customizing-attributes).

### [Templates](https://www.fast.design/docs/fast-element/declaring-templates)

To create an HTML template for an element, import and use the html tagged template helper and pass the template to the @customElement decorator.

```ts
import { FASTElement, customElement, attr, html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">TODO: Name Here</div>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

### [Styles](https://www.fast.design/docs/fast-element/leveraging-css)

`FASTElement` provides a css tagged template helper to allow creating and re-using CSS. 

Adding CSS to a `FASTElement`:

```ts
import { html, css, customElement, attr, FASTElement } from "@microsoft/fast-element";

const template = html<NameTag>`
  ...
`;

const styles = css`
  :host {
    display: inline-block;
    background: var(--fill-color);
    box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0,0,0,.5);
  }

  :host([hidden]) { 
    display: none;
  }

  .header {
    margin: 16px 0;
    position: relative;
  }

  h3 {
    font-weight: bold;
    font-family: 'Source Sans Pro';
    font-size: 32px;
  }
`;

@customElement({
  name: 'name-tag',
  template,
  styles
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

### [Observables](https://www.fast.design/docs/fast-element/observables-and-state#observable-features)

To enable binding tracking and change notification, properties must be decorated with either @attr or @observable. Use @attr for primitive properties (string, bool, number) that are intended to be surfaced on your element as HTML attributes. Use @observable for all other properties.


```ts
import { Observable } from '@microsoft/fast-element';

export class Person {
  private _firstName: string;
  private _lastName: string;

  get firstName() {
    Observable.track(this, 'firstName');
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
    Observable.notify(this, 'firstName');
  }

  get lastName() {
    Observable.track(this, 'lastName');
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
    Observable.notify(this, 'lastName');
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

---
## Design System
### [Creating a Design System](https://www.fast.design/docs/design-systems/creating-a-component-library#defining-a-design-system)

1. Start with the base components defined in `@microsoft/fast-foundation` and compose them with your own styles.

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




2. Export a "provider function" for your community to use in setting everything up.

```ts
export function provideSpecialDesignSystem(element?: HTMLElement): DesignSystem {
    return DesignSystem.getOrCreate(element).withPrefix("special");
}
```

### [Design Tokens](https://www.fast.design/docs/design-systems/design-tokens)

Creating/configuring a custom design token:

```ts
import { DesignToken } from "@microsoft/fast-foundation";

// create a design token
export const specialColor = DesignToken.create<string>("special-color");

// use the design token to build styles
const styles = css`
  :host {
    background: ${specialColor};
  }
`;

const ancestor = document.querySelector("my-ancestor") as FASTElement;
const descendent = ancestor.querySelector("my-descendent") as FASTElement;

// change the value for a given element
specialColor.setValueFor(ancestor, "#FFF");
specialColor.setValueFor(descendent, "#000");

// get the value
specialColor.getValueFor(ancestor); // "#FFF"
specialColor.getValueFor(descendent); // "#000"

// unset the value (inherits from ancestor)
specialColor.deleteValueFor(descendent);
specialColor.getValueFor(descendent); // "#FFF"
```

Configuring a FAST Design Token:

```ts
// change the value for the typeRampBaseFontSize design token
const myElement = document.querySelector("my-element") as FASTElement;

typeRampBaseFontSize.setValueFor(myElement, "20px");
```



FAST exposes non-color related [Design Tokens](https://www.fast.design/docs/design-systems/fast-frame#fast-frame-design-tokens) that can be used to configure components stylistically. 

For Design Tokens related to color, see the [adaptive color system](https://www.fast.design/docs/design-systems/fast-frame/#adaptive-color-system).



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

### [Contributing to fast-component](https://www.fast.design/docs/community/contributor-guide)

```shell
cd packages/web-components/fast-components
yarn start
```

[Storybook](https://storybook.js.org/) will open in a browser window at `localhost:6006`.

### [Contributing to documentation](https://www.fast.design/docs/community/writing-documentation)

```shell
cd sites/website
yarn start
```

[Docusaurus](https://docusaurus.io/) will open in a browser window at `localhost:3000`.
