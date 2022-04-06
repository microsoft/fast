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



### class: `Search`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedSearch` | /src/search/search.form-associated.js |         |

#### Fields

| Name            | Privacy | Type                                  | Default | Description                                                                                                                                                                                                                 | Inherited From       |
| --------------- | ------- | ------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly`      | public  | `boolean`                             |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.                                 |                      |
| `autofocus`     | public  | `boolean`                             |         | Indicates that this element should get focus after the page finishes loading. See [autofocus HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus) for more information. |                      |
| `placeholder`   | public  | `string`                              |         |                                                                                                                                                                                                                             |                      |
| `list`          | public  | `string`                              |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.                              |                      |
| `maxlength`     | public  | `number`                              |         |                                                                                                                                                                                                                             |                      |
| `minlength`     | public  | `number`                              |         |                                                                                                                                                                                                                             |                      |
| `pattern`       | public  | `string`                              |         |                                                                                                                                                                                                                             |                      |
| `size`          | public  | `number`                              |         |                                                                                                                                                                                                                             |                      |
| `spellcheck`    | public  | `boolean`                             |         |                                                                                                                                                                                                                             |                      |
| `proxy`         |         |                                       |         |                                                                                                                                                                                                                             | FormAssociatedSearch |
| `$presentation` | public  | `ComponentPresentation or null`       |         |                                                                                                                                                                                                                             | FoundationElement    |
| `template`      | public  | `ElementViewTemplate or void or null` |         |                                                                                                                                                                                                                             | FoundationElement    |
| `styles`        | public  | `ElementStyles or void or null`       |         |                                                                                                                                                                                                                             | FoundationElement    |

#### Methods

| Name               | Privacy   | Description | Parameters | Return | Inherited From    |
| ------------------ | --------- | ----------- | ---------- | ------ | ----------------- |
| `handleClearInput` | public    |             |            | `void` |                   |
| `templateChanged`  | protected |             |            | `void` | FoundationElement |
| `stylesChanged`    | protected |             |            | `void` | FoundationElement |

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


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-search)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/search/search.spec.md)