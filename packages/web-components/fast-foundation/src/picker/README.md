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



### class: `FASTPickerListItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name               | Privacy | Type           | Default | Description                                               | Inherited From |
| ------------------ | ------- | -------------- | ------- | --------------------------------------------------------- | -------------- |
| `value`            | public  | `string`       |         | The underlying string value of the item                   |                |
| `contentsTemplate` | public  | `ViewTemplate` |         | The template used to render the contents of the list item |                |

#### Methods

| Name                      | Privacy   | Description | Parameters         | Return    | Inherited From |
| ------------------------- | --------- | ----------- | ------------------ | --------- | -------------- |
| `contentsTemplateChanged` | protected |             |                    | `void`    |                |
| `handleKeyDown`           | public    |             | `e: KeyboardEvent` | `boolean` |                |
| `handleClick`             | public    |             | `e: MouseEvent`    | `boolean` |                |

#### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>



### class: `FASTPickerList`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

<hr/>



### class: `FASTPickerMenuOption`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name               | Privacy | Type           | Default | Description                                               | Inherited From |
| ------------------ | ------- | -------------- | ------- | --------------------------------------------------------- | -------------- |
| `value`            | public  | `string`       |         | The underlying string value of the item                   |                |
| `contentsTemplate` | public  | `ViewTemplate` |         | The template used to render the contents of the list item |                |

#### Methods

| Name                      | Privacy   | Description | Parameters      | Return    | Inherited From |
| ------------------------- | --------- | ----------- | --------------- | --------- | -------------- |
| `contentsTemplateChanged` | protected |             |                 | `void`    |                |
| `handleClick`             | public    |             | `e: MouseEvent` | `boolean` |                |

#### Attributes

| Name    | Field | Inherited From |
| ------- | ----- | -------------- |
| `value` | value |                |

<hr/>



### class: `FASTPickerMenu`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                       | Privacy | Type     | Default | Description                                                            | Inherited From |
| -------------------------- | ------- | -------- | ------- | ---------------------------------------------------------------------- | -------------- |
| `suggestionsAvailableText` | public  | `string` |         | Text to display to assistive technology when suggestions are available |                |

#### Methods

| Name                    | Privacy | Description | Parameters | Return | Inherited From |
| ----------------------- | ------- | ----------- | ---------- | ------ | -------------- |
| `menuElementsChanged`   | public  |             |            | `void` |                |
| `headerElementsChanged` | public  |             |            | `void` |                |
| `footerElementsChanged` | public  |             |            | `void` |                |

<hr/>



### class: `FormAssociatedPicker`

#### Superclass

| Name      | Module                               | Package |
| --------- | ------------------------------------ | ------- |
| `_Picker` | src/picker/picker.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTPicker`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedPicker` | /src/picker/picker.form-associated.js |         |

#### Fields

| Name                         | Privacy | Type                        | Default                      | Description                                                                                                                   | Inherited From       |
| ---------------------------- | ------- | --------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `selection`                  | public  | `string`                    | `""`                         | Currently selected items. Comma delineated string ie. "apples,oranges".                                                       |                      |
| `options`                    | public  | `string`                    |                              | Currently available options. Comma delineated string ie. "apples,oranges".                                                    |                      |
| `filterSelected`             | public  | `boolean`                   | `true`                       | Whether the component should remove an option from the list when it is in the selection                                       |                      |
| `filterQuery`                | public  | `boolean`                   | `true`                       | Whether the component should remove options based on the current query                                                        |                      |
| `maxSelected`                | public  | `number or undefined`       |                              | The maximum number of items that can be selected.                                                                             |                      |
| `noSuggestionsText`          | public  | `string`                    | `"No suggestions available"` | The text to present to assistive technolgies when no suggestions are available.                                               |                      |
| `suggestionsAvailableText`   | public  | `string`                    | `"Suggestions available"`    | The text to present to assistive technolgies when suggestions are available.                                                  |                      |
| `loadingText`                | public  | `string`                    | `"Loading suggestions"`      | The text to present to assistive technologies when suggestions are loading.                                                   |                      |
| `label`                      | public  | `string`                    |                              | Applied to the aria-label attribute of the input element                                                                      |                      |
| `labelledBy`                 | public  | `string`                    |                              | Applied to the aria-labelledby attribute of the input element                                                                 |                      |
| `placeholder`                | public  | `string`                    |                              | Applied to the placeholder attribute of the input element                                                                     |                      |
| `menuPlacement`              | public  | `menuConfigs`               | `"bottom-fill"`              | Controls menu placement                                                                                                       |                      |
| `showLoading`                | public  | `boolean`                   | `false`                      | Whether to display a loading state if the menu is opened.                                                                     |                      |
| `listItemTemplate`           | public  | `ViewTemplate`              |                              | Template used to generate selected items. This is used in a repeat directive.                                                 |                      |
| `defaultListItemTemplate`    | public  | `ViewTemplate or undefined` |                              | Default template to use for selected items (usually specified in the component template). This is used in a repeat directive. |                      |
| `menuOptionTemplate`         | public  | `ViewTemplate`              |                              | Template to use for available options. This is used in a repeat directive.                                                    |                      |
| `defaultMenuOptionTemplate`  | public  | `ViewTemplate or undefined` |                              | Default template to use for available options (usually specified in the template). This is used in a repeat directive.        |                      |
| `listItemContentsTemplate`   | public  | `ViewTemplate`              |                              | Template to use for the contents of a selected list item                                                                      |                      |
| `menuOptionContentsTemplate` | public  | `ViewTemplate`              |                              | Template to use for the contents of menu options                                                                              |                      |
| `optionsList`                | public  | `string[]`                  | `[]`                         | Current list of options in array form                                                                                         |                      |
| `query`                      | public  | `string`                    |                              | The text value currently in the input field                                                                                   |                      |
| `itemsPlaceholderElement`    | public  | `Node`                      |                              | Reference to the placeholder element for the repeat directive                                                                 |                      |
| `proxy`                      |         |                             |                              |                                                                                                                               | FormAssociatedPicker |

#### Methods

| Name                               | Privacy   | Description                                                   | Parameters         | Return    | Inherited From |
| ---------------------------------- | --------- | ------------------------------------------------------------- | ------------------ | --------- | -------------- |
| `selectionChanged`                 | protected |                                                               |                    | `void`    |                |
| `optionsChanged`                   | protected |                                                               |                    | `void`    |                |
| `menuPlacementChanged`             | protected |                                                               |                    | `void`    |                |
| `showLoadingChanged`               | protected |                                                               |                    | `void`    |                |
| `listItemTemplateChanged`          | protected |                                                               |                    | `void`    |                |
| `defaultListItemTemplateChanged`   | protected |                                                               |                    | `void`    |                |
| `menuOptionTemplateChanged`        | protected |                                                               |                    | `void`    |                |
| `defaultMenuOptionTemplateChanged` | protected |                                                               |                    | `void`    |                |
| `queryChanged`                     | protected |                                                               |                    | `void`    |                |
| `filteredOptionsListChanged`       | protected |                                                               |                    | `void`    |                |
| `flyoutOpenChanged`                | protected |                                                               |                    | `void`    |                |
| `focus`                            | public    | Move focus to the input element                               |                    |           |                |
| `handleKeyDown`                    | public    | Handle key down events.                                       | `e: KeyboardEvent` | `boolean` |                |
| `handleFocusIn`                    | public    | Handle focus in events.                                       | `e: FocusEvent`    | `boolean` |                |
| `handleFocusOut`                   | public    | Handle focus out events.                                      | `e: FocusEvent`    | `boolean` |                |
| `handleSelectionChange`            | public    | The list of selected items has changed                        |                    | `void`    |                |
| `handleRegionLoaded`               | public    | Anchored region is loaded, menu and options exist in the DOM. | `e: Event`         | `void`    |                |
| `handleItemInvoke`                 | public    | A list item has been invoked.                                 | `e: Event`         | `boolean` |                |
| `handleOptionInvoke`               | public    | A menu option has been invoked.                               | `e: Event`         | `boolean` |                |

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


