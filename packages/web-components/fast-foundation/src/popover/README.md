---
id: popover
title: fast-popover
sidebar_label: popover
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/popover/README.md
---

The `fast-popover` component is a focusable floating container that shows over a pages content and displays UI related to what the user is doing. It can be used to reveal a secondary control or show more detail about an item.


## Usage

Note: In order to allow the Popover to properly scroll with the content of the page an ancestor of the Popover must have a non-static position applied so that the Popover is positioned properly relative to the page and that ancestor.

```html
<fast-design-system-provider use-defaults>
  <style>
    .container {
       position: relative;
    }
  </style>
  <div class="container">
    <fast-button id="mybutton">
       Click me for more info.
    </fast-button>
    <fast-popover target="mybutton" position="right">
      <fast-card>
        Popover Content or Action
      </fast-card>
      <fast-button>Close Button</fast-button>
    </fast-popover>
</fast-design-system-provider>
```
---

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Popover, PopoverTemplate as template } from "@microsoft/fast-foundation";
import { PopoverStyles as styles } from "./popover.styles";

@customElement({
    name: "fast-popover",
    template,
    styles,
})
export class FASTPopover extends Popover {}
```