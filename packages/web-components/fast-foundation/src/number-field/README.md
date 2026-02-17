---
id: number-field
title: fast-number-field
sidebar_label: number-field
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/number-field/README.md
description: fast-number-field is a web component implementation of a text field number input.
---

An implementation of a [text field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text) as a form-connected web-component. The `fast-number-field` supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastNumberField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastNumberField()
    );
```

### Customizing Glyphs

```ts
import {
    provideFASTDesignSystem,
    fastNumberField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastNumberField({
            stepDownGlyph: `...your step down glyph...`,
            stepUpGlyph: `...your setup up glyph...`,
        })
    );
```

## Usage

```html live
<fast-number-field appearance="filled" min="0" max="10"></fast-number-field>
```

## Create your own design

```ts
import {
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template,
} from "@microsoft/fast-foundation";
import { numberFieldStyles as styles } from "./my-number-field.styles";

export const myNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: "number-field",
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `...default step down glyph...`,
    stepUpGlyph: `...default setup up glyph...`,
});
```

:::note
This component is built with the expectation that focus is delegated to the input element rendered into the shadow DOM.
:::

## API



### class: `FormAssociatedNumberField`

#### Superclass

| Name           | Module                                           | Package |
| -------------- | ------------------------------------------------ | ------- |
| `_NumberField` | src/number-field/number-field.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTNumberField`

#### Superclass

| Name                        | Module                                            | Package |
| --------------------------- | ------------------------------------------------- | ------- |
| `FormAssociatedNumberField` | /src/number-field/number-field.form-associated.js |         |

#### Fields

| Name            | Privacy | Type      | Default | Description                                                                                                                                                                                                                 | Inherited From            |
| --------------- | ------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `readOnly`      | public  | `boolean` |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information.                                 |                           |
| `autofocus`     | public  | `boolean` |         | Indicates that this element should get focus after the page finishes loading. See [autofocus HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus) for more information. |                           |
| `hideStep`      | public  | `boolean` | `false` | When true, spin buttons will not be rendered                                                                                                                                                                                |                           |
| `placeholder`   | public  | `string`  |         | Sets the placeholder value of the element, generally used to provide a hint to the user.                                                                                                                                    |                           |
| `list`          | public  | `string`  |         | Allows associating a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to the element by https://developer.mozilla.org/en-US/docs/Web/API/Element/id.                                      |                           |
| `maxlength`     | public  | `number`  |         | The maximum number of characters a user can enter.                                                                                                                                                                          |                           |
| `minlength`     | public  | `number`  |         | The minimum number of characters a user can enter.                                                                                                                                                                          |                           |
| `size`          | public  | `number`  |         | Sets the width of the element to a specified number of characters.                                                                                                                                                          |                           |
| `step`          | public  | `number`  | `1`     | Amount to increment or decrement the value by                                                                                                                                                                               |                           |
| `max`           | public  | `number`  |         | The maximum the value can be                                                                                                                                                                                                |                           |
| `min`           | public  | `number`  |         | The minimum the value can be                                                                                                                                                                                                |                           |
| `valueAsNumber` | public  | `number`  |         | The value property, typed as a number.                                                                                                                                                                                      |                           |
| `proxy`         |         |           |         |                                                                                                                                                                                                                             | FormAssociatedNumberField |

#### Methods

| Name       | Privacy | Description                                       | Parameters | Return | Inherited From |
| ---------- | ------- | ------------------------------------------------- | ---------- | ------ | -------------- |
| `validate` | public  | {@inheritDoc (FormAssociated:interface).validate} |            | `void` |                |
| `stepUp`   | public  | Increments the value using the step value         |            | `void` |                |
| `stepDown` | public  | Decrements the value using the step value         |            | `void` |                |
| `select`   | public  | Selects all the text in the number field          |            | `void` |                |

#### Events

| Name     | Type | Description                                              | Inherited From |
| -------- | ---- | -------------------------------------------------------- | -------------- |
| `input`  |      | Fires a custom 'input' event when the value has changed  |                |
| `change` |      | Fires a custom 'change' event when the value has changed |                |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | autofocus   |                |
| `hide-step`   | hideStep    |                |
| `placeholder` | placeholder |                |
| `list`        | list        |                |
|               | maxlength   |                |
|               | minlength   |                |
|               | size        |                |
|               | step        |                |
|               | max         |                |
|               | min         |                |

#### CSS Parts

| Name           | Description                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| `label`        | The label                                                                                |
| `control`      | The logical control, the element wrapping the input field, including start and end slots |
| `field`        | The element representing the input field                                                 |
| `step-buttons` | The step up and step down controls                                                       |
| `step-up`      | The step up control                                                                      |
| `step-down`    | The step down control                                                                    |

#### Slots

| Name             | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `start`          | Content which can be provided before the number field input |
| `end`            | Content which can be provided after the number field input  |
|                  | The default slot for the label                              |
| `step-up-icon`   | The icon for the step up control                            |
| `step-down-icon` | The icon for the step down control                          |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-number-field)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/number-field/number-field.spec.md)