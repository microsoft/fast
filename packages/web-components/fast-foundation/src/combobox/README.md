---
id: combobox
title: fast-combobox
sidebar_label: combobox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/combobox/README.md
description: fast-combobox is a web component implementation of a combobox.
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#combobox):

> A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value. The popup may be a listbox, grid, tree, or dialog. Many implementations also include a third optional element -- a graphical Open button adjacent to the combobox, which indicates availability of the popup. Activating the Open button displays the popup if suggestions are available.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastCombobox,
    fastOption,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(fastCombobox(), fastOption());
```

### Customizing the indicator

```ts
import {
    provideFASTDesignSystem,
    fastCombobox,
    fastOption,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(
    fastCombobox({
        indicator: `...your indicator...`,
    }),
    fastOption()
);
```

## Usage

```html live
<fast-combobox autocomplete="both">
    <fast-option>Christopher Eccleston</fast-option>
    <fast-option>David Tenant</fast-option>
    <fast-option>Matt Smith</fast-option>
    <fast-option>Peter Capaldi</fast-option>
    <fast-option>Jodie Whittaker</fast-option>
</fast-combobox>
```

## Create your own design

### Combobox

```ts
import {
    Combobox,
    ComboboxOptions,
    comboboxTemplate as template,
} from "@microsoft/fast-foundation";
import { comboboxStyles as styles } from "./my-combobox.styles";

export const myCombobox = Combobox.compose<ComboboxOptions>({
    baseName: "combobox",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
    indicator: `...default indicator...`,
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

### Option

See [listbox-option](/docs/components/listbox-option) for more information.

## API



### class: `FormAssociatedCombobox`

#### Superclass

| Name        | Module                                   | Package |
| ----------- | ---------------------------------------- | ------- |
| `_Combobox` | src/combobox/combobox.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Static Fields

| Name                  | Privacy | Type | Default | Description                                         | Inherited From |
| --------------------- | ------- | ---- | ------- | --------------------------------------------------- | -------------- |
| `slottedOptionFilter` | public  |      |         | A static filter to include only selectable options. | Listbox        |

#### Fields

| Name               | Privacy   | Type                                  | Default | Description                                                                                                                                                                         | Inherited From    |
| ------------------ | --------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `proxy`            |           |                                       |         |                                                                                                                                                                                     |                   |
| `length`           | public    | `number`                              |         | The number of options.                                                                                                                                                              | Listbox           |
| `options`          | public    | `ListboxOption[]`                     |         | The list of options.                                                                                                                                                                | Listbox           |
| `typeAheadExpired` | protected |                                       |         |                                                                                                                                                                                     | Listbox           |
| `disabled`         | public    | `boolean`                             |         | The disabled state of the listbox.                                                                                                                                                  | Listbox           |
| `selectedIndex`    | public    | `number`                              | `-1`    | The index of the selected option.                                                                                                                                                   | Listbox           |
| `selectedOptions`  | public    | `ListboxOption[]`                     | `[]`    | A collection of the selected options.                                                                                                                                               | Listbox           |
| `$presentation`    | public    | `ComponentPresentation or null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`         | public    | `ElementViewTemplate or void or null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`           | public    | `ElementStyles or void or null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                 | Privacy   | Description                                    | Parameters | Return | Inherited From    |
| -------------------- | --------- | ---------------------------------------------- | ---------- | ------ | ----------------- |
| `selectFirstOption`  | public    | Moves focus to the first selectable option.    |            | `void` | Listbox           |
| `setSelectedOptions` | public    | Sets an option as selected and gives it focus. |            |        | Listbox           |
| `templateChanged`    | protected |                                                |            | `void` | FoundationElement |
| `stylesChanged`      | protected |                                                |            | `void` | FoundationElement |

#### Attributes

| Name | Field    | Inherited From |
| ---- | -------- | -------------- |
|      | disabled | Listbox        |

<hr/>



### Variables

| Name                   | Description                       | Type                                                              |
| ---------------------- | --------------------------------- | ----------------------------------------------------------------- |
| `ComboboxAutocomplete` | Autocomplete values for combobox. | `{ inline: "inline", list: "list", both: "both", none: "none", }` |

<hr/>



### class: `Combobox`

#### Superclass

| Name                     | Module                                    | Package |
| ------------------------ | ----------------------------------------- | ------- |
| `FormAssociatedCombobox` | /src/combobox/combobox.form-associated.js |         |

#### Static Fields

| Name                  | Privacy | Type | Default | Description                                         | Inherited From |
| --------------------- | ------- | ---- | ------- | --------------------------------------------------- | -------------- |
| `slottedOptionFilter` | public  |      |         | A static filter to include only selectable options. | Listbox        |

#### Fields

| Name                | Privacy   | Type                                  | Default | Description                                                                                                                                                                         | Inherited From         |
| ------------------- | --------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `autocomplete`      | public    | `ComboboxAutocomplete or undefined`   |         | The autocomplete attribute.                                                                                                                                                         |                        |
| `filteredOptions`   | public    | `ListboxOption[]`                     | `[]`    | The collection of currently filtered options.                                                                                                                                       |                        |
| `open`              | public    | `boolean`                             | `false` | The open attribute.                                                                                                                                                                 |                        |
| `options`           | public    | `ListboxOption[]`                     |         | The list of options.                                                                                                                                                                | Listbox                |
| `placeholder`       | public    | `string`                              |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                            |                        |
| `positionAttribute` | public    | `SelectPosition or undefined`         |         | The placement for the listbox when the combobox is open.                                                                                                                            |                        |
| `position`          | public    | `SelectPosition or undefined`         |         | The current state of the calculated position of the listbox.                                                                                                                        |                        |
| `value`             | public    |                                       |         | The value property.                                                                                                                                                                 |                        |
| `proxy`             |           |                                       |         |                                                                                                                                                                                     | FormAssociatedCombobox |
| `length`            | public    | `number`                              |         | The number of options.                                                                                                                                                              | Listbox                |
| `typeAheadExpired`  | protected |                                       |         |                                                                                                                                                                                     | Listbox                |
| `disabled`          | public    | `boolean`                             |         | The disabled state of the listbox.                                                                                                                                                  | Listbox                |
| `selectedIndex`     | public    | `number`                              | `-1`    | The index of the selected option.                                                                                                                                                   | Listbox                |
| `selectedOptions`   | public    | `ListboxOption[]`                     | `[]`    | A collection of the selected options.                                                                                                                                               | Listbox                |
| `$presentation`     | public    | `ComponentPresentation or null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement      |
| `template`          | public    | `ElementViewTemplate or void or null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement      |
| `styles`            | public    | `ElementStyles or void or null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement      |

#### Methods

| Name                 | Privacy   | Description                                                                | Parameters                                                             | Return | Inherited From    |
| -------------------- | --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------ | ----------------- |
| `positionChanged`    | protected |                                                                            | `prev: SelectPosition or undefined, next: SelectPosition or undefined` | `void` |                   |
| `filterOptions`      | public    | Filter available options by text value.                                    |                                                                        | `void` |                   |
| `setPositioning`     | public    | Calculate and apply listbox positioning based on available viewport space. | `force`                                                                | `void` |                   |
| `selectFirstOption`  | public    | Moves focus to the first selectable option.                                |                                                                        | `void` | Listbox           |
| `setSelectedOptions` | public    | Sets an option as selected and gives it focus.                             |                                                                        |        | Listbox           |
| `templateChanged`    | protected |                                                                            |                                                                        | `void` | FoundationElement |
| `stylesChanged`      | protected |                                                                            |                                                                        | `void` | FoundationElement |

#### Events

| Name     | Type | Description                                          | Inherited From |
| -------- | ---- | ---------------------------------------------------- | -------------- |
| `change` |      | Fires a custom 'change' event when the value updates |                |

#### Attributes

| Name           | Field             | Inherited From |
| -------------- | ----------------- | -------------- |
| `autocomplete` | autocomplete      |                |
| `open`         | open              |                |
| `placeholder`  | placeholder       |                |
| `position`     | positionAttribute |                |
|                | disabled          | Listbox        |

#### CSS Parts

| Name             | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `control`        | The wrapper element containing the input area, including start and end |
| `selected-value` | The input element representing the selected value                      |
| `indicator`      | The element wrapping the indicator slot                                |
| `listbox`        | The wrapper for the listbox slotted options                            |
| `label`          | The label for the combobox                                             |

#### Slots

| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `start`     | Content which can be provided before the input              |
| `end`       | Content which can be provided after the input               |
| `control`   | Used to replace the input element representing the combobox |
| `indicator` | The visual indicator representing the expanded state        |
|             | The default slot for the options                            |
| `label`     | The slot for the combobox's label                           |

<hr/>

### class: `DelegatesARIACombobox`

#### Fields

| Name               | Privacy | Type                                                       | Default | Description                                                                       | Inherited From |
| ------------------ | ------- | ---------------------------------------------------------- | ------- | --------------------------------------------------------------------------------- | -------------- |
| `ariaAutoComplete` | public  | `"inline" or "list" or "both" or "none" or string or null` |         | See https://www.w3.org/TR/wai-aria-1.2/#aria-autocomplete for more information. |                |
| `ariaControls`     | public  | `string or null`                                           |         | See https://www.w3.org/TR/wai-aria-1.2/#aria-controls for more information.     |                |

<hr/>


## Additional resources

- [Component explorer examples](https://explore.fast.design/components/fast-combobox)
- [Component technical specification](https://github.com/microsoft/fast/tree/master/packages/web-components/fast-foundation/src/combobox)
- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#combobox)
