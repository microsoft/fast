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

## `src/select/select.ts`:

### class: `Select`

#### Superclass

| Name                   | Module                             | Package |
| ---------------------- | ---------------------------------- | ------- |
| `FormAssociatedSelect` | /src/select/select.form-associated |         |

#### Static Fields

| Name                  | Privacy | Type | Default | Description                                         | Inherited From |
| --------------------- | ------- | ---- | ------- | --------------------------------------------------- | -------------- |
| `slottedOptionFilter` | public  |      |         | A static filter to include only selectable options. | Listbox        |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                | Privacy   | Type                                         | Default  | Description                                                                                                                                                                         | Inherited From       |
| ------------------- | --------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `open`              | public    | `boolean`                                    | `false`  | The open attribute.                                                                                                                                                                 |                      |
| `indexWhenOpened`   | private   | `number`                                     |          |                                                                                                                                                                                     |                      |
| `value`             | public    |                                              |          | The value property.                                                                                                                                                                 |                      |
| `positionAttribute` | public    | `SelectPosition \| "above" \| "below"`       |          | Reflects the placement for the listbox when the select is open.                                                                                                                     |                      |
| `position`          | public    | `SelectPosition \| "above" \| "below"`       |          | Holds the current state for the calculated position of the listbox.                                                                                                                 |                      |
| `displayValue`      | public    | `string`                                     | `""`     | The value displayed on the button.                                                                                                                                                  |                      |
| `proxy`             |           |                                              |          |                                                                                                                                                                                     | FormAssociatedSelect |
| `length`            | public    | `number`                                     |          | The number of options.                                                                                                                                                              | Listbox              |
| `options`           | public    | `ListboxOption[]`                            |          | The list of options.                                                                                                                                                                | Listbox              |
| `typeAheadExpired`  | protected |                                              |          |                                                                                                                                                                                     | Listbox              |
| `disabled`          | public    | `boolean`                                    |          | The disabled state of the listbox.                                                                                                                                                  | Listbox              |
| `multiple`          | public    | `boolean`                                    |          | Indicates if the listbox is in multi-selection mode.                                                                                                                                | Listbox              |
| `selectedIndex`     | public    | `number`                                     | `-1`     | The index of the selected option.                                                                                                                                                   | Listbox              |
| `selectedOptions`   | public    | `ListboxOption[]`                            | `[]`     | A collection of the selected options.                                                                                                                                               | Listbox              |
| `_presentation`     | private   | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                     | FoundationElement    |
| `$presentation`     | public    | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement    |
| `template`          | public    | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement    |
| `styles`            | public    | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement    |

#### Methods

| Name                       | Privacy   | Description                                                                | Parameters            | Return | Inherited From    |
| -------------------------- | --------- | -------------------------------------------------------------------------- | --------------------- | ------ | ----------------- |
| `openChanged`              | protected |                                                                            |                       |        |                   |
| `updateValue`              | private   |                                                                            | `shouldEmit: boolean` |        |                   |
| `positionChanged`          | protected |                                                                            |                       |        |                   |
| `setPositioning`           | public    | Calculate and apply listbox positioning based on available viewport space. | `force`               | `void` |                   |
| `maxHeightChanged`         | private   |                                                                            |                       | `void` |                   |
| `setDefaultSelectedOption` | protected |                                                                            |                       | `void` |                   |
| `selectFirstOption`        | public    | Moves focus to the first selectable option.                                |                       | `void` | Listbox           |
| `setSelectedOptions`       | public    | Sets an option as selected and gives it focus.                             |                       |        | Listbox           |
| `templateChanged`          | protected |                                                                            |                       | `void` | FoundationElement |
| `stylesChanged`            | protected |                                                                            |                       | `void` | FoundationElement |

#### Attributes

| Name       | Field             | Inherited From |
| ---------- | ----------------- | -------------- |
| `open`     | open              |                |
| `position` | positionAttribute |                |
|            | disabled          | Listbox        |

<hr/>

### class: `DelegatesARIASelect`

#### Fields

| Name           | Privacy | Type     | Default | Description                                                                     | Inherited From |
| -------------- | ------- | -------- | ------- | ------------------------------------------------------------------------------- | -------------- |
| `ariaControls` | public  | `string` |         | See {@link https\://www\.w3.org/TR/wai-aria-1.2/#combobox} for more information |                |

<hr/>

### Exports

| Kind | Name                  | Declaration         | Module               | Package |
| ---- | --------------------- | ------------------- | -------------------- | ------- |
| `js` | `Select`              | Select              | src/select/select.ts |         |
| `js` | `DelegatesARIASelect` | DelegatesARIASelect | src/select/select.ts |         |


## Additional resources

- [Component explorer examples](https://explore.fast.design/components/fast-select)
- [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/select/select.spec.md)
- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)
- [Open UI Analysis](https://open-ui.org/components/select.research)
- [Open UI Proposal](https://open-ui.org/components/select)
