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

| Name                     | Module                                    | Package |
| ------------------------ | ----------------------------------------- | ------- |
| `FormAssociatedCheckbox` | /src/checkbox/checkbox.form-associated.js |         |

#### Fields

| Name            | Privacy | Type      | Default | Description                                                                                                                                                                                 | Inherited From         |
| --------------- | ------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `readOnly`      | public  | `boolean` |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information. |                        |
| `indeterminate` | public  | `boolean` | `false` | The indeterminate state of the control                                                                                                                                                      |                        |
| `proxy`         |         |           |         |                                                                                                                                                                                             | FormAssociatedCheckbox |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From |
| ----------------- | --------- | ----------- | ---------- | ------ | -------------- |
| `readOnlyChanged` | protected |             |            | `void` |                |

#### Events

| Name     | Type | Description                                                | Inherited From |
| -------- | ---- | ---------------------------------------------------------- | -------------- |
| `change` |      | Emits a custom change event when the checked state changes |                |

#### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `readonly` | readOnly |                |

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