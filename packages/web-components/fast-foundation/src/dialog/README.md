---
id: dialog
title: fast-dialog
sidebar_label: dialog
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/dialog/README.md
---

A web component implementation of a [dialog](https://w3c.github.io/aria-practices/#dialog_modal) which can either be modal or non-modal.

## Usage

```html live
<div>
<fast-design-system-provider use-defaults>
    <fast-button appearance="accent" onclick="document.getElementById('example1').toggleAttribute('hidden');">Open Dialog</fast-button>
    <fast-dialog id="example1" class="example-dialog" aria-label="Simple modal dialog" modal="true" hidden>
        <h2>Dialog</h2>
        <p>This is an example dialog. Click the button below to close</p>
        <fast-button autofocus onclick="document.getElementById('example1').toggleAttribute('hidden');">Close Dialog</fast-button>
    </fast-dialog>
</fast-design-system-provider>
</div>
```

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