---
id: select
title: fast-select
sidebar_label: select
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/select/README.md
---

An implementation of an [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) as a form-connected web-component.

## Usage

```html live
<fast-design-system-provider use-defaults>
  <fast-select id="shirt-size">
    <fast-option value="s">Small</fast-option>
    <fast-option value="m">Medium</fast-option>
    <fast-option value="l">Large</fast-option>
    <fast-option value="xl">Extra Large</fast-option>
  </fast-select>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Select, SelectTemplate as template } from "@microsoft/fast-foundation";
import { SelectStyles as styles } from "./select.styles";

@customElement({
    name: "fast-select",
    template,
    styles,
})
export class FASTSelect extends Select {}
```
