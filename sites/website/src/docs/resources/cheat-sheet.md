---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---

# Cheat Sheet

## Packages:

### [@microsoft/fast-element](https://www.fast.design/docs/fast-element/getting-started)

**A library that is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components.**

* Provides a thin layer of opinion on top of [Web Components](https://www.fast.design/docs/resources/why-web-components), lifting the level of abstraction just enough to make it easier and faster to [build components]((#building-components)).   
* Use this library when you want to create new custom web components. 

To install the fast-element library, use either `npm` or `yarn`:

```shell
npm install --save @microsoft/fast-element
```

```shell
yarn add @microsoft/fast-element
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { FASTElement } from "@microsoft/fast-element";
```

---

### [@microsoft/fast-foundation](https://www.fast.design/docs/introduction)

**A library that provides foundational building blocks that can be assembled to create new design systems and component libraries.**

* Exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.   
* Use this library when you want to create something like Google's Material Design or Bootstrap.

**Example:**

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

### [@microsoft/fast-components](https://www.fast.design/docs/components/getting-started)     

**The FAST component library and visual system [FAST Frame](https://www.fast.design/docs/design-systems/fast-frame/), which implements fast-foundation.**

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 
* Use this library when you want to integrate [FAST Components](#using-components) into an existing site or app.

To install the components, use either `npm` or `yarn`:

```shell
npm install --save @microsoft/fast-components
``` 

```shell
yarn add @microsoft/fast-components
```

To use a component as a custom element in HTML, the custom element must be registered.

**Example:**

```ts
import { 
  fastButton, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
  .register(
    fastButton() // custom element registration
  );
```

---
### [@fluentui/web-components](https://docs.microsoft.com/en-us/fluent-ui/web-components/)

**A component library that implements Microsoft's [Fluent Design System](https://www.microsoft.com/design/fluent/#/).**

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 
* Use this library when you want components to look and feel like those found in Microsoft products.

To install the components, use either `npm` or `yarn`:

```shell
npm install --save @fluentui/web-components
``` 

```shell
yarn add @fluentui/web-components
```

To use a Web Component as a custom element in HTML, the custom element must be registered.

**Example:**

```ts
import { 
  fluentButton, 
  provideFluentDesignSystem 
} from "@fluentui/web-components";

provideFluentDesignSystem()
  .register(
    fluentButton() // custom element registration
  );
```

Learn more about [Fluent UI Web](https://github.com/microsoft/fluentui).

---

## [Using Components](https://www.fast.design/docs/components/getting-started)

### Setup

**Example:** 

To register design system components:

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

Or, register all system components:

```ts
import { 
  allComponents, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

With the components registered, add any component to the HTML:

**Example:**

```html
<fast-button>Hello world</fast-button>
```

---

Launch our [Component Explorer](https://explore.fast.design/) for a comprehensive list of FAST Components.

---
### [Integrations](https://www.fast.design/docs/integrations/introduction)

FAST libraries can also be used in combination with a wide variety of existing technologies.

- [Angular](https://www.fast.design/docs/integrations/angular)
- [ASP.NET](https://www.fast.design/docs/integrations/aspnet)
- [Aurelia](https://www.fast.design/docs/integrations/aurelia)
- [Blazor](https://www.fast.design/docs/integrations/blazor)
- [Ember](https://www.fast.design/docs/integrations/ember)
- [React](https://www.fast.design/docs/integrations/react)
- [Vue](https://www.fast.design/docs/integrations/vue)
- [Webpack](https://www.fast.design/docs/integrations/webpack)

Not seeing an integration for your preferred technology?  Open an issue on [GitHub](https://github.com/microsoft/fast/issues).

---

## [Building Components](https://www.fast.design/docs/fast-element/getting-started)

### Setup


**Example:** 

To define a custom element:

```ts
import { FASTElement, customElement } from "@microsoft/fast-element";

@customElement("name-tag") // custom element being created
export class NameTag extends FASTElement {

}
```

With this in place, you can now use your `<name-tag>` element anywhere in HTML with the following markup:

```html
<name-tag></name-tag>
```

---

### [Attributes](https://www.fast.design/docs/fast-element/defining-elements#customizing-attributes)

To add attributes to your HTML element, create properties decorated by the `@attr` decorator.

**Example:**

```ts
import { FASTElement, customElement, attr } from "@microsoft/fast-element";

@customElement("name-tag")
export class NameTag extends FASTElement {
  @attr greeting: string = "Hello";

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
```

To use a Web Component with Attributes:

**Example:**

```html
<name-tag greeting="Hola"></name-tag>
```

---

#### [Customizing attributes](https://www.fast.design/docs/fast-element/defining-elements#customizing-attributes):

The three modes available through the `mode` property of the attribute configuration:

| Mode | Guidance |
| :-- | :-- | 
| reflect | The default mode that is used if none is specified. |
| boolean | This mode causes your attribute to function using the HTML boolean attribute behavior. |
| fromView | This mode skips reflecting the value of the property back to the HTML attribute. |

---

Supply a custom `ValueConverter` by setting the converter property of the attribute configuration:

```ts
interface ValueConverter {
  toView(value: any): string;
  fromView(value: string): any;
}
```

**Example:**

```ts
const numberConverter: ValueConverter = {
  toView(value: number): string {
    return String(value);
  },

  fromView(value: string): number {
    return Number(value);
  }
};

@customElement("my-counter")
export class MyCounter extends FASTElement {
  @attr({
    mode: "reflect",
    converter: numberConverter
  })
  count: number = 0;
}
```

---

### [Templates](https://www.fast.design/docs/fast-element/declaring-templates)

To create an HTML template for an element, import and use the html tagged template helper and pass the template to the `@customElement` decorator.

**Example:**

```ts
import { FASTElement, customElement, attr, html } from "@microsoft/fast-element";

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">TODO: Name Here</div>

  <div class="footer"></div>
`;

@customElement({
  name: "name-tag",
  template
})
export class NameTag extends FASTElement {
  ...
}
```

---

### [Observables](https://www.fast.design/docs/fast-element/observables-and-state#observable-features)

To enable binding tracking and change notification, properties must be decorated with either `@attr` or `@observable`. 

Use `@attr` for primitive properties (string, bool, number) that are intended to be surfaced on your element as HTML [attributes](#attributes). Use `@observable` for all other property types on an HTMLElement and all observable properties on plain classes.

**Example:**

```ts
import { Observable } from "@microsoft/fast-element";

export class Person {
  @observable firstName = "";
  @observable lastName = "";

  get fullName() {
    return `${this.firstName} ${this.LastName}`;
  }
}
```

---

### [Bindings](https://www.fast.design/docs/fast-element/declaring-templates#understanding-bindings)

| Binding Type | Example | Notes |
| :--- | :--- | :--- |
| Content | `<a>${…}</a>` | Creates a binding to interpolate text or child templates into element content. |
| HTML Attribute | `<a href=${…}></a>` | Creates a binding that uses the setAttribute API. Attribute bindings also support interpolation with text and other bindings. |
| HTML Boolean Attribute | `<input ?disabled=${…}>` | Creates a binding that adds or removes the attribute based on truthy/falsey values. |
| JS Property | `<input :value=${…}>` | Creates a binding that sets a JavaScript property on the element. |
| Event Handler | `<button @click=${…}>...</button>` | Registers an event handler using addEventListener. The listener is automatically removed when the template is unbound. |
| HTML Element Reference | `<button ${ref("myButton")}>...</button>` | Captures a reference to the element and assigns it to the named property on the data source. |
| Slotted Node Capture | `<slot ${slotted("defaultSlotNodes")}></slot>` | Watches the slot for changes and synchronizes those to an array, assigned to the named property on the data source. |
| Child Node Capture | `<div ${children("divChildren")}></div>` | Watches the element's children or changes and synchronizes those to an array, assigned to the named property on the data source. |

---

### [Directives](https://www.fast.design/docs/fast-element/using-directives)

Use the [`when`](https://www.fast.design/docs/fast-element/using-directives#the-when-directive) directive to conditionally render blocks of HTML.

**Example:**

```ts
import { FASTElement, customElement, observable, html, when } from "@microsoft/fast-element";

const template = html<MyApp>`
 ...
  ${when(x => !x.ready, html<MyApp>`
    Loading...
  `)}
`;

@customElement({
  name: "my-app",
  template
})
export class MyApp extends FASTElement {
  @observable ready: boolean = false;
  ...
}
```

---

Use the [`repeat`](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive) directive to render a list of data.

**Example:**

```ts
import { FASTElement, customElement, observable, html, repeat } from "@microsoft/fast-element";

const template = html<FriendList>`
  ...
    ${repeat(x => x.friends, html<string>`
      <li>${x => x}</li>
    `)}
`;

@customElement({
  name: "friend-list",
  template
})
export class FriendList extends FASTElement {
  @observable friends: Person[] = [];
  ...
}
```

---

Properties available on the context object within a `repeat` block:

| Property | Definition |
| :-- | :-- |
| event | The event object when inside an event handler. |
| parent | The parent view-model when inside a repeat block. |
| parentContext | The parent ExecutionContext when inside a repeat block. This is useful when repeats are nested and the inner-most repeat needs access to the root view-model. |

`Opt-in` properties that are not available by default:

| Opt-in Properties  | Definition |
| :-- | :-- |
| index | The index of the current item when inside a repeat block. |
| length | The length of the array when inside a repeat block. |
| isEven | True if the index of the current item is even when inside a repeat block. |
| isOdd | True if the index of the current item is odd when inside a repeat block. |
| isFirst | True if the current item is first in the array inside a repeat block. |
| isInMiddle | True if the current item is somewhere in the middle of the array inside a repeat block. |
| isLast | True if the current item is last in the array inside a repeat block. |

To opt into the positioning properties, pass options to the `repeat` directive, with the setting `positioning: true`.

**Example**: Rendering a list with Item Index:

```ts
<ul>
  ${repeat(x => x.friends, html<string>`
    <li>${(x, c) => c.index} ${x => x}</li>
  `, { positioning: true })}
</ul>
```

---

### [Styles](https://www.fast.design/docs/fast-element/leveraging-css#basic-styles)

`FASTElement` provides a css tagged template helper that allows for the creation of `ElementStyles`.

**Example**: Adding CSS to a `FASTElement`:

```ts
import { FASTElement, customElement } from "@microsoft/fast-element";
import { css, customElement, FASTElement } from "@microsoft/fast-element";
import { disabledOpacity } from "../design-tokens";

const styles = css`
  :host([disabled]) {
    opacity: ${disabledOpacity};
  }
`;

@customElement({
  styles
})
export class MyElement extends FASTElement {}
```

---

#### [Composing styles](https://www.fast.design/docs/fast-element/leveraging-css#composing-styles)

`ElementStyles` can be composed with other styles.

**Example:**

```ts
import { normalize } from "./normalize";

const styles = css`
  ${normalize}
  :host {
    ...
  }
`;
```

---

#### [Partial CSS](https://www.fast.design/docs/fast-element/leveraging-css#partial-css)

Use the `cssPartial` tagged template literal to create reusable blocks of partial CSS.

**Example:**

```ts
import { css, cssPartial } from "@microsoft/fast-element";

const partial = cssPartial`color: red;`;
const styles = css`:host{ ${partial} }`;
```

---

### [CSSDirective](https://www.fast.design/docs/fast-element/leveraging-css#cssdirective)

To create a `CSSDirective`, import and extend `CSSDirective` from `@microsoft/fast-element`.

**Example:**

```ts
import { CSSDirective }  from "@microsoft/fast-element"

class RandomWidth extends CSSDirective {}
```

#### [createCSS method](https://www.fast.design/docs/fast-element/leveraging-css#createcss).



`CSSDirective` has a `createCSS()` method that returns a string to be interpolated into an `ElementStyles`.

**Example:**

```ts
class RandomWidth extends CSSDirective {
  createCSS() {
    return "width: var(--random-width);"
  }
}
```

#### [createBehavior method](https://www.fast.design/docs/fast-element/leveraging-css#createbehavior):

The `createBehavior()` method can be used to create a `Behavior` that is bound to the element using the `CSSDirective`.

**Example:**

```ts
class RandomWidth extends CSSDirective {
  private property = "--random-width";
  createCSS() {
    return `width: var(${this.property});`
  }

  createBehavior() {
    return {
      bind(el) {
        el.style.setProperty(this.property, Math.random() * 100)
      }
      unbind(el) {
        el.style.removeProperty(this.property);
      }
    }
  }
}
```

---

## Design System

### [Creating a Design System](https://www.fast.design/docs/design-systems/creating-a-component-library#defining-a-design-system)

1. Start with the base components defined in `@microsoft/fast-foundation` and compose them with your own styles.

**Example:**

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

2. Export a `provider function` for your community to use in setting everything up:

**Example:**

```ts
export function provideSpecialDesignSystem(element?: HTMLElement): DesignSystem {
  return DesignSystem.getOrCreate(element).withPrefix("special");
}
```

---

### [Design Tokens](https://www.fast.design/docs/design-systems/design-tokens)

**Example:** [Creating a token](https://www.fast.design/docs/design-systems/design-tokens#create-a-token):

```ts
import { DesignToken } from "@microsoft/fast-foundation";

// create a design token
export const specialColor = DesignToken.create<string>("special-color");
```

**Example:** [Using design tokens in CSS](https://www.fast.design/docs/design-systems/design-tokens#using-design-tokens-in-css):

```ts
// use the design token to build styles
const styles = css`
  :host {
    background: ${specialColor};
  }
`;

const ancestor = document.querySelector("my-ancestor") as FASTElement;
const descendent = ancestor.querySelector("my-descendent") as FASTElement;
```

**Example:** [Setting values](https://www.fast.design/docs/design-systems/design-tokens#setting-values):
```ts
// change the value for a given element
specialColor.setValueFor(ancestor, "#FFF");
specialColor.setValueFor(descendent, "#000");
```

**Example:** [Getting values](https://www.fast.design/docs/design-systems/design-tokens#getting-values):
```ts
// get the value
specialColor.getValueFor(ancestor); // "#FFF"
specialColor.getValueFor(descendent); // "#000"
```

**Example:** [Deleting values](https://www.fast.design/docs/design-systems/design-tokens#deleting-values):
```ts
// unset the value (inherits from ancestor)
specialColor.deleteValueFor(descendent);
specialColor.getValueFor(descendent); // "#FFF"
```

---

#### Configuring a FAST Design Token:

**Example**:

```ts
// change the value for the typeRampBaseFontSize design token
const myElement = document.querySelector("my-element") as FASTElement;

typeRampBaseFontSize.setValueFor(myElement, "20px");
```

FAST exposes non-color related [Design Tokens](https://www.fast.design/docs/design-systems/fast-frame#fast-frame-design-tokens) that can be used to configure components stylistically. 

For Design Tokens related to color, see the [adaptive color system](https://www.fast.design/docs/design-systems/fast-frame/#adaptive-color-system).

---

## [Contributing to FAST](https://www.fast.design/docs/community/join)

**Connect with us**:

- Join our [Discord](https://discord.gg/FcSNfg4) server.
- Report bugs, request features through [Github](https://github.com/Microsoft/fast/issues/new/choose).

**Unsure of what to work on?**

- Here are [good first issues](https://github.com/Microsoft/fast/labels/community:good-first-issue).

---
### [Contributor Guide](https://www.fast.design/docs/community/contributor-guide/)
- [Machine setup](https://www.fast.design/docs/community/contributor-guide/#machine-setup)
- [Cloning the repository](https://www.fast.design/docs/community/contributor-guide/#cloning-the-repository)
- [Installing & building](https://www.fast.design/docs/community/contributor-guide/#installing-and-building)
- [Testing](https://www.fast.design/docs/community/contributor-guide/#testing)
- [Submitting a pull request](https://www.fast.design/docs/community/contributor-guide/#submitting-a-pull-request)
- [Merging a pull request](https://www.fast.design/docs/community/contributor-guide/#merging-a-pull-request)

---

### [Contributing to fast-component](https://www.fast.design/docs/community/contributor-guide)

```shell
cd packages/web-components/fast-components
yarn start
```

[Storybook](https://storybook.js.org/) will open in a browser window at `localhost:6006`.

---

### [Contributing to documentation](https://www.fast.design/docs/community/writing-documentation)

```shell
cd sites/website
yarn start
```

[Docusaurus](https://docusaurus.io/) will open in a browser window at `localhost:3000`.