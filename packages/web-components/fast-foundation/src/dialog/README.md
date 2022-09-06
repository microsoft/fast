---
id: dialog
title: fast-dialog
sidebar_label: dialog
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/dialog/README.md
description: fast-dialog is a web component implementation of a dialog.
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#dialog_modal):

> A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.
>
> Like non-modal dialogs, modal dialogs contain their tab sequence. That is, Tab and Shift + Tab do not move focus outside the dialog. However, unlike most non-modal dialogs, modal dialogs do not provide means for moving keyboard focus outside the dialog window without closing the dialog.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastDialog
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastDialog()
    );
```

## Usage

```html
<fast-dialog id="example1" class="example-dialog" aria-label="Simple modal dialog" modal="true" hidden>
    <h2>Dialog</h2>
    <p>This is an example dialog.</p>
    <fast-button>Close Dialog</fast-button>
</fast-dialog>
```

## Create your own design

```ts
import { Dialog, dialogTemplate as template } from "@microsoft/fast-foundation";
import { dialogStyles as styles } from "./my-dialog.styles";

export const myDialog = Dialog.compose({
    baseName: "dialog",
    template,
    styles,
});
```

## API



### class: `FASTDialog`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name              | Privacy | Type      | Default | Description                                                                                                                                                                                                   | Inherited From |
| ----------------- | ------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `modal`           | public  | `boolean` | `false` | Indicates the element is modal. When modal, user mouse interaction will be limited to the contents of the element by a modal overlay.  Clicks on the overlay will cause the dialog to emit a "dismiss" event. |                |
| `hidden`          | public  | `boolean` | `false` | The hidden state of the element.                                                                                                                                                                              |                |
| `noFocusTrap`     | public  | `boolean` | `false` | Indicates that the dialog should not trap focus.                                                                                                                                                              |                |
| `ariaDescribedby` | public  | `string`  |         | The id of the element describing the dialog.                                                                                                                                                                  |                |
| `ariaLabelledby`  | public  | `string`  |         | The id of the element labeling the dialog.                                                                                                                                                                    |                |
| `ariaLabel`       | public  | `string`  |         | The label surfaced to assistive technologies.                                                                                                                                                                 |                |

#### Methods

| Name   | Privacy | Description                    | Parameters | Return | Inherited From |
| ------ | ------- | ------------------------------ | ---------- | ------ | -------------- |
| `show` | public  | The method to show the dialog. |            | `void` |                |
| `hide` | public  | The method to hide the dialog. |            | `void` |                |

#### Events

| Name     | Type | Description                                                     | Inherited From |
| -------- | ---- | --------------------------------------------------------------- | -------------- |
| `cancel` |      | Fires a custom 'cancel' event when the modal overlay is clicked |                |
| `close`  |      | Fires a custom 'close' event when the dialog is hidden          |                |

#### Attributes

| Name               | Field           | Inherited From |
| ------------------ | --------------- | -------------- |
|                    | modal           |                |
|                    | hidden          |                |
| `no-focus-trap`    | noFocusTrap     |                |
| `aria-describedby` | ariaDescribedby |                |
| `aria-labelledby`  | ariaLabelledby  |                |
| `aria-label`       | ariaLabel       |                |

#### CSS Parts

| Name      | Description              |
| --------- | ------------------------ |
| `overlay` | The modal dialog overlay |
| `control` | The dialog element       |

#### Slots

| Name | Description                             |
| ---- | --------------------------------------- |
|      | The default slot for the dialog content |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-dialog)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/dialog/dialog.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#dialog_modal)
* [Open UI Analysis](https://open-ui.org/components/dialog.research)