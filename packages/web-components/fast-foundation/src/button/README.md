---
id: button
title: fast-button
sidebar_label: button
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/button/README.md
description: fast-button is a web component implementation of a button element.
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#button):

> A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.

`fast-button` is a web component implementation of an [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). The `fast-components` button supports several visual appearances (accent, lightweight, neutral, outline, stealth).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastButton
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton()
    );
```

## Usage

```html live
<fast-button appearance="primary">Submit</fast-button>
```

## Create your own design

```ts
import {
    Button,
    buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { buttonStyles as styles } from "./my-button.styles";

export const myButton = Button.compose({
    baseName: "button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the button element rendered into the shadow DOM.
:::

## API



### class: `FormAssociatedButton`

#### Superclass

| Name      | Module                               | Package |
| --------- | ------------------------------------ | ------- |
| `_Button` | src/button/button.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTButton`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedButton` | /src/button/button.form-associated.js |         |

#### Fields

| Name                    | Privacy | Type                                         | Default | Description                                                                                                                   | Inherited From       |
| ----------------------- | ------- | -------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `autofocus`             | public  | `boolean`                                    |         | Determines if the element should receive document focus on page load.                                                         |                      |
| `formId`                | public  | `string`                                     |         | The id of a form to associate the element to.                                                                                 |                      |
| `formaction`            | public  | `string`                                     |         | See [`<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) for more details. |                      |
| `formenctype`           | public  | `string`                                     |         | See [`<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) for more details. |                      |
| `formmethod`            | public  | `string`                                     |         | See [`<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) for more details. |                      |
| `formnovalidate`        | public  | `boolean`                                    |         | See [`<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) for more details. |                      |
| `formtarget`            | public  | `"_self" or "_blank" or "_parent" or "_top"` |         | See [`<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) for more details. |                      |
| `type`                  | public  | `"submit" or "reset" or "button"`            |         | The button type.                                                                                                              |                      |
| `defaultSlottedContent` | public  | `HTMLElement[]`                              |         |  Default slotted content                                                                                                      |                      |
| `control`               | public  | `HTMLButtonElement`                          |         |                                                                                                                               |                      |
| `proxy`                 |         |                                              |         |                                                                                                                               | FormAssociatedButton |

#### Methods

| Name                    | Privacy   | Description | Parameters                                                                                 | Return | Inherited From |
| ----------------------- | --------- | ----------- | ------------------------------------------------------------------------------------------ | ------ | -------------- |
| `formactionChanged`     | protected |             |                                                                                            | `void` |                |
| `formenctypeChanged`    | protected |             |                                                                                            | `void` |                |
| `formmethodChanged`     | protected |             |                                                                                            | `void` |                |
| `formnovalidateChanged` | protected |             |                                                                                            | `void` |                |
| `formtargetChanged`     | protected |             |                                                                                            | `void` |                |
| `typeChanged`           | protected |             | `previous: "submit" or "reset" or "button" or void, next: "submit" or "reset" or "button"` | `void` |                |

#### Attributes

| Name          | Field          | Inherited From |
| ------------- | -------------- | -------------- |
|               | autofocus      |                |
| `form`        | formId         |                |
| `formaction`  | formaction     |                |
| `formenctype` | formenctype    |                |
| `formmethod`  | formmethod     |                |
|               | formnovalidate |                |
| `formtarget`  | formtarget     |                |
| `type`        | type           |                |

#### CSS Parts

| Name      | Description                         |
| --------- | ----------------------------------- |
| `control` | The button element                  |
| `content` | The element wrapping button content |

#### Slots

| Name    | Description                                             |
| ------- | ------------------------------------------------------- |
| `start` | Content which can be provided before the button content |
| `end`   | Content which can be provided after the button content  |
|         | The default slot for button content                     |

<hr/>

### class: `DelegatesARIAButton`

#### Fields

| Name           | Privacy | Type                                             | Default | Description                                                            | Inherited From |
| -------------- | ------- | ------------------------------------------------ | ------- | ---------------------------------------------------------------------- | -------------- |
| `ariaExpanded` | public  | `"true" or "false" or string or null`            |         | See https://www.w3.org/WAI/PF/aria/roles#button for more information |                |
| `ariaPressed`  | public  | `"true" or "false" or "mixed" or string or null` |         | See https://www.w3.org/WAI/PF/aria/roles#button for more information |                |

#### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `aria-expanded` | ariaExpanded |                |
| `aria-pressed`  | ariaPressed  |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-button)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/button/button.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#button)
* [Open UI Analysis](https://open-ui.org/components/button)