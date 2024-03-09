---
id: text-field
title: fast-text-field
sidebar_label: text-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-field/README.md
description: fast-text-field is an implementation of a text field as a form-connected web component.
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



### class: `FormAssociatedTextField`

#### Superclass

| Name         | Module                                       | Package |
| ------------ | -------------------------------------------- | ------- |
| `_TextField` | src/text-field/text-field.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### Variables

| Name            | Description          | Type                                                                              |
| --------------- | -------------------- | --------------------------------------------------------------------------------- |
| `TextFieldType` | Text field sub-types | `{ email: "email", password: "password", tel: "tel", text: "text", url: "url", }` |

<hr/>



### class: `FASTTextField`

#### Superclass

| Name                      | Module                                        | Package |
| ------------------------- | --------------------------------------------- | ------- |
| `FormAssociatedTextField` | /src/text-field/text-field.form-associated.js |         |

#### Fields

| Name          | Privacy | Type            | Default | Description                                                                                                                                                                                                                 | Inherited From          |
| ------------- | ------- | --------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `readOnly`    | public  | `boolean`       |         | When true, the input will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.                                   |                         |
| `autofocus`   | public  | `boolean`       |         | Indicates that this element should get focus after the page finishes loading. See [autofocus HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus) for more information. |                         |
| `placeholder` | public  | `string`        |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                                                    |                         |
| `type`        | public  | `TextFieldType` |         | Allows setting a type or mode of text.                                                                                                                                                                                      |                         |
| `list`        | public  | `string`        |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by https://developer.mozilla.org/en-US/docs/Web/API/Element/id.                                      |                         |
| `maxlength`   | public  | `number`        |         | The maximum number of characters a user can enter.                                                                                                                                                                          |                         |
| `minlength`   | public  | `number`        |         | The minimum number of characters a user can enter.                                                                                                                                                                          |                         |
| `pattern`     | public  | `string`        |         | A regular expression that the value must match to pass validation.                                                                                                                                                          |                         |
| `size`        | public  | `number`        |         | Sets the width of the element to a specified number of characters.                                                                                                                                                          |                         |
| `spellcheck`  | public  | `boolean`       |         | Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.                                                                                        |                         |
| `proxy`       |         |                 |         |                                                                                                                                                                                                                             | FormAssociatedTextField |

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
| `select`             | public    | Selects all the text in the text field            |            | `void` |                |
| `validate`           | public    | {@inheritDoc (FormAssociated:interface).validate} |            | `void` |                |

#### Events

| Name     | Type | Description                                              | Inherited From |
| -------- | ---- | -------------------------------------------------------- | -------------- |
| `change` |      | Fires a custom 'change' event when the value has changed |                |

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

#### CSS Parts

| Name      | Description                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| `label`   | The label                                                                                |
| `control` | The logical control, the element wrapping the input field, including start and end slots |
| `field`   | The text field element                                                                   |

#### Slots

| Name    | Description                                          |
| ------- | ---------------------------------------------------- |
| `start` | Content which can be provided before the input field |
| `end`   | Content which can be provided after the input field  |
|         | The default slot for the label                       |

<hr/>

### class: `DelegatesARIATextbox`

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-text-field)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-field/text-field.spec.md)