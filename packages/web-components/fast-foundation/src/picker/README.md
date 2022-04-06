<!-- ---
id: text-field
title: fast-text-field
sidebar_label: text-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-text-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.



:::note
This component filters out slotted _text_ nodes that are only white space to properly hide the label when the label is not in use.
:::
## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-text-field appearance="filled" placeholder="user@email.com">Email</fast-text-field>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TextFieldTemplate as template, TextField } from "@microsoft/fast-foundation";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextField extends TextField {}
``` -->

## API



### class: `PickerListItem`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name               | Privacy | Type                                  | Default | Description | Inherited From    |
| ------------------ | ------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `value`            | public  | `string`                              |         |             |                   |
| `contentsTemplate` | public  | `ViewTemplate`                        |         |             |                   |
| `$presentation`    | public  | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`         | public  | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`           | public  | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters         | Return    | Inherited From    |
| ----------------- | --------- | ----------- | ------------------ | --------- | ----------------- |
| `handleKeyDown`   | public    |             | `e: KeyboardEvent` | `boolean` |                   |
| `handleClick`     | public    |             | `e: MouseEvent`    | `boolean` |                   |
| `templateChanged` | protected |             |                    | `void`    | FoundationElement |
| `stylesChanged`   | protected |             |                    | `void`    | FoundationElement |

#### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>



### class: `PickerList`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name            | Privacy | Type                                  | Default | Description | Inherited From    |
| --------------- | ------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `$presentation` | public  | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`      | public  | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`        | public  | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

<hr/>



### class: `PickerMenuOption`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name               | Privacy | Type                                  | Default | Description | Inherited From    |
| ------------------ | ------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `value`            | public  | `string`                              |         |             |                   |
| `contentsTemplate` | public  | `ViewTemplate`                        |         |             |                   |
| `$presentation`    | public  | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`         | public  | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`           | public  | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters      | Return    | Inherited From    |
| ----------------- | --------- | ----------- | --------------- | --------- | ----------------- |
| `handleClick`     | public    |             | `e: MouseEvent` | `boolean` |                   |
| `templateChanged` | protected |             |                 | `void`    | FoundationElement |
| `stylesChanged`   | protected |             |                 | `void`    | FoundationElement |

#### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>



### class: `PickerMenu`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name                       | Privacy | Type                                  | Default | Description | Inherited From    |
| -------------------------- | ------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `suggestionsAvailableText` | public  | `string`                              |         |             |                   |
| `$presentation`            | public  | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`                 | public  | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`                   | public  | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name                    | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `menuElementsChanged`   | public    |             |            | `void` |                   |
| `headerElementsChanged` | public    |             |            | `void` |                   |
| `footerElementsChanged` | public    |             |            | `void` |                   |
| `templateChanged`       | protected |             |            | `void` | FoundationElement |
| `stylesChanged`         | protected |             |            | `void` | FoundationElement |

<hr/>



### class: `Picker`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedPicker` | /src/picker/picker.form-associated.js |         |

#### Fields

| Name                         | Privacy | Type                                  | Default | Description | Inherited From       |
| ---------------------------- | ------- | ------------------------------------- | ------- | ----------- | -------------------- |
| `selection`                  | public  | `string`                              |         |             |                      |
| `options`                    | public  | `string`                              |         |             |                      |
| `filterSelected`             | public  | `boolean`                             |         |             |                      |
| `filterQuery`                | public  | `boolean`                             |         |             |                      |
| `maxSelected`                | public  | `number or undefined`                 |         |             |                      |
| `noSuggestionsText`          | public  | `string`                              |         |             |                      |
| `suggestionsAvailableText`   | public  | `string`                              |         |             |                      |
| `loadingText`                | public  | `string`                              |         |             |                      |
| `label`                      | public  | `string`                              |         |             |                      |
| `labelledBy`                 | public  | `string`                              |         |             |                      |
| `placeholder`                | public  | `string`                              |         |             |                      |
| `menuPlacement`              | public  | `menuConfigs`                         |         |             |                      |
| `showLoading`                | public  | `boolean`                             |         |             |                      |
| `listItemTemplate`           | public  | `ViewTemplate`                        |         |             |                      |
| `defaultListItemTemplate`    | public  | `ViewTemplate or undefined`           |         |             |                      |
| `menuOptionTemplate`         | public  | `ViewTemplate`                        |         |             |                      |
| `defaultMenuOptionTemplate`  | public  | `ViewTemplate or undefined`           |         |             |                      |
| `listItemContentsTemplate`   | public  | `ViewTemplate`                        |         |             |                      |
| `menuOptionContentsTemplate` | public  | `ViewTemplate`                        |         |             |                      |
| `optionsList`                | public  | `string[]`                            |         |             |                      |
| `query`                      | public  | `string`                              |         |             |                      |
| `itemsPlaceholderElement`    | public  | `Node`                                |         |             |                      |
| `proxy`                      |         |                                       |         |             | FormAssociatedPicker |
| `$presentation`              | public  | `ComponentPresentation or null`       |         |             | FoundationElement    |
| `template`                   | public  | `ElementViewTemplate or void or null` |         |             | FoundationElement    |
| `styles`                     | public  | `ElementStyles or void or null`       |         |             | FoundationElement    |

#### Methods

| Name                    | Privacy   | Description | Parameters         | Return    | Inherited From    |
| ----------------------- | --------- | ----------- | ------------------ | --------- | ----------------- |
| `focus`                 | public    |             |                    |           |                   |
| `handleKeyDown`         | public    |             | `e: KeyboardEvent` | `boolean` |                   |
| `handleFocusIn`         | public    |             | `e: FocusEvent`    | `boolean` |                   |
| `handleFocusOut`        | public    |             | `e: FocusEvent`    | `boolean` |                   |
| `handleSelectionChange` | public    |             |                    | `void`    |                   |
| `handleRegionLoaded`    | public    |             | `e: Event`         | `void`    |                   |
| `handleItemInvoke`      | public    |             | `e: Event`         | `boolean` |                   |
| `handleOptionInvoke`    | public    |             | `e: Event`         | `boolean` |                   |
| `templateChanged`       | protected |             |                    | `void`    | FoundationElement |
| `stylesChanged`         | protected |             |                    | `void`    | FoundationElement |

#### Attributes

| Name                         | Field                    | Inherited From |
| ---------------------------- | ------------------------ | -------------- |
| `selection`                  | selection                |                |
| `options`                    | options                  |                |
| `filter-selected`            | filterSelected           |                |
| `filter-query`               | filterQuery              |                |
| `max-selected`               | maxSelected              |                |
| `no-suggestions-text`        | noSuggestionsText        |                |
| `suggestions-available-text` | suggestionsAvailableText |                |
| `loading-text`               | loadingText              |                |
| `label`                      | label                    |                |
| `labelledby`                 | labelledBy               |                |
| `placeholder`                | placeholder              |                |
| `menu-placement`             | menuPlacement            |                |

<hr/>


