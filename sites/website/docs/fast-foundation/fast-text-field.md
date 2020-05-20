---
id: fast-text-field
title: fast-text-field
sidebar_label: fast-text-field
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/text-field/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TextFieldTemplate as template, TextField } from "@microsoft/fast-foundation";
import { TextFieldStyles as styles } from "./text-field.styles";

@customElement({
    name: "fast-text-field",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextField extends TextField {}
```