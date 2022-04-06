---
id: listbox
title: fast-listbox
sidebar_label: listbox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/listbox/README.md
---

An implementation of a [listbox](https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox). While any DOM content is permissible as a child of the listbox, only [`fast-option`](/docs/components/listbox-option) elements, `option` elements, and slotted items with `role="option"` will be treated as options and receive keyboard support.

The `listbox` component has no internals related to form association. For a form-associated `listbox`, see the [`fast-select` component](/docs/components/select).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastListbox,
    fastOption,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastListbox(), fastOption());
```

## Usage

```html live
<div>
    <label id="preferred-format">Preferred Format:</label>
    <br />
    <fast-listbox aria-labelledby="preferred-format" name="preferred-format">
        <fast-option value="vinyl">Vinyl Record</fast-option>
        <fast-option value="casette">Casette</fast-option>
        <fast-option value="cd">Compact Disc</fast-option>
        <fast-option value="digital">Digital</fast-option>
    </fast-listbox>
</div>
```

## Create your own design

### Listbox

```ts
import { Listbox, listboxTemplate as template } from "@microsoft/fast-foundation";
import { listboxStyles as styles } from "./my-listbox.styles";

export const myListbox = Listbox.compose({
    baseName: "listbox",
    template,
    styles,
});
```

### Option

See [listbox-option](/docs/components/listbox-option) for more information.

## API



### class: `ListboxElement`

#### Superclass

| Name      | Module                  | Package |
| --------- | ----------------------- | ------- |
| `Listbox` | /src/listbox/listbox.js |         |

#### Static Fields

| Name                  | Privacy | Type | Default | Description | Inherited From |
| --------------------- | ------- | ---- | ------- | ----------- | -------------- |
| `slottedOptionFilter` | public  |      |         |             | Listbox        |

#### Fields

| Name               | Privacy   | Type                                  | Default | Description | Inherited From    |
| ------------------ | --------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `size`             | public    | `number`                              |         |             |                   |
| `length`           | public    | `number`                              |         |             | Listbox           |
| `options`          | public    | `ListboxOption[]`                     |         |             | Listbox           |
| `typeAheadExpired` | protected |                                       |         |             | Listbox           |
| `disabled`         | public    | `boolean`                             |         |             | Listbox           |
| `multiple`         | public    | `boolean`                             |         |             | Listbox           |
| `selectedIndex`    | public    | `number`                              |         |             | Listbox           |
| `selectedOptions`  | public    | `ListboxOption[]`                     |         |             | Listbox           |
| `$presentation`    | public    | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`         | public    | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`           | public    | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name                 | Privacy   | Description | Parameters | Return | Inherited From    |
| -------------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `setSelectedOptions` | public    |             |            |        | Listbox           |
| `selectFirstOption`  | public    |             |            | `void` | Listbox           |
| `templateChanged`    | protected |             |            | `void` | FoundationElement |
| `stylesChanged`      | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name | Field | Inherited From |
| ---- | ----- | -------------- |
|      | size  | Listbox        |

<hr/>



### class: `Listbox`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Static Fields

| Name                  | Privacy | Type | Default | Description | Inherited From |
| --------------------- | ------- | ---- | ------- | ----------- | -------------- |
| `slottedOptionFilter` | public  |      |         |             |                |

#### Fields

| Name               | Privacy   | Type                                  | Default | Description | Inherited From    |
| ------------------ | --------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `length`           | public    | `number`                              |         |             |                   |
| `options`          | public    | `ListboxOption[]`                     |         |             |                   |
| `typeAheadExpired` | protected |                                       |         |             |                   |
| `disabled`         | public    | `boolean`                             |         |             |                   |
| `multiple`         | public    | `boolean`                             |         |             |                   |
| `selectedIndex`    | public    | `number`                              |         |             |                   |
| `selectedOptions`  | public    | `ListboxOption[]`                     |         |             |                   |
| `$presentation`    | public    | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`         | public    | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`           | public    | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name                 | Privacy   | Description | Parameters | Return | Inherited From    |
| -------------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `selectFirstOption`  | public    |             |            | `void` |                   |
| `setSelectedOptions` | public    |             |            |        |                   |
| `templateChanged`    | protected |             |            | `void` | FoundationElement |
| `stylesChanged`      | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name | Field    | Inherited From |
| ---- | -------- | -------------- |
|      | disabled |                |
|      | multiple |                |

<hr/>

### class: `DelegatesARIAListbox`

#### Fields

| Name                   | Privacy | Type                             | Default | Description                                                            | Inherited From |
| ---------------------- | ------- | -------------------------------- | ------- | ---------------------------------------------------------------------- | -------------- |
| `ariaActiveDescendant` | public  | `string`                         |         | See https://www.w3.org/TR/wai-aria-1.2/#listbox for more information |                |
| `ariaDisabled`         | public  | `"true" or "false"`              |         | See https://www.w3.org/TR/wai-aria-1.2/#listbox for more information |                |
| `ariaExpanded`         | public  | `"true" or "false" or undefined` |         | See https://www.w3.org/TR/wai-aria-1.2/#listbox for more information |                |
| `ariaMultiSelectable`  | public  | `"true" or "false" or undefined` |         | See https://w3c.github.io/aria/#listbox for more information          |                |

<hr/>


## Additional resources

- [Component explorer examples](https://explore.fast.design/components/fast-listbox)
- [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/listbox/listbox.spec.md)
- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria-practices-1.2/#Listbox)
