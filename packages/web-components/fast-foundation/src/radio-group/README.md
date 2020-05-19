---
id: fast-radio-group
title: fast-radio-group
sidebar_label: fast-radio-group
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/radio-group/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { RadioGroup, RadioGroupTemplate as template } from "@microsoft/fast-foundation";
import { RadioGroupStyles as styles } from "./radio-group.styles";

@customElement({
    name: "fast-radio-group",
    template,
    styles,
})
export class FASTRadioGroup extends RadioGroup {}
```