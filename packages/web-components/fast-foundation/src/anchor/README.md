---
id: fast-anchor
title: fast-anchor
sidebar_label: fast-anchor
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/anchor/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-foundation";
import { MyAnchorStyles as styles } from "./anchor.styles";

@customElement({
    name: "fast-anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAnchor extends Anchor {}
```