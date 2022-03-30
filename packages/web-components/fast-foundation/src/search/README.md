---
id: search
title: fast-search
sidebar_label: search
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/search/README.md
---

An implementation of a [search](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/search) as a form-connected web-component. The `fast-search` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

:::note
This component filters out slotted _text_ nodes that are only white space to properly hide the label when the label is not in use.
:::

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastSearch
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSearch()
    );
```

## Usage

```html live
<fast-search placeholder="search">search</fast-search>
```

## Create your own design

```ts
import {
    Search,
    searcgTemplate as template,
} from "@microsoft/fast-foundation";
import { searchStyles as styles } from "./my-search.styles";


export const mySearch = Search.compose({
    baseName: "search",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## API

## `src/search/search.ts`:

### class: `Search`

#### Superclass

| Name                   | Module                             | Package |
| ---------------------- | ---------------------------------- | ------- |
| `FormAssociatedSearch` | /src/search/search.form-associated |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                         | Default  | Description                                                                                                                                                                                                                       | Inherited From       |
| --------------- | ------- | -------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly`      | public  | `boolean`                                    |          | When true, the control will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information.                                 |                      |
| `autofocus`     | public  | `boolean`                                    |          | Indicates that this element should get focus after the page finishes loading. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus \| autofocus HTML attribute} for more information. |                      |
| `placeholder`   | public  | `string`                                     |          | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                                                          |                      |
| `list`          | public  | `string`                                     |          | Allows associating a {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist \| datalist} to the element by {@link https\://developer.mozilla.org/en-US/docs/Web/API/Element/id}.                              |                      |
| `maxlength`     | public  | `number`                                     |          | The maximum number of characters a user can enter.                                                                                                                                                                                |                      |
| `minlength`     | public  | `number`                                     |          | The minimum number of characters a user can enter.                                                                                                                                                                                |                      |
| `pattern`       | public  | `string`                                     |          | A regular expression that the value must match to pass validation.                                                                                                                                                                |                      |
| `size`          | public  | `number`                                     |          | Sets the width of the element to a specified number of characters.                                                                                                                                                                |                      |
| `spellcheck`    | public  | `boolean`                                    |          | Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.                                                                                              |                      |
| `proxy`         |         |                                              |          |                                                                                                                                                                                                                                   | FormAssociatedSearch |
| `_presentation` | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                                                   | FoundationElement    |
| `$presentation` | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                                                  | FoundationElement    |
| `template`      | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.                                      | FoundationElement    |
| `styles`        | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition.                             | FoundationElement    |

#### Methods

| Name                 | Privacy   | Description                             | Parameters | Return | Inherited From    |
| -------------------- | --------- | --------------------------------------- | ---------- | ------ | ----------------- |
| `readOnlyChanged`    | private   |                                         |            | `void` |                   |
| `autofocusChanged`   | private   |                                         |            | `void` |                   |
| `placeholderChanged` | private   |                                         |            | `void` |                   |
| `listChanged`        | private   |                                         |            | `void` |                   |
| `maxlengthChanged`   | private   |                                         |            | `void` |                   |
| `minlengthChanged`   | private   |                                         |            | `void` |                   |
| `patternChanged`     | private   |                                         |            | `void` |                   |
| `sizeChanged`        | private   |                                         |            | `void` |                   |
| `spellcheckChanged`  | private   |                                         |            | `void` |                   |
| `handleClearInput`   | public    | Handles the control's clear value event |            | `void` |                   |
| `templateChanged`    | protected |                                         |            | `void` | FoundationElement |
| `stylesChanged`      | protected |                                         |            | `void` | FoundationElement |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | autofocus   |                |
| `placeholder` | placeholder |                |
| `list`        | list        |                |
|               | maxlength   |                |
|               | minlength   |                |
| `pattern`     | pattern     |                |
|               | size        |                |
|               | spellcheck  |                |

<hr/>

### class: `DelegatesARIASearch`

<hr/>

### Exports

| Kind | Name                  | Declaration         | Module               | Package |
| ---- | --------------------- | ------------------- | -------------------- | ------- |
| `js` | `Search`              | Search              | src/search/search.ts |         |
| `js` | `DelegatesARIASearch` | DelegatesARIASearch | src/search/search.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-search)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/search/search.spec.md)