---
id: radio
title: fast-radio
sidebar_label: radio
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/radio/README.md
description: fast-radio is an implementation of a radio as a form-connected web component.
---

An implementation of a [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) as a form-connected web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastRadio
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio()
    );
```

### Customizing the indicator

```ts
import {
    provideFASTDesignSystem,
    fastRadio
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRadio({
            checkedIndicator: `...your checked indicator...`
        })
    );
```

## Usage

```html live
<div role="radiogroup" aria-labelledby="fruit" name="favorite-fruit">
    <h3 id="fruit">Favorite fruit:</h3>
    <fast-radio value="apple">Apple</fast-radio>
    <fast-radio value="mango">Mango</fast-radio>
    <fast-radio value="orange">Orange</fast-radio>
</div>
 ```

:::note

For a more ergonomic usage of radios in groups, see [the `fast-radio-group` documentation](/docs/components/radio-group).

:::

## Create your own design

```ts
import {
    Radio,
    RadioOptions,
    radioTemplate as template,
} from "@microsoft/fast-foundation";
import { radioStyles as styles } from "./my-radio.styles";

export const myRadio = Radio.compose<RadioOptions>({
    baseName: "radio",
    template,
    styles,
    checkedIndicator: `...default checked indicator...`,
});
```

## API



### class: `FormAssociatedRadio`

#### Superclass

| Name     | Module                             | Package |
| -------- | ---------------------------------- | ------- |
| `_Radio` | src/radio/radio.form-associated.ts |         |

#### Mixins

| Name                      | Module                                  | Package |
| ------------------------- | --------------------------------------- | ------- |
| `CheckableFormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTRadio`

#### Superclass

| Name                  | Module                              | Package |
| --------------------- | ----------------------------------- | ------- |
| `FormAssociatedRadio` | /src/radio/radio.form-associated.js |         |

#### Fields

| Name       | Privacy | Type      | Default | Description                                                                                                                                                                                 | Inherited From      |
| ---------- | ------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `readOnly` | public  | `boolean` |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information. |                     |
| `name`     | public  | `string`  |         | The name of the radio. See [name attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname) for more info.                                              |                     |
| `proxy`    |         |           |         |                                                                                                                                                                                             | FormAssociatedRadio |

#### Methods

| Name              | Privacy   | Description                       | Parameters         | Return            | Inherited From |
| ----------------- | --------- | --------------------------------- | ------------------ | ----------------- | -------------- |
| `readOnlyChanged` | protected |                                   |                    | `void`            |                |
| `keypressHandler` | public    | Handles key presses on the radio. | `e: KeyboardEvent` | `boolean or void` |                |
| `clickHandler`    | public    | Handles clicks on the radio.      | `e: MouseEvent`    | `boolean or void` |                |

#### Events

| Name     | Type | Description                                                | Inherited From |
| -------- | ---- | ---------------------------------------------------------- | -------------- |
| `change` |      | Emits a custom change event when the checked state changes |                |

#### Attributes

| Name       | Field    | Inherited From |
| ---------- | -------- | -------------- |
| `readonly` | readOnly |                |

#### CSS Parts

| Name      | Description                                       |
| --------- | ------------------------------------------------- |
| `control` | The element representing the visual radio control |
| `label`   | The label                                         |

#### Slots

| Name                | Description                    |
| ------------------- | ------------------------------ |
| `checked-indicator` | The checked indicator          |
|                     | The default slot for the label |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-radio)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/radio/radio.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#radio)
* [Open UI Analysis](https://open-ui.org/components/radio-button.research)