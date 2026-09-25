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



### class: `FormAssociatedSearch`

#### Superclass

| Name      | Module                               | Package |
| --------- | ------------------------------------ | ------- |
| `_Search` | src/search/search.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTSearch`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedSearch` | /src/search/search.form-associated.js |         |

#### Fields

| Name          | Privacy | Type      | Default | Description                                                                                                                                                                                                                 | Inherited From       |
| ------------- | ------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly`    | public  | `boolean` |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.                                 |                      |
| `autofocus`   | public  | `boolean` |         | Indicates that this element should get focus after the page finishes loading. See [autofocus HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus) for more information. |                      |
| `placeholder` | public  | `string`  |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                                                    |                      |
| `list`        | public  | `string`  |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by https://developer.mozilla.org/en-US/docs/Web/API/Element/id.                                      |                      |
| `maxlength`   | public  | `number`  |         | The maximum number of characters a user can enter.                                                                                                                                                                          |                      |
| `minlength`   | public  | `number`  |         | The minimum number of characters a user can enter.                                                                                                                                                                          |                      |
| `pattern`     | public  | `string`  |         | A regular expression that the value must match to pass validation.                                                                                                                                                          |                      |
| `size`        | public  | `number`  |         | Sets the width of the element to a specified number of characters.                                                                                                                                                          |                      |
| `spellcheck`  | public  | `boolean` |         | Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.                                                                                        |                      |
| `proxy`       |         |           |         |                                                                                                                                                                                                                             | FormAssociatedSearch |

#### Methods

| Name                 | Privacy   | Description                                       | Parameters | Return | Inherited From |
| -------------------- | --------- | ------------------------------------------------- | ---------- | ------ | -------------- |
| `readOnlyChanged`    | protected |                                                   |            | `void` |                |
| `autofocusChanged`   | protected |                                                   |            | `void` |                |
| `placeholderChanged` | protected |                                                   |            | `void` |                |
| `listChanged`        | protected |                                                   |            | `void` |                |
| `maxlengthChanged`   | protected |                                                   |            | `void` |                |
| `minlengthChanged`   | protected |                                                   |            | `void` |                |
| `patternChanged`     | protected |                                                   |            | `void` |                |
| `sizeChanged`        | protected |                                                   |            | `void` |                |
| `spellcheckChanged`  | protected |                                                   |            | `void` |                |
| `validate`           | public    | {@inheritDoc (FormAssociated:interface).validate} |            | `void` |                |
| `handleClearInput`   | public    | Clears the value                                  |            | `void` |                |

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

#### CSS Parts

| Name           | Description                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| `label`        | The label                                                                                |
| `control`      | The logical control, the element wrapping the input field, including start and end slots |
| `field`        | The element representing the input field                                                 |
| `clear-button` | The button to clear the input                                                            |

#### Slots

| Name           | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `start`        | Content which can be provided before the search input       |
| `end`          | Content which can be provided after the search clear button |
|                | The default slot for the label                              |
| `clear-button` | The clear button                                            |
| `clear-icon`   | The clear icon                                              |

<hr/>

### class: `DelegatesARIASearch`

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-search)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/search/search.spec.md)