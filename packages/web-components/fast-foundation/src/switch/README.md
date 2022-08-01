---
id: switch
title: fast-switch
sidebar_label: switch
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/switch/README.md
description: fast-switch is an implementation of a switch as a form-connected web component.
---

An implementation of a [switch](https://w3c.github.io/aria/#switch) as a form-connected web-component.

## Setup

### Basic setup

```ts
import {
    provideFASTDesignSystem,
    fastSwitch
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSwitch()
    );
```

### Customizing the Indicator

```ts
import {
    provideFASTDesignSystem,
    fastSwitch
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSwitch({
            switch: `...your switch indicator...`
        })
    );
```

## Usage

```html live
<fast-switch>
    Theme
    <span slot="checked-message">Dark</span>
    <span slot="unchecked-message">Light</span>
</fast-switch>
```

## Create your own design

```ts
import {
    Switch,
    SwitchOptions,
    switchTemplate as template,
} from "@microsoft/fast-foundation";
import { switchStyles as styles } from "./my-switch.styles";

export const mySwitch = Switch.compose<SwitchOptions>({
    baseName: "switch",
    template,
    styles,
    switch: `...default switch indicator...`,
});
```

## API



### class: `FormAssociatedSwitch`

#### Superclass

| Name      | Module                               | Package |
| --------- | ------------------------------------ | ------- |
| `_Switch` | src/switch/switch.form-associated.ts |         |

#### Mixins

| Name                      | Module                                  | Package |
| ------------------------- | --------------------------------------- | ------- |
| `CheckableFormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTSwitch`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedSwitch` | /src/switch/switch.form-associated.js |         |

#### Fields

| Name       | Privacy | Type      | Default | Description                                                                                                                                                                                 | Inherited From       |
| ---------- | ------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly` | public  | `boolean` |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information. |                      |
| `proxy`    |         |           |         |                                                                                                                                                                                             | FormAssociatedSwitch |

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

| Name                | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `label`             | The label                                                      |
| `switch`            | The element representing the switch, which wraps the indicator |
| `status-message`    | The wrapper for the status messages                            |
| `checked-message`   | The checked message                                            |
| `unchecked-message` | The unchecked message                                          |

#### Slots

| Name                | Description                            |
| ------------------- | -------------------------------------- |
|                     | The deafult slot for the label         |
| `checked-message`   | The message when in a checked state    |
| `unchecked-message` | The message when in an unchecked state |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-switch)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/switch/switch.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#switch)
* [Open UI Analysis](https://open-ui.org/components/switch)