---
id: combobox
title: fast-combobox
sidebar_label: combobox
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/combobox/README.md
---

## Usage

```html live
<fast-design-system-provider use-defaults>
  <fast-combobox id="combobox-with-both-autocomplete" autocomplete="both">
    <fast-option>Christopher Eccleston</fast-option>
    <fast-option>David Tenant</fast-option>
    <fast-option>Matt Smith</fast-option>
    <fast-option>Peter Capaldi</fast-option>
    <fast-option>Jodie Whittaker</fast-option>
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
