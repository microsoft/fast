---
id: fast-text-area
title: fast-text-area
sidebar_label: fast-text-area
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/text-area/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TextAreaTemplate as template, TextArea } from "@microsoft/fast-foundation";
import { TextAreaStyles as styles } from "./text-area.styles";

@customElement({
    name: "fast-text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextArea extends TextArea {}
```