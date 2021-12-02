---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---

# Cheat Sheet

| Name| Definition | Notes | When to Use
| :-- | :-- | :-- | :-- |
| [FAST](https://github.com/microsoft/fast)| A collection of technologies built on [Web Components](https://www.fast.design/docs/resources/why-web-components) and modern Web Standards. | You do not need a framework to use FAST components, but you can use them in combination with any framework or library of your choice. | See libraries below.
| [@microsoft/fast-components](https://www.fast.design/docs/components/getting-started) |A library that includes a common set of components found in many websites and apps.   | Assembles the building blocks of @microsoft/fast-foundation to create their component sets. Expresses the FAST design language [(FAST Frame)](https://www.fast.design/docs/design-systems/fast-frame/). | When you want to integrate FAST components into an existing site or app, or if you need more control over the theme of the components.
| [@fluentui/web-components](https://www.fast.design/docs/components/getting-started) | A library that includes a common set of components found in many websites and apps. | Assembles the building blocks of @microsoft/fast-foundation to create their component sets. Expresses Microsoft's [Fluent Design System](https://www.microsoft.com/design/fluent/#/). | When you want components to look and feel like those found in Windows, Office, Teams, and Edge products. |
| [@microsoft/fast-foundation](https://www.fast.design/docs/introduction) | A library that provides foundational building blocks that can be assembled to create new design systems and component libraries. |  Exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior. | When you want to implement something like Google's Material Design or Twitter Bootstrap.
| [@microsoft/fast-element](https://www.fast.design/docs/fast-element/getting-started) | A library that is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components. | FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. | When you want to create completely new web components.
| [FAST Frame Design System](https://www.fast.design/docs/design-systems/fast-frame) | A highly configurable Design System composed of Web Components, Design Tokens, stylesheets, and styling tools. | Provides a highly configurable design system that you can drop into any app. Also provides a set of building blocks you can use to construct your own design system from scratch. | When you have an existing app, or want to create your own design system.|

## Using Components

The `@microsoft/fast-components` library contains Web Components built on top of our standard component and design system foundation. `microsoft/fast-components` expresses the FAST design language [(FAST Frame)](https://www.fast.design/docs/design-systems/fast-frame).
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

### fast-components

| Component | Name | Component Explorer | Guidance |
| :--- | :--- | :--- | :--- |
| [fast-accordian](https://www.fast.design/docs/components/accordion) | `fastAccordion()` `fastAccordionItem()` | [Accordian](https://explore.fast.design/components/fast-accordion) | fast-accordion is a web component implementation of an [Accordion](https://w3c.github.io/aria-practices/#accordion). |
| [fast-anchor](https://www.fast.design/docs/components/anchor) | `fastAnchor()` | [Anchor](https://explore.fast.design/components/fast-anchor) | fast-anchor is a web component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). |
| [fast-anchored-region](https://www.fast.design/docs/components/anchored-region) | `fastAnchoredRegion()` | [Anchored region](https://explore.fast.design/components/fast-anchored-region) | An anchored region is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative to another “anchor” element. |
| [fast-avatar](https://www.fast.design/docs/components/avatar) | `fastAvatar()` | [Avatar](https://explore.fast.design/components/fast-avatar) | The avatar component is used to visually represent a user or an object. |
| [fast-badge](https://www.fast.design/docs/components/badge) | `fastBadge()` | [Badge](https://explore.fast.design/components/fast-badge) | Badge component is used to highlight an item and attract attention or flag status. |
| [fast-breadcrumb](https://www.fast.design/docs/components/breadcrumb) | `fastBreadcrumb()` `fastBreadcrumbItem()` | [Breadcrumb](https://explore.fast.design/components/fast-breadcrumb) | The fast-breadcrumb component is used as a navigational aid, allowing users to maintain awareness of their locations within a program, an app, or a website. |
| [fast-button](https://explore.fast.design/components/fast-button) | `fastButton()` | [Button](https://explore.fast.design/components/fast-button) | fast-button is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). |
| [fast-card](https://www.fast.design/docs/components/card) | `fastCard()` | [Card](https://explore.fast.design/components/fast-card) | The fast-card component is a visual container and design system provider. |
| [fast-checkbox](https://www.fast.design/docs/components/checkbox) | `fastCheckbox()` | [Checkbox](https://explore.fast.design/components/fast-checkbox) | An implementation of a checkbox as a form-connected web-component. |
| [fast-combobox](https://www.fast.design/docs/components/combobox) | `fastCheckbox()` `fastOption()` | [Combobox](https://explore.fast.design/components/fast-combobox) | An implementation of a [combobox](https://w3c.github.io/aria/#combobox). |
| [fast-data-grid](https://www.fast.design/docs/components/data-grid) |  `fastDataGridCell()` `fastDataGridRow()` `fastDataGrid()` | [Data grid](https://explore.fast.design/components/fast-data-grid) | For more information view the [component specification](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md). |
| [fast-dialog](https://www.fast.design/docs/components/dialog) | `fastDialog()` | [Dialog](https://explore.fast.design/components/fast-dialog) | A web component implementation of a [dialog](https://w3c.github.io/aria-practices/#dialog_modal). |
| [fast-disclosure](https://www.fast.design/docs/components/disclosure) | `fastDisclosure()` | [Disclosure](https://explore.fast.design/components/fast-disclosure) | fast-disclosure is a web component based on [Disclosure](https://w3c.github.io/aria-practices/#disclosure) specification. |
| [fast-divider](https://www.fast.design/docs/components/divider) | `fastDivider()` | [Divider](https://explore.fast.design/components/fast-divider) | A web component implementation of a [horizontal rule](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr). |
| [fast-flipper](https://www.fast.design/docs/components/flipper) | `fastFlipper()` | [Flipper](https://explore.fast.design/components/fast-flipper) | The flipper component is most often used to page through blocks of content or collections of ui elements. |
| [fast-horizontal-scroll](https://www.fast.design/docs/components/horizontal-scroll) | `fastHorizontalScroll()` | | |
| [fast-listbox](https://www.fast.design/docs/components/listbox) | `fastListbox()` `fastOption()` | [Listbox](https://explore.fast.design/components/fast-listbox) | An implementation of a [listbox](https://w3c.github.io/aria/#listbox). |
| [fast-menu](https://www.fast.design/docs/components/menu) | `fastMenu()` `fastMenuItem()` | [Menu](https://explore.fast.design/components/fast-menu) | The menu is a widget that offers a list of choices to the user, such as a set of actions or functions. |
| [fast-number-field](https://www.fast.design/docs/components/number-field) | `fastNumberField()` | [Number field](https://explore.fast.design/components/fast-number-field) | An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. |
| [fast-progress](https://www.fast.design/docs/components/progress) | `fastProgress()` `fastProgressRing()` | [Progress ring](https://explore.fast.design/components/fast-progress-ring)  / [Progress](https://explore.fast.design/components/fast-progress) | Progress components are used to display the length of time a process will take or to visualize percentage value (referred to as a determinate state) and to represent an unspecified wait time (referred to as an indeterminate state). |
| [fast-radio](https://www.fast.design/docs/components/radio) | `fastRadio()` | [Radio](https://explore.fast.design/components/fast-radio) | An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component. |
| [fast-radio-group](https://www.fast.design/docs/components/radio-group) | `fastRadio()` `fastRadioGroup()` | [Radio group](https://explore.fast.design/components/fast-radio-group) | An implementation of a [radio-group](https://w3c.github.io/aria-practices/#radiobutton). |
| [fast-select](https://www.fast.design/docs/components/select) | `fastSelect()` `fastOption()` | [Select](https://explore.fast.design/components/fast-select) | An implementation of an [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select). |
| [fast-skeleton](https://www.fast.design/docs/components/skeleton) | `fastSkeleton()` | [Skeleton](https://explore.fast.design/components/fast-skeleton) | This a FAST web component implementation if a [Skeleton](https://open-ui.org/components/skeleton.research). |
| [fast-slider](https://www.fast.design/docs/components/slider) |  `fastSlider()` `fastSliderLabel()` | [Slider](https://explore.fast.design/components/fast-slider) | An implementation of a [range slider](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/range) as a form-connected web-component. |
| [fast-switch](https://www.fast.design/docs/components/switch) | `fastSwitch()` | [Switch](https://explore.fast.design/components/fast-switch) | An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component. |
| [fast-tabs](https://www.fast.design/docs/components/tabs) | `fastTab()` `fastTabPanel()` `fastTabs()` | [Tabs](https://explore.fast.design/components/fast-tabs) | An implementation of a [tab](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role). |
| [fast-text-area](https://www.fast.design/docs/components/text-area) | `fastTextArea()` | [Text area](https://explore.fast.design/components/fast-text-area) | An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. | 
| [fast-text-field](https://www.fast.design/docs/components/text-field) | `fastTextField()` | [Text field](https://explore.fast.design/components/fast-text-field) | An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. |
| [fast-toolbar](https://www.fast.design/docs/components/toolbar) | `fastToolbar()` | [Toolbar](https://explore.fast.design/components/fast-toolbar) | An implementation of a [toolbar](https://w3c.github.io/aria-practices/#toolbar) as a web-component. |
| [fast-tooltip](https://www.fast.design/docs/components/tooltip) | `fastTooltip()` | [Tooltip](https://explore.fast.design/components/fast-tooltip) | An implementation of a [tooltip](https://w3c.github.io/aria-practices/#tooltip) web-component. |
| [fast-tree-view](https://www.fast.design/docs/components/tree-view) | `fastTreeItem()` `fastTreeView()` | [Tree view](https://explore.fast.design/components/fast-tree-view) | An implementation of a [tree-item](https://w3c.github.io/aria-practices/#TreeView) as a web-component. |

---
## Building Components

The `fast-element` library is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework.


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

### fast-element
#### Adding Attributes

| Decorator | API | Property | 
| :--- | :--- | :-- |
| `@attr` | `setAttribute` | `mode` |

#### Customizing Attributes

There are three modes available through the `mode` property of the attribute configuration:

| Mode | Description |
| :-- | :-- |
| `reflect` | The default mode that is used if none is specified. This reflects property changes to the DOM. If a `converter` is supplied, it will invoke the converter before calling the `setAttribute` DOM API. |
| `boolean` | This mode causes your attribute to function using the HTML boolean attribute behavior. When your attribute is present in the DOM or equal to its own name, the value will be true. When the attribute is absent from the DOM, the value of the property will be false. Setting the property will also update the DOM by adding/removing the attribute. |
| `fromView` | This mode skips reflecting the value of the property back to the HTML attribute, but does receive updates when changed through `setAttribute`. |

#### observables

Add content
#### templates

Add content
#### styles

Add content

---


## fast-foundation



## Design Tokens

A Design Token is a semantic, named variable used to describe a Design System. They often describe design concepts like typography, color, sizes, UI spacing, etc. 

Visit our [Design Tokens Guide](https://www.fast.design/docs/design-systems/design-tokens) for more details, Tips, and Notes.

### FAST Frame Design Tokens

FAST exposes the following Design Tokens that can be used to configure components stylistically.


| Token Name                        | Level                 |
|-----------------------------------|-----------------------|
| `typeRampMinus2FontSize`          | Minus 2 (smallest)    |
| `typeRampMinus1FontSize`          | Minus 1               |
| `typeRampBaseFontSize`            | Base (body)           |
| `typeRampPlus1FontSize`           | Plus 1                |
| `typeRampPlus2FontSize`           | Plus 2                |
| `typeRampPlus3FontSize`           | Plus 3                |
| `typeRampPlus4FontSize`           | Plus 4                |
| `typeRampPlus5FontSize`           | Plus 5                |
| `typeRampPlus6FontSize`           | Plus 6 (largest)      |


| Token Name                          | Level                 |
|-------------------------------------|-----------------------|
| `typeRampMinus2LineHeight`          | Minus 2 (smallest)    |
| `typeRampMinus1LineHeight`          | Minus 1               |
| `typeRampBaseLineHeight`            | Base (body)           |
| `typeRampPlus1LineHeight`           | Plus 1                |
| `typeRampPlus2LineHeight`           | Plus 2                |
| `typeRampPlus3LineHeight`           | Plus 3                |
| `typeRampPlus4LineHeight`           | Plus 4                |
| `typeRampPlus5LineHeight`           | Plus 5                |
| `typeRampPlus6LineHeight`           | Plus 6 (largest)      |


| Token Name | Guidance |
| :-- |:-- |
| `baseHeightMultiplier` | This value, multiplied by designUnit, sets the base height of most controls. Works with adaptive density values. |
| `baseHorizontalSpacingMultiplier` | (future): This value, multiplied by designUnit, sets the internal horizontal padding of most controls. Works with adaptive density values | 
| `controlCornerRadius` | Sets the corner radius used by controls with backplates. |
| `density` | (in process): An adjustment to sizing tokens baseHeightMultiplier and baseHorizontalSpacingMultiplier. |
| `designUnit` | The unit size of the Design Grid. Used to calculate height and spacing sizes for controls. |


| Token Name | Guidance |
| :-- |:-- |
| `direction` | The primary document direction (LTR or RTL). |
| `disabledOpacity` | The opacity of disabled controls. |
| `strokeWidth` | Controls the width of the stroke of a component that has a stroke. |
| `focusStrokeWidth` | Controls with width of the stroke of a component that has a stroke when it has document focus. |
