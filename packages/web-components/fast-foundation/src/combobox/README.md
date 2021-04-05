---
id: combobox
title: fast-combobox
sidebar_label: combobox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/combobox/README.md
---

## Usage

```html live
<fast-design-system-provider use-defaults>
  <fast-combobox id="shirt-size">
    <fast-option value="s">Small</fast-option>
    <fast-option value="m">Medium</fast-option>
    <fast-option value="l">Large</fast-option>
    <fast-option value="xl">Extra Large</fast-option>
  </fast-combobox>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Combobox, ComboboxTemplate as template } from "@microsoft/fast-foundation";
import { ComboboxStyles as styles } from "./combobox.styles";

@customElement({
    name: "fast-combobox",
    template,
    styles,
})
export class FASTCombobox extends Combobox {}
```
