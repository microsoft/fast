---
id: checkbox
title: fast-checkbox
sidebar_label: checkbox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/checkbox/README.md
description: fast-checkbox is a form-connected web component implementation of a checkbox.
---

An implementation of a [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastCheckbox
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCheckbox()
    );
```

### Customizing Indicators

```ts
import {
    provideFASTDesignSystem,
    fastCheckbox
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCheckbox({
            checkedIndicator: `...your checked indicator...`,
            indeterminateIndicator: `...your indeterminate indicator...`,
        })
    );
```

## Usage

```html live
<fieldset>
    <legend>Fruits</legend>
    <fast-checkbox checked>Apple</fast-checkbox>
    <fast-checkbox checked>Banana</fast-checkbox>
    <fast-checkbox>Honeydew</fast-checkbox>
    <fast-checkbox checked>Mango</fast-checkbox>
</fieldset>
```

## Create your own design

```ts
import {
    Checkbox,
    CheckboxOptions,
    checkboxTemplate as template,
} from "@microsoft/fast-foundation";
import { checkboxStyles as styles } from "./my-checkbox.styles";

export const myCheckbox = Checkbox.compose<CheckboxOptions>({
    baseName: "checkbox",
    template,
    styles,
    checkedIndicator: `...default checked indicator...`,
    indeterminateIndicator: `...default indeterminate indicator...`,
});
```

## API



### class: `FormAssociatedCheckbox`

#### Superclass

| Name        | Module                                   | Package |
| ----------- | ---------------------------------------- | ------- |
| `_Checkbox` | src/checkbox/checkbox.form-associated.ts |         |

#### Mixins

| Name                      | Module                                  | Package |
| ------------------------- | --------------------------------------- | ------- |
| `CheckableFormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTCheckbox`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Mixins

| Name               | Module | Package               |
| ------------------ | ------ | --------------------- |
| `FormControlMixin` |        | @open-wc/form-control |

#### Static Fields

| Name                    | Privacy | Type    | Default               | Description | Inherited From |
| ----------------------- | ------- | ------- | --------------------- | ----------- | -------------- |
| `formControlValidators` |         | `array` | `[requiredValidator]` |             |                |

#### Fields

| Name               | Privacy   | Type                   | Default | Description                                                                                                                                                                                                                                                                                                                             | Inherited From |
| ------------------ | --------- | ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `ariaChecked`      | public    | `string or null`       |         |                                                                                                                                                                                                                                                                                                                                         |                |
| `checked`          | public    | `boolean`              | `false` |                                                                                                                                                                                                                                                                                                                                         |                |
| `checkedAttribute` | public    | `boolean`              | `false` | The initial state of the checkbox.                                                                                                                                                                                                                                                                                                      |                |
| `currentChecked`   | public    | `boolean`              |         | The current checkedness of the element. This property serves as a mechanism to set the \`checked\` property through both property assignment and the .setAttribute() method. This is useful for setting the field's checkedness in UI libraries that bind data through the .setAttribute() API and don't support IDL attribute binding. |                |
| `defaultChecked`   | public    | `boolean`              |         |                                                                                                                                                                                                                                                                                                                                         |                |
| `dirtyChecked`     | protected | `boolean`              | `false` | Tracks whether the "checked" property has been changed. This is necessary to provide consistent behavior with normal input checkboxes                                                                                                                                                                                                   |                |
| `disabled`         | public    | `boolean`              | `false` | Sets the element's disabled state. A disabled element will not be included during form submission.                                                                                                                                                                                                                                      |                |
| `indeterminate`    | public    | `boolean or undefined` |         | The indeterminate state of the control                                                                                                                                                                                                                                                                                                  |                |
| `initialValue`     | public    | `string`               | `"on"`  | The initial value of the form. This value sets the \`value\` property only when the \`value\` property has not been explicitly set.                                                                                                                                                                                                     |                |
| `name`             | public    | `string`               |         | The name of the element. This element's value will be surfaced during form submission under the provided name.                                                                                                                                                                                                                          |                |
| `required`         | public    | `boolean`              | `false` | The required state of the element. If true, the element will be required to complete the form.                                                                                                                                                                                                                                          |                |
| `value`            | public    | `string`               |         | The value of the element. This element's value will be surfaced during form submission under the provided name.                                                                                                                                                                                                                         |                |

#### Methods

| Name                    | Privacy | Description                                         | Parameters                                  | Return    | Inherited From |
| ----------------------- | ------- | --------------------------------------------------- | ------------------------------------------- | --------- | -------------- |
| `checkedChanged`        | public  |                                                     | `prev: boolean or undefined, next: boolean` | `void`    |                |
| `currentCheckedChanged` | public  |                                                     | `prev: boolean or undefined, next: boolean` |           |                |
| `initialValueChanged`   | public  | Invoked when the \`initialValue\` property changes. | `previous: string, next: string`            | `void`    |                |
| `requiredChanged`       | public  |                                                     |                                             | `void`    |                |
| `valueChanged`          | public  |                                                     | `previous: string, next: string`            | `void`    |                |
| `resetFormControl`      |         |                                                     |                                             | `void`    |                |
| `shouldFormValueUpdate` |         |                                                     |                                             | `boolean` |                |

#### Events

| Name     | Type | Description                                                                                                     | Inherited From |
| -------- | ---- | --------------------------------------------------------------------------------------------------------------- | -------------- |
| `change` |      | Emits a custom change event when the checked state changes {@inheritDoc @open-wc/form-control#FormControlMixin} |                |

#### Attributes

| Name              | Field            | Inherited From |
| ----------------- | ---------------- | -------------- |
| `checked`         | checkedAttribute |                |
| `current-checked` | currentChecked   |                |
|                   | disabled         |                |
| `value`           | initialValue     |                |
| `name`            | name             |                |
|                   | required         |                |

#### CSS Parts

| Name      | Description                                          |
| --------- | ---------------------------------------------------- |
| `control` | The element representing the visual checkbox control |
| `label`   | The label                                            |

#### Slots

| Name                      | Description                    |
| ------------------------- | ------------------------------ |
| `checked-indicator`       | The checked indicator          |
| `indeterminate-indicator` | The indeterminate indicator    |
|                           | The default slot for the label |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-checkbox)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/checkbox/checkbox.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#checkbox)
* [Open UI Analysis](https://open-ui.org/components/checkbox.research)
* [Open UI Proposal](https://open-ui.org/components/checkbox)