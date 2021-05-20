---
id: toolbar
title: fast-toolbar
sidebar_label: toolbar
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/toolbar/README.md
---

An implementation of a [toolbar](https://w3c.github.io/aria-practices/#toolbar).

## Usage

```html live
<fast-design-system-provider use-defaults>
    <label id="toolbar-label">Preset selected-value</label>
    <fast-toolbar aria-labelledby="toolbar-label">
    </fast-toolbar>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Tooolbar, ToolbarTemplate } from "@microsoft/fast-foundation";
import { ToolbarStyles } from "./toolbar.styles";

@customElement({
    name: "fast-toolbar",
    template: ToolbarTemplate,
    styles: ToolbarStyles,
})
export class FASTToolbar extends Toolbar {}
```
