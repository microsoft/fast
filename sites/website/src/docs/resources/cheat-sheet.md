---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---
## Setup

To register all available components:

```ts
import { 
    allComponents, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

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

Visit our [Getting Started Guide](https://www.fast.design/docs/components/getting-started) for more details, Tips, and Notes.

## Components

| Component | Name | Component Explorer | Guidance | Usage | 
| :--- | :--- | :--- | :--- | :--- | 
| [fast-accordian](https://www.fast.design/docs/components/accordion) | `fastAccordion()` `fastAccordionItem()` | [Accordian](https://explore.fast.design/components/fast-accordion) | fast-accordion is a web component implementation of an [Accordion](https://w3c.github.io/aria-practices/#accordion). | [example](#fast-accordian)
| [fast-anchor](https://www.fast.design/docs/components/anchor) | `fastAnchor()` | [Anchor](https://explore.fast.design/components/fast-anchor) | fast-anchor is a web component implementation of an [HTML anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a). | [example](#fast-anchor)
| [fast-anchored-region](https://www.fast.design/docs/components/anchored-region) | `fastAnchoredRegion()` | [Anchored region](https://explore.fast.design/components/fast-anchored-region) | An anchored region is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative to another “anchor” element. | [example](#fast-anchored-region)
| [fast-avatar](https://www.fast.design/docs/components/avatar) | `fastAvatar()` | [Avatar](https://explore.fast.design/components/fast-avatar) | The avatar component is used to visually represent a user or an object. | [example](#fast-avatar)
| [fast-badge](https://www.fast.design/docs/components/badge) | `fastBadge()` | [Badge](https://explore.fast.design/components/fast-badge) | Badge component is used to highlight an item and attract attention or flag status. | [example](#fast-badge)
| [fast-breadcrumb](https://www.fast.design/docs/components/breadcrumb) | `fastBreadcrumb()` `fastBreadcrumbItem()` | [Breadcrumb](https://explore.fast.design/components/fast-breadcrumb) | The fast-breadcrumb component is used as a navigational aid, allowing users to maintain awareness of their locations within a program, an app, or a website. | [example](#fast-breadcrumb)
| [fast-button](https://explore.fast.design/components/fast-button) | `fastButton()` | [Button](https://explore.fast.design/components/fast-button) | fast-button is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). | [example](#fast-button)
| [fast-card](https://www.fast.design/docs/components/card) | `fastCard()` | [Card](https://explore.fast.design/components/fast-card) | The fast-card component is a visual container and design system provider. | [example](#fast-card)
| [fast-checkbox](https://www.fast.design/docs/components/checkbox) | `fastCheckbox()` | [Checkbox](https://explore.fast.design/components/fast-checkbox) | An implementation of a checkbox as a form-connected web-component. | [example](#fast-checkbox)
| [fast-combobox](https://www.fast.design/docs/components/combobox) | `fastCheckbox()` `fastOption()` | [Combobox](https://explore.fast.design/components/fast-combobox) | An implementation of a [combobox](https://w3c.github.io/aria/#combobox). | [example](#fast-combobox)
| [fast-data-grid](https://www.fast.design/docs/components/data-grid) |  `fastDataGridCell()` `fastDataGridRow()` `fastDataGrid()` | [Data grid](https://explore.fast.design/components/fast-data-grid) | For more information view the [component specification](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md). | [example](#fast-data-grid)
| [fast-dialog](https://www.fast.design/docs/components/dialog) | `fastDialog()` | [Dialog](https://explore.fast.design/components/fast-dialog) | A web component implementation of a [dialog](https://w3c.github.io/aria-practices/#dialog_modal). | [example](#fast-dialog)
| [fast-disclosure](https://www.fast.design/docs/components/disclosure) | `fastDisclosure()` | [Disclosure](https://explore.fast.design/components/fast-disclosure) | fast-disclosure is a web component based on [Disclosure](https://w3c.github.io/aria-practices/#disclosure) specification. | [example](#fast-disclosure)
| [fast-divider](https://www.fast.design/docs/components/divider) | `fastDivider()` | [Divider](https://explore.fast.design/components/fast-divider) | A web component implementation of a [horizontal rule](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr). | [example](#fast-divider)
| [fast-flipper](https://www.fast.design/docs/components/flipper) | `fastFlipper()` | [Flipper](https://explore.fast.design/components/fast-flipper) | The flipper component is most often used to page through blocks of content or collections of ui elements. | [example](#fast-flipper)
| [fast-horizontal-scroll](https://www.fast.design/docs/components/horizontal-scroll) | `fastHorizontalScroll()` | | | [example](#fast-scroll) |
| [fast-listbox](https://www.fast.design/docs/components/listbox) | `fastListbox()` `fastOption()` | [Listbox](https://explore.fast.design/components/fast-listbox) | An implementation of a [listbox](https://w3c.github.io/aria/#listbox). | [example](#fast-listbox)
| [fast-menu](https://www.fast.design/docs/components/menu) | `fastMenu()` `fastMenuItem()` | [Menu](https://explore.fast.design/components/fast-menu) | The menu is a widget that offers a list of choices to the user, such as a set of actions or functions. | [example](#fast-menu)
| [fast-number-field](https://www.fast.design/docs/components/number-field) | `fastNumberField()` | [Number field](https://explore.fast.design/components/fast-number-field) | An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. | [example](#fast-number-field)
| [fast-progress](https://www.fast.design/docs/components/progress) | `fastProgress()` `fastProgressRing()` | [Progress ring](https://explore.fast.design/components/fast-progress-ring)  / [Progress](https://explore.fast.design/components/fast-progress) | Progress components are used to display the length of time a process will take or to visualize percentage value (referred to as a determinate state) and to represent an unspecified wait time (referred to as an indeterminate state). | [example](#fast-progress)
| [fast-radio](https://www.fast.design/docs/components/radio) | `fastRadio()` | [Radio](https://explore.fast.design/components/fast-radio) | An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component. | [example](#fast-radio)
| [fast-radio-group](https://www.fast.design/docs/components/radio-group) | `fastRadio()` `fastRadioGroup()` | [Radio group](https://explore.fast.design/components/fast-radio-group) | An implementation of a [radio-group](https://w3c.github.io/aria-practices/#radiobutton). | [example](#fast-radio-group)
| [fast-select](https://www.fast.design/docs/components/select) | `fastSelect()` `fastOption()` | [Select](https://explore.fast.design/components/fast-select) | An implementation of an [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select). | [example](#fast-select)
| [fast-skeleton](https://www.fast.design/docs/components/skeleton) | `fastSkeleton()` | [Skeleton](https://explore.fast.design/components/fast-skeleton) | This a FAST web component implementation if a [Skeleton](https://open-ui.org/components/skeleton.research). | [example](#fast-skeleton)
| [fast-slider](https://www.fast.design/docs/components/slider) |  `fastSlider()` `fastSliderLabel()` | [Slider](https://explore.fast.design/components/fast-slider) | An implementation of a [range slider](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/range) as a form-connected web-component. | [example](#fast-slider)
| [fast-switch](https://www.fast.design/docs/components/switch) | `fastSwitch()` | [Switch](https://explore.fast.design/components/fast-switch) | An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component. | [example](#fast-switch) |
| [fast-tabs](https://www.fast.design/docs/components/tabs) | `fastTab()` `fastTabPanel()` `fastTabs()` | [Tabs](https://explore.fast.design/components/fast-tabs) | An implementation of a [tab](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role). | [example](#fast-tabs) |
| [fast-text-area](https://www.fast.design/docs/components/text-area) | `fastTextArea()` | [Text area](https://explore.fast.design/components/fast-text-area) | An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. | [example](#fast-text-area) | 
| [fast-text-field](https://www.fast.design/docs/components/text-field) | `fastTextField()` | [Text field](https://explore.fast.design/components/fast-text-field) | An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. | [example](#fast-text-field) |
| [fast-toolbar](https://www.fast.design/docs/components/toolbar) | `fastToolbar()` | [Toolbar](https://explore.fast.design/components/fast-toolbar) | An implementation of a [toolbar](https://w3c.github.io/aria-practices/#toolbar) as a web-component. | [example](#fast-toolbar) |
| [fast-tooltip](https://www.fast.design/docs/components/tooltip) | `fastTooltip()` | [Tooltip](https://explore.fast.design/components/fast-tooltip) | An implementation of a [tooltip](https://w3c.github.io/aria-practices/#tooltip) web-component. | [example](#fast-tooltip) |
| [fast-tree-view](https://www.fast.design/docs/components/tree-view) | `fastTreeItem()` `fastTreeView()` | [Tree view](https://explore.fast.design/components/fast-tree-view) | An implementation of a [tree-item](https://w3c.github.io/aria-practices/#TreeView) as a web-component. | [example](#fast-fast-tree-view) |

## Examples
### fast-accordian

```html
<!-- ... -->
<div>
    <fast-accordian>
        <fast-accordian-item>Item</fast-accordion-item>
    </fast-accordian>
</div>
<!-- ... -->
```

--- 

### fast-anchor

```html
<!-- ... -->
<fast-anchor>Anchor</fast-anchor>
<!-- ... -->
```

---

### fast-anchored-region

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-avatar

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-badge

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-breadcrumb

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-button

```html
<!-- ... -->
<fast-button>Submit</fast-button>
<!-- ... -->
```

<fast-button href="#">Submit</fast-button>

---

### fast-card

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-checkbox

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-combobox

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-data-grid

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-dialog

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-disclosure

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-divider

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-flipper

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-horizontal-scroll

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-listbox

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-menu

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-number-field

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-progress

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-radio

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-radio-group

```html
<!-- ... -->
 
<!-- ... -->
```

---

### fast-select

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-skeleton

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-slider

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-switch

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-tabs

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-text-area

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-text-field

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-toolbar

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-tooltip

```html
<!-- ... -->

<!-- ... -->
```

---

### fast-tree-view

```html
<!-- ... -->

<!-- ... -->
```

---