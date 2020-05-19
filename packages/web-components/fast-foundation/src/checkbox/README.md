---
id: fast-checkbox
title: fast-checkbox
sidebar_label: fast-checkbox
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/checkbox/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Checkbox, CheckboxTemplate as template } from "@microsoft/fast-foundation";
import { CheckboxStyles as styles } from "./checkbox.styles";

@customElement({
    name: "fast-checkbox",
    template,
    styles,
})
export class FASTCheckbox extends Checkbox {}
```