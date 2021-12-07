---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---

# Cheat Sheet
## [FAST](https://github.com/microsoft/fast)                                                 

**A collection of technologies built on [Web Components](https://www.fast.design/docs/resources/why-web-components) and modern Web Standards.**


* Designed to help you efficiently tackle some of the most common challenges in website and application design and development. [FAST Components](#fast-components) do not require a framework, but can be used in combination with any framework or library.

* FAST libraries can be used on their own to build modern web sites and applications, but they are also designed to be used in combination with a wide variety of [existing technologies](https://www.fast.design/docs/integrations/introduction).

    * FAST libraries:
        * @microsoft/fast-components
        * @fluentui/web-components
        * @microsoft/fast-foundation
        * @microsoft/fast-element

* FAST Frame:
    * A highly configurable [Design System](https://www.fast.design/docs/design-systems/overview) composed of Web Components, Design Tokens, stylesheets, and styling tools.
    * Has a robust component library, and an adaptive and accessible UI system that can be dropped into any app.

--- 
### [@microsoft/fast-components](https://www.fast.design/docs/components/getting-started)     

**A library that includes a common set of components found in many websites and apps.**       

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 
* Expresses Microsoft's [FAST Frame Design System](https://www.fast.design/docs/design-systems/fast-frame/).
* Use this library when you want to integrate FAST components into an existing site or app.
* See [Using Components](#using-components).

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
* When you want to create completely new web components. 
* See [Building Components](#building-components).

To install the components, use either npm or yarn:

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

Integrate FAST Element into your existing or preferred stack:

* [Angular](https://www.fast.design/docs/integrations/angular)
* [ASP.NET](https://www.fast.design/docs/integrations/aspnet)
* [Aurelia](https://www.fast.design/docs/integrations/aurelia)
* [Blazor](https://www.fast.design/docs/integrations/blazor)
* [Ember](https://www.fast.design/docs/integrations/ember)
* [React](https://www.fast.design/docs/integrations/react)
* [Vue](https://www.fast.design/docs/integrations/vue)
* [Webpack](https://www.fast.design/docs/integrations/webpack)

---
### [FAST Frame Design System](https://www.fast.design/docs/design-systems/fast-frame)

**A Design System composed of Web Components, Design Tokens, stylesheets, and styling tools.**

* Provides a highly configurable design system that you can drop into any app. 
* Provides a set of building blocks that you can use to construct your own design system.   
* Use FAST Frame when you have an existing app, or want to create your own [Design System](#design-system).

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

### Setup

To work with the FAST monorepo you'll need Git, Node.js, Yarn, and Lerna setup on your machine.

* Git: [download](https://git-scm.com/downloads)
* Node.js: [download](https://nodejs.org/en/) 
* Yarn: `npm install -g yarn`
* Lerna: `yarn global add lerna`

### Cloning the repo

`git clone https://github.com/microsoft/fast.git`

### Installing and building

`yarn`

### Creating a branch

```shell
git checkout -b users/{your github handle}/{your-branch-name}
```

### Contributing to fast-component

```shell
cd packages/web-components/fast-components
yarn start
```

[Storybook](https://storybook.js.org/) will open in a browser window at localhost:6006

### Contributing to documentation

```shell
`cd sites/website`
`yarn start`
```

[Docusaurus](https://docusaurus.io/) will open in a browser window at `localhost:3000`

### Submitting a pull request

```shell
git rebase master
yarn change
git push origin {your-branch-name}
```

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

Visit our Using Components [Getting Started Guide](https://www.fast.design/docs/components/getting-started) for more details, Tips, and Notes.

### FAST Components

| Component                                                                                 | Name                                                          | Component Explorer                                                                                                                                    |                                                                                                                                                                                                                         |
| :---------------------------------------------------------------------------------------- | :------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [fast-accordian](https://www.fast.design/docs/components/accordion)                       | `fastAccordion()` `fastAccordionItem()`                       | [Accordian](https://explore.fast.design/components/fast-accordion)                                                                                    |
| [fast-anchor](https://www.fast.design/docs/components/anchor)                             | `fastAnchor()`                                                | [Anchor](https://explore.fast.design/components/fast-anchor)                                                                                          |
| [fast-anchored-region](https://www.fast.design/docs/components/anchored-region)           | `fastAnchoredRegion()`                                        | [Anchored region](https://explore.fast.design/components/fast-anchored-region)                                                                        |
| [fast-avatar](https://www.fast.design/docs/components/avatar)                             | `fastAvatar()`                                                | [Avatar](https://explore.fast.design/components/fast-avatar)                                                                                          |            
| [fast-badge](https://www.fast.design/docs/components/badge)                               | `fastBadge()`                                                 | [Badge](https://explore.fast.design/components/fast-badge)                                                                                            |                                                                                                                                                
| [fast-breadcrumb](https://www.fast.design/docs/components/breadcrumb)                     | `fastBreadcrumb()` `fastBreadcrumbItem()`                     | [Breadcrumb](https://explore.fast.design/components/fast-breadcrumb)                                                                                  |                                                                         
| [fast-button](https://explore.fast.design/components/fast-button)                         | `fastButton()`                                                | [Button](https://explore.fast.design/components/fast-button)                                                                                          |                                                                                        
| [fast-card](https://www.fast.design/docs/components/card)                                 | `fastCard()`                                                  | [Card](https://explore.fast.design/components/fast-card)                                                                                              |                                                                                                                                                       
| [fast-checkbox](https://www.fast.design/docs/components/checkbox)                         | `fastCheckbox()`                                              | [Checkbox](https://explore.fast.design/components/fast-checkbox)                                                                                      |                                                                                                                                                              
| [fast-combobox](https://www.fast.design/docs/components/combobox)                         | `fastCheckbox()` `fastOption()`                               | [Combobox](https://explore.fast.design/components/fast-combobox)                                                                                      |    
| [fast-data-grid](https://www.fast.design/docs/components/data-grid)                       | `fastDataGridCell()` `fastDataGridRow()` `fastDataGrid()`     | [Data grid](https://explore.fast.design/components/fast-data-grid)                                                                                    |                  
| [fast-dialog](https://www.fast.design/docs/components/dialog)                             | `fastDialog()`                                                | [Dialog](https://explore.fast.design/components/fast-dialog)                                                                                          |
| [fast-disclosure](https://www.fast.design/docs/components/disclosure)                     | `fastDisclosure()`                                            | [Disclosure](https://explore.fast.design/components/fast-disclosure)                                                                                  |
| [fast-divider](https://www.fast.design/docs/components/divider)                           | `fastDivider()`                                               | [Divider](https://explore.fast.design/components/fast-divider)                                                                                        |
| [fast-flipper](https://www.fast.design/docs/components/flipper)                           | `fastFlipper()`                                               | [Flipper](https://explore.fast.design/components/fast-flipper)                                                                                        |
| [fast-horizontal-scroll](https://www.fast.design/docs/components/horizontal-scroll)       | `fastHorizontalScroll()`                                      |                                                                                                                                                       |                                                                                                                                                                                                       |
| [fast-listbox](https://www.fast.design/docs/components/listbox)                           | `fastListbox()` `fastOption()`                                | [Listbox](https://explore.fast.design/components/fast-listbox)                                                                                        |                                                                                                                                                            
| [fast-menu](https://www.fast.design/docs/components/menu)                                 | `fastMenu()` `fastMenuItem()`                                 | [Menu](https://explore.fast.design/components/fast-menu)                                                                                              |                                                                                                 
| [fast-number-field](https://www.fast.design/docs/components/number-field)                 | `fastNumberField()`                                           | [Number field](https://explore.fast.design/components/fast-number-field)                                                                              |                                                                                                  
| [fast-progress](https://www.fast.design/docs/components/progress)                         | `fastProgress()` `fastProgressRing()`                         | [Progress ring](https://explore.fast.design/components/fast-progress-ring)  / [Progress](https://explore.fast.design/components/fast-progress)        |
| [fast-radio](https://www.fast.design/docs/components/radio)                               | `fastRadio()`                                                 | [Radio](https://explore.fast.design/components/fast-radio)                                                                                            |                                                                                                    
| [fast-radio-group](https://www.fast.design/docs/components/radio-group)                   | `fastRadio()` `fastRadioGroup()`                              | [Radio group](https://explore.fast.design/components/fast-radio-group)                                                                                |                                                                                                                                                    
| [fast-select](https://www.fast.design/docs/components/select)                             | `fastSelect()` `fastOption()`                                 | [Select](https://explore.fast.design/components/fast-select)                                                                                          |                                                                                                                              
| [fast-skeleton](https://www.fast.design/docs/components/skeleton)                         | `fastSkeleton()`                                              | [Skeleton](https://explore.fast.design/components/fast-skeleton)                                                                                      |                                                                                                                             
| [fast-slider](https://www.fast.design/docs/components/slider)                             | `fastSlider()` `fastSliderLabel()`                            | [Slider](https://explore.fast.design/components/fast-slider)                                                                                          |                                                                                               
| [fast-switch](https://www.fast.design/docs/components/switch)                             | `fastSwitch()`                                                | [Switch](https://explore.fast.design/components/fast-switch)                                                                                          |                                                                                                                           
| [fast-tabs](https://www.fast.design/docs/components/tabs)                                 | `fastTab()` `fastTabPanel()` `fastTabs()`                     | [Tabs](https://explore.fast.design/components/fast-tabs)                                                                                              |                                                                                                                              
| [fast-text-area](https://www.fast.design/docs/components/text-area)                       | `fastTextArea()`                                              | [Text area](https://explore.fast.design/components/fast-text-area)                                                                                    |                                                                                         
| [fast-text-field](https://www.fast.design/docs/components/text-field)                     | `fastTextField()`                                             | [Text field](https://explore.fast.design/components/fast-text-field)                                                                                  |                                                                                                
| [fast-toolbar](https://www.fast.design/docs/components/toolbar)                           | `fastToolbar()`                                               | [Toolbar](https://explore.fast.design/components/fast-toolbar)                                                                                        |                                                                                                                                          
| [fast-tooltip](https://www.fast.design/docs/components/tooltip)                           | `fastTooltip()`                                               | [Tooltip](https://explore.fast.design/components/fast-tooltip)                                                                                        |                                                                                                                                             
| [fast-tree-view](https://www.fast.design/docs/components/tree-view)                       | `fastTreeItem()` `fastTreeView()`                             | [Tree view](https://explore.fast.design/components/fast-tree-view)                                                                                    |                                                                                                                                      


---
## Building Components

@microsoft/fast-element
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

#### Adding Attributes

| Decorator         | API               | Property           | 
| :---------------- | :---------------- | :----------------- |
| `@attr`           | `setAttribute`    | `mode`             |

#### Customizing Attributes

There are three modes available through the `mode` property of the attribute configuration:

| Mode              | Description                                                                                                                                                                                                                                            |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reflect`         | The default mode that is used if none is specified. This reflects property changes to the DOM. If a `converter` is supplied, it will invoke the converter before calling the `setAttribute` DOM API. |
| `boolean`         | This mode causes your attribute to function using the HTML boolean attribute behavior. When your attribute is present in the DOM or equal to its own name, the value will be true. When the attribute is absent from the DOM, the value of the property will be false. Setting the property will also update the DOM by adding/removing the attribute. |
| `fromView`        | This mode skips reflecting the value of the property back to the HTML attribute, but does receive updates when changed through `setAttribute`.                                                                                                                        |

#### observables

Add content
#### templates

Add content
#### styles

Add content


---
## Design System

FAST Frame
### Design Tokens

A Design Token is a semantic, named variable used to describe a Design System. They often describe design concepts like typography, color, sizes, UI spacing, etc. 

Visit our [Design Tokens Guide](https://www.fast.design/docs/design-systems/design-tokens) for more details, Tips, and Notes.

FAST exposes the following Design Tokens that can be used to configure components stylistically.

| Token Name                                | Guidance (Level)                  |
| :---------------------------------------- | :-------------------------------- |
| `typeRampMinus2FontSize`                  | Minus 2 (smallest)                |
| `typeRampMinus1FontSize`                  | Minus 1                           |
| `typeRampBaseFontSize`                    | Base (body)                       |
| `typeRampPlus1FontSize`                   | Plus 1                            |
| `typeRampPlus2FontSize`                   | Plus 2                            |
| `typeRampPlus3FontSize`                   | Plus 3                            |
| `typeRampPlus4FontSize`                   | Plus 4                            |
| `typeRampPlus5FontSize`                   | Plus 5                            |
| `typeRampPlus6FontSize`                   | Plus 6 (largest)                  |


| Token Name                                | Guidance (Level)                  |
| :---------------------------------------- | :-------------------------------- |
| `typeRampMinus2LineHeight`                | Minus 2 (smallest)                |
| `typeRampMinus1LineHeight`                | Minus 1                           |
| `typeRampBaseLineHeight`                  | Base (body)                       |
| `typeRampPlus1LineHeight`                 | Plus 1                            |
| `typeRampPlus2LineHeight`                 | Plus 2                            |
| `typeRampPlus3LineHeight`                 | Plus 3                            |
| `typeRampPlus4LineHeight`                 | Plus 4                            |
| `typeRampPlus5LineHeight`                 | Plus 5                            |
| `typeRampPlus6LineHeight`                 | Plus 6 (largest)                  |


| Token Name                                | Guidance                                                                                                                                          |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `baseHeightMultiplier`                    | This value, multiplied by designUnit, sets the base height of most controls. Works with adaptive density values.                                  |
| `baseHorizontalSpacingMultiplier`         | (future): This value, multiplied by designUnit, sets the internal horizontal padding of most controls. Works with adaptive density values.        | 
| `controlCornerRadius`                     | Sets the corner radius used by controls with backplates.                                                                                          |
| `density`                                 | (in process): An adjustment to sizing tokens baseHeightMultiplier and baseHorizontalSpacingMultiplier.                                            |
| `designUnit`                              | The unit size of the Design Grid. Used to calculate height and spacing sizes for controls.                                                        |


| Token Name                                | Guidance                                                                                                                                          |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `direction`                               | The primary document direction (LTR or RTL).                                                                                                      |
| `disabledOpacity`                         | The opacity of disabled controls.                                                                                                                 |
| `strokeWidth`                             | Controls the width of the stroke of a component that has a stroke.                                                                                |
| `focusStrokeWidth`                        | Controls with width of the stroke of a component that has a stroke when it has document focus.                                                    |
