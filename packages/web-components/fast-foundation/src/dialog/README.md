---
id: fast-dialog
title: fast-dialog
sidebar_label: fast-dialog
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/dialog/README.md
---
A web component implementation of a [dialog](https://w3c.github.io/aria-practices/#dialog_modal) which can either be modal or non-modal.

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Dialog, DialogTemplate as template } from "@microsoft/fast-foundation";
import { DialogStyles as styles } from "./dialog.styles";

@customElement({
    name: "fast-dialog",
    template,
    styles,
})
export class FASTDialog extends Dialog {}
```

## Usage

```html live
<!-- TODO: Need to update this to render and dismiss on click -->
<fast-design-system-provider use-defaults>
    <fast-dialog id="simpleDialog" aria-label="Simple modal dialog" modal="true" hidden>
        <h2>Dialog with text and button.</h2>
        <fast-button>Button A</fast-button>
        <fast-button autofocus>Should autofocus</fast-button>
    </fast-dialog>
</fast-design-system-provider>
```