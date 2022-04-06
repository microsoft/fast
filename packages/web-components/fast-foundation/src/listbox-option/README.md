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

## `src/listbox-option/listbox-option.ts`:

### class: `ListboxOption`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                | Privacy   | Type                                  | Default                                                                                                                                                 | Description                                                                                                                                                                          | Inherited From    |
| ------------------- | --------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `checked`           | public    | `boolean \| undefined`                |                                                                                                                                                         | The checked state is used when the parent listbox is in multiple selection mode. To avoid accessibility conflicts, the checked state should not be present in single selection mode. |                   |
| `defaultSelected`   | public    | `boolean`                             | `false`                                                                                                                                                 | The defaultSelected state of the option.                                                                                                                                             |                   |
| `disabled`          | public    | `boolean`                             |                                                                                                                                                         | The disabled state of the option.                                                                                                                                                    |                   |
| `selectedAttribute` | public    | `boolean`                             |                                                                                                                                                         | The selected attribute value. This sets the initial selected value.                                                                                                                  |                   |
| `selected`          | public    | `boolean`                             |                                                                                                                                                         | The checked state of the control.                                                                                                                                                    |                   |
| `dirtyValue`        | public    | `boolean`                             | `false`                                                                                                                                                 | Track whether the value has been changed from the initial value                                                                                                                      |                   |
| `initialValue`      | protected | `string`                              |                                                                                                                                                         | The initial value of the option. This value sets the \`value\` property only when the \`value\` property has not been explicitly set.                                                |                   |
| `label`             | public    |                                       |                                                                                                                                                         |                                                                                                                                                                                      |                   |
| `text`              | public    | `string`                              |                                                                                                                                                         |                                                                                                                                                                                      |                   |
| `value`             | public    | `string`                              |                                                                                                                                                         |                                                                                                                                                                                      |                   |
| `form`              | public    | `HTMLFormElement \| null`             |                                                                                                                                                         |                                                                                                                                                                                      |                   |
| `proxy`             |           |                                       | ``new Option(             `${this.textContent}`,             this.initialValue,             this.defaultSelected,             this.selected         )`` |                                                                                                                                                                                      |                   |
| `$presentation`     | public    | `ComponentPresentation \| null`       |                                                                                                                                                         | A property which resolves the ComponentPresentation instance for the current component.                                                                                              | FoundationElement |
| `template`          | public    | `ElementViewTemplate \| void \| null` |                                                                                                                                                         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.           | FoundationElement |
| `styles`            | public    | `ElementStyles \| void \| null`       |                                                                                                                                                         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.  | FoundationElement |

#### Methods

| Name                       | Privacy   | Description                                                         | Parameters                                | Return | Inherited From    |
| -------------------------- | --------- | ------------------------------------------------------------------- | ----------------------------------------- | ------ | ----------------- |
| `checkedChanged`           | public    | Updates the ariaChecked property when the checked property changes. | `prev: boolean \| unknown, next: boolean` | `void` |                   |
| `defaultSelectedChanged`   | protected |                                                                     |                                           | `void` |                   |
| `disabledChanged`          | protected |                                                                     | `prev: boolean, next: boolean`            | `void` |                   |
| `selectedAttributeChanged` | protected |                                                                     |                                           | `void` |                   |
| `selectedChanged`          | protected |                                                                     |                                           | `void` |                   |
| `initialValueChanged`      | public    |                                                                     | `previous: string, next: string`          | `void` |                   |
| `templateChanged`          | protected |                                                                     |                                           | `void` | FoundationElement |
| `stylesChanged`            | protected |                                                                     |                                           | `void` | FoundationElement |

#### Attributes

| Name       | Field             | Inherited From |
| ---------- | ----------------- | -------------- |
|            | disabled          |                |
| `selected` | selectedAttribute |                |
| `value`    | initialValue      |                |

<hr/>

### class: `DelegatesARIAListboxOption`

#### Fields

| Name           | Privacy | Type                             | Default | Description                                                                    | Inherited From |
| -------------- | ------- | -------------------------------- | ------- | ------------------------------------------------------------------------------ | -------------- |
| `ariaChecked`  | public  | `"true" \| "false" \| undefined` |         | See {@link https\://www\.w3.org/TR/wai-aria-1.2/#option} for more information. |                |
| `ariaPosInSet` | public  | `string`                         |         | See {@link https\://www\.w3.org/TR/wai-aria-1.2/#option} for more information. |                |
| `ariaSelected` | public  | `"true" \| "false" \| undefined` |         | See {@link https\://www\.w3.org/TR/wai-aria-1.2/#option} for more information. |                |
| `ariaSetSize`  | public  | `string`                         |         | See {@link https\://www\.w3.org/TR/wai-aria-1.2/#option} for more information. |                |

<hr/>

### Functions

| Name              | Description                                                  | Parameters             | Return                |
| ----------------- | ------------------------------------------------------------ | ---------------------- | --------------------- |
| `isListboxOption` | Determines if the element is a {@link (ListboxOption:class)} | `el: Element, element` | `el is ListboxOption` |

<hr/>

### Exports

| Kind | Name                         | Declaration                | Module                               | Package |
| ---- | ---------------------------- | -------------------------- | ------------------------------------ | ------- |
| `js` | `isListboxOption`            | isListboxOption            | src/listbox-option/listbox-option.ts |         |
| `js` | `ListboxOption`              | ListboxOption              | src/listbox-option/listbox-option.ts |         |
| `js` | `DelegatesARIAListboxOption` | DelegatesARIAListboxOption | src/listbox-option/listbox-option.ts |         |


## Additional resources

* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/listbox-option/listbox-option.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria/#option)