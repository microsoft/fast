---
id: text-field
title: fast-text-field
sidebar_label: text-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-field/README.md
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-text-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

:::note
This component filters out slotted _text_ nodes that are only white space to properly hide the label when the label is not in use.
:::

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTextField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTextField()
    );
```

## Usage

```html live
<fast-text-field appearance="filled" placeholder="user@email.com">Email</fast-text-field>
```

## Create your own design

```ts
import {
    TextField,
    textFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { textFieldStyles as styles } from "./my-text-field.styles";


export const myTextField = TextField.compose({
    baseName: "text-field",
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



### class: `TextField`

#### Superclass

| Name                      | Module                                        | Package |
| ------------------------- | --------------------------------------------- | ------- |
| `FormAssociatedTextField` | /src/text-field/text-field.form-associated.js |         |

#### Fields

| Name            | Privacy | Type                                                                 | Default | Description                                                                                                                                                                                                                 | Inherited From          |
| --------------- | ------- | -------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `readOnly`      | public  | `boolean`                                                            |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.                                 |                         |
| `autofocus`     | public  | `boolean`                                                            |         | Indicates that this element should get focus after the page finishes loading. See [autofocus HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus) for more information. |                         |
| `placeholder`   | public  | `string`                                                             |         |                                                                                                                                                                                                                             |                         |
| `type`          | public  | `TextFieldType or "email" or "password" or "tel" or "text" or "url"` |         |                                                                                                                                                                                                                             |                         |
| `list`          | public  | `string`                                                             |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.                              |                         |
| `maxlength`     | public  | `number`                                                             |         |                                                                                                                                                                                                                             |                         |
| `minlength`     | public  | `number`                                                             |         |                                                                                                                                                                                                                             |                         |
| `pattern`       | public  | `string`                                                             |         |                                                                                                                                                                                                                             |                         |
| `size`          | public  | `number`                                                             |         |                                                                                                                                                                                                                             |                         |
| `spellcheck`    | public  | `boolean`                                                            |         |                                                                                                                                                                                                                             |                         |
| `proxy`         |         |                                                                      |         |                                                                                                                                                                                                                             | FormAssociatedTextField |
| `$presentation` | public  | `ComponentPresentation or null`                                      |         |                                                                                                                                                                                                                             | FoundationElement       |
| `template`      | public  | `ElementViewTemplate or void or null`                                |         |                                                                                                                                                                                                                             | FoundationElement       |
| `styles`        | public  | `ElementStyles or void or null`                                      |         |                                                                                                                                                                                                                             | FoundationElement       |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | autofocus   |                |
| `placeholder` | placeholder |                |
| `type`        | type        |                |
| `list`        | list        |                |
|               | maxlength   |                |
|               | minlength   |                |
| `pattern`     | pattern     |                |
|               | size        |                |
|               | spellcheck  |                |

<hr/>

### class: `DelegatesARIATextbox`

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-text-field)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-field/text-field.spec.md)