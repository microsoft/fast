---
id: text-area
title: fast-text-area
sidebar_label: text-area
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/text-area/README.md
description: fast-text-area is an implementation of a textarea element as a form-connected web component.
---

An implementation of an [HTML textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) as a form-connected web-component. The `fast-text-area` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTextArea
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTextArea()
    );
```

## Usage

```html live
<fast-text-area placeholder="Describe your experience">How was your stay?</fast-text-area>
```

## Create your own design

```ts
import {
    TextArea,
    textAreaTemplate as template,
} from "@microsoft/fast-foundation";
import { textAreaStyles as styles } from "./my-text-area.styles";

export const myTextArea = TextArea.compose({
    baseName: "text-area",
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



### class: `FormAssociatedTextArea`

#### Superclass

| Name        | Module                                     | Package |
| ----------- | ------------------------------------------ | ------- |
| `_TextArea` | src/text-area/text-area.form-associated.ts |         |

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

| Name             | Description                | Type                                                                              |
| ---------------- | -------------------------- | --------------------------------------------------------------------------------- |
| `TextAreaResize` | Resize mode for a TextArea | `{ none: "none", both: "both", horizontal: "horizontal", vertical: "vertical", }` |

<hr/>



### class: `FASTTextArea`

#### Superclass

| Name                     | Module                                      | Package |
| ------------------------ | ------------------------------------------- | ------- |
| `FormAssociatedTextArea` | /src/text-area/text-area.form-associated.js |         |

#### Fields

| Name          | Privacy | Type             | Default | Description                                                                                                                                                                                        | Inherited From         |
| ------------- | ------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `readOnly`    | public  | `boolean`        |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.        |                        |
| `resize`      | public  | `TextAreaResize` |         | The resize mode of the element.                                                                                                                                                                    |                        |
| `autofocus`   | public  | `boolean`        |         | Indicates that this element should get focus after the page finishes loading.                                                                                                                      |                        |
| `formId`      | public  | `string`         |         | The [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global\_attributes/id) of the [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) the element is associated to |                        |
| `list`        | public  | `string`         |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by https://developer.mozilla.org/en-US/docs/Web/API/Element/id.             |                        |
| `maxlength`   | public  | `number`         |         | The maximum number of characters a user can enter.                                                                                                                                                 |                        |
| `minlength`   | public  | `number`         |         | The minimum number of characters a user can enter.                                                                                                                                                 |                        |
| `name`        | public  | `string`         |         | The name of the element.                                                                                                                                                                           |                        |
| `placeholder` | public  | `string`         |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                           |                        |
| `cols`        | public  | `number`         | `20`    | Sizes the element horizontally by a number of character columns.                                                                                                                                   |                        |
| `rows`        | public  | `number`         |         | Sizes the element vertically by a number of character rows.                                                                                                                                        |                        |
| `spellcheck`  | public  | `boolean`        |         | Sets if the element is eligible for spell checking but the UA.                                                                                                                                     |                        |
| `proxy`       |         |                  |         |                                                                                                                                                                                                    | FormAssociatedTextArea |

#### Methods

| Name                | Privacy   | Description                                       | Parameters | Return | Inherited From |
| ------------------- | --------- | ------------------------------------------------- | ---------- | ------ | -------------- |
| `readOnlyChanged`   | protected |                                                   |            | `void` |                |
| `autofocusChanged`  | protected |                                                   |            | `void` |                |
| `listChanged`       | protected |                                                   |            | `void` |                |
| `maxlengthChanged`  | protected |                                                   |            | `void` |                |
| `minlengthChanged`  | protected |                                                   |            | `void` |                |
| `spellcheckChanged` | protected |                                                   |            | `void` |                |
| `select`            | public    | Selects all the text in the text area             |            | `void` |                |
| `validate`          | public    | {@inheritDoc (FormAssociated:interface).validate} |            | `void` |                |

#### Events

| Name     | Type | Description                                                          | Inherited From |
| -------- | ---- | -------------------------------------------------------------------- | -------------- |
| `change` |      | Emits a custom 'change' event when the textarea emits a change event |                |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
|               | readOnly    |                |
| `resize`      | resize      |                |
|               | autofocus   |                |
| `form`        | formId      |                |
| `list`        | list        |                |
|               | maxlength   |                |
|               | minlength   |                |
| `name`        | name        |                |
| `placeholder` | placeholder |                |
|               | cols        |                |
|               | rows        |                |
|               | spellcheck  |                |

#### CSS Parts

| Name      | Description                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| `label`   | The label                                                                                |
| `control` | The logical control, the element wrapping the input field, including start and end slots |
| `field`   | The textarea element                                                                     |

#### Slots

| Name    | Description                                              |
| ------- | -------------------------------------------------------- |
| `start` | Content which can be provided before the text area input |
| `end`   | Content which can be provided after the text area input  |
|         | The default slot for the label                           |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-text-area)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/text-area/text-area.spec.md)