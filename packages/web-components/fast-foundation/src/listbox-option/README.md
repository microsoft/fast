---
id: listbox-option
title: fast-option
sidebar_label: option
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/listbox-option/README.md
---

An implementation of an [option](https://w3c.github.io/aria/#option). To avoid namespace collisions with the [Option() constructor](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement/Option), the component class is `ListboxOption`, and our implementation is named `fast-option`.

The `<fast-option>` component will only provide internals related to form association when used within a form-associated component such as [`fast-select`](/docs/components/select) or [`fast-combobox`](/docs/components/combobox). It will not provide these capabilities when used only with a [`fast-listbox`](/docs/components/listbox).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastOption
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastOption()
    );
```

## Usage

See [`fast-select`](/docs/components/select), [`fast-combobox`](/docs/components/combobox), or [`fast-listbox`](/docs/components/listbox).

## Create your own design

```ts
import {
    ListboxOption,
    listboxOptionTemplate as template,
} from "@microsoft/fast-foundation";
import { optionStyles as styles } from "./my-listbox-option.styles";

export const myOption = ListboxOption.compose({
    baseName: "option",
    template,
    styles,
});
```

## API



### class: `ListboxOption`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name                | Privacy   | Type                                  | Default | Description | Inherited From    |
| ------------------- | --------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `checked`           | public    | `boolean or undefined`                |         |             |                   |
| `defaultSelected`   | public    | `boolean`                             |         |             |                   |
| `disabled`          | public    | `boolean`                             |         |             |                   |
| `selectedAttribute` | public    | `boolean`                             |         |             |                   |
| `selected`          | public    | `boolean`                             |         |             |                   |
| `dirtyValue`        | public    | `boolean`                             |         |             |                   |
| `initialValue`      | protected | `string`                              |         |             |                   |
| `label`             | public    |                                       |         |             |                   |
| `text`              | public    | `string`                              |         |             |                   |
| `value`             | public    | `string`                              |         |             |                   |
| `form`              | public    | `HTMLFormElement or null`             |         |             |                   |
| `proxy`             |           |                                       |         |             |                   |
| `$presentation`     | public    | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`          | public    | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`            | public    | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name                       | Privacy   | Description | Parameters                                | Return | Inherited From    |
| -------------------------- | --------- | ----------- | ----------------------------------------- | ------ | ----------------- |
| `checkedChanged`           | public    |             | `prev: boolean or unknown, next: boolean` | `void` |                   |
| `defaultSelectedChanged`   | protected |             |                                           | `void` |                   |
| `disabledChanged`          | protected |             | `prev: boolean, next: boolean`            | `void` |                   |
| `selectedAttributeChanged` | protected |             |                                           | `void` |                   |
| `selectedChanged`          | protected |             |                                           | `void` |                   |
| `initialValueChanged`      | public    |             | `previous: string, next: string`          | `void` |                   |
| `templateChanged`          | protected |             |                                           | `void` | FoundationElement |
| `stylesChanged`            | protected |             |                                           | `void` | FoundationElement |

#### Attributes

| Name       | Field             | Inherited From |
| ---------- | ----------------- | -------------- |
|            | disabled          |                |
| `selected` | selectedAttribute |                |
| `value`    | initialValue      |                |

<hr/>

### class: `DelegatesARIAListboxOption`

#### Fields

| Name           | Privacy | Type                             | Default | Description                                                            | Inherited From |
| -------------- | ------- | -------------------------------- | ------- | ---------------------------------------------------------------------- | -------------- |
| `ariaChecked`  | public  | `"true" or "false" or undefined` |         | See https://www.w3.org/TR/wai-aria-1.2/#option for more information. |                |
| `ariaPosInSet` | public  | `string`                         |         | See https://www.w3.org/TR/wai-aria-1.2/#option for more information. |                |
| `ariaSelected` | public  | `"true" or "false" or undefined` |         | See https://www.w3.org/TR/wai-aria-1.2/#option for more information. |                |
| `ariaSetSize`  | public  | `string`                         |         | See https://www.w3.org/TR/wai-aria-1.2/#option for more information. |                |

<hr/>

### Functions

| Name              | Description                                          | Parameters             | Return                |
| ----------------- | ---------------------------------------------------- | ---------------------- | --------------------- |
| `isListboxOption` | Determines if the element is a (ListboxOption:class) | `el: Element, element` | `el is ListboxOption` |

<hr/>


## Additional resources

* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/listbox-option/listbox-option.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria/#option)