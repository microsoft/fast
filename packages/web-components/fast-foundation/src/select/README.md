---
id: select
title: fast-select
sidebar_label: select
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/select/README.md
---

An implementation of an [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastSelect(), fastOption());
```

### Customizing the Indicator

```ts
import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(
    fastSelect({
        indicator: `...your indicator...`,
    }),
    fastOption()
);
```

## Usage

```html live
<fast-select id="shirt-size">
    <fast-option value="s">Small</fast-option>
    <fast-option value="m">Medium</fast-option>
    <fast-option value="l">Large</fast-option>
    <fast-option value="xl">Extra Large</fast-option>
</fast-select>
```

## Create your own design

### Select

```ts
import {
    Select,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import { selectStyles as styles } from "./my-select.styles";

export const mySelect = Select.compose<SelectOptions>({
    baseName: "select",
    template,
    styles,
    indicator: `...default indicator...`,
});
```

### Option

See [listbox-option](/docs/components/listbox-option) for more information.

## API



### class: `Select`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedSelect` | /src/select/select.form-associated.js |         |

#### Static Fields

| Name                  | Privacy | Type | Default | Description | Inherited From |
| --------------------- | ------- | ---- | ------- | ----------- | -------------- |
| `slottedOptionFilter` | public  |      |         |             | Listbox        |

#### Fields

| Name                | Privacy   | Type                                   | Default | Description | Inherited From       |
| ------------------- | --------- | -------------------------------------- | ------- | ----------- | -------------------- |
| `open`              | public    | `boolean`                              |         |             |                      |
| `value`             | public    |                                        |         |             |                      |
| `positionAttribute` | public    | `SelectPosition or "above" or "below"` |         |             |                      |
| `position`          | public    | `SelectPosition or "above" or "below"` |         |             |                      |
| `displayValue`      | public    | `string`                               |         |             |                      |
| `proxy`             |           |                                        |         |             | FormAssociatedSelect |
| `length`            | public    | `number`                               |         |             | Listbox              |
| `options`           | public    | `ListboxOption[]`                      |         |             | Listbox              |
| `typeAheadExpired`  | protected |                                        |         |             | Listbox              |
| `disabled`          | public    | `boolean`                              |         |             | Listbox              |
| `multiple`          | public    | `boolean`                              |         |             | Listbox              |
| `selectedIndex`     | public    | `number`                               |         |             | Listbox              |
| `selectedOptions`   | public    | `ListboxOption[]`                      |         |             | Listbox              |
| `$presentation`     | public    | `ComponentPresentation or null`        |         |             | FoundationElement    |
| `template`          | public    | `ElementViewTemplate or void or null`  |         |             | FoundationElement    |
| `styles`            | public    | `ElementStyles or void or null`        |         |             | FoundationElement    |

#### Methods

| Name                       | Privacy   | Description | Parameters | Return | Inherited From    |
| -------------------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `openChanged`              | protected |             |            |        |                   |
| `positionChanged`          | protected |             |            |        |                   |
| `setPositioning`           | public    |             | `force`    | `void` |                   |
| `setDefaultSelectedOption` | protected |             |            | `void` |                   |
| `selectFirstOption`        | public    |             |            | `void` | Listbox           |
| `setSelectedOptions`       | public    |             |            |        | Listbox           |
| `templateChanged`          | protected |             |            | `void` | FoundationElement |
| `stylesChanged`            | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name       | Field             | Inherited From |
| ---------- | ----------------- | -------------- |
| `open`     | open              |                |
| `position` | positionAttribute |                |
|            | disabled          | Listbox        |

<hr/>

### class: `DelegatesARIASelect`

#### Fields

| Name           | Privacy | Type     | Default | Description                                                             | Inherited From |
| -------------- | ------- | -------- | ------- | ----------------------------------------------------------------------- | -------------- |
| `ariaControls` | public  | `string` |         | See https://www.w3.org/TR/wai-aria-1.2/#combobox for more information |                |

<hr/>


## Additional resources

- [Component explorer examples](https://explore.fast.design/components/fast-select)
- [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/select/select.spec.md)
- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)
- [Open UI Analysis](https://open-ui.org/components/select.research)
- [Open UI Proposal](https://open-ui.org/components/select)
