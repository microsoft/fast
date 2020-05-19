---
id: fast-card
title: fast-card
sidebar_label: fast-card
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/card/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Card, CardTemplate as template } from "@microsoft/fast-foundation";
import { CardStyles as styles } from "./card.styles";

@customElement({
    name: "fast-card",
    template,
    styles,
})
export class FASTCard extends Card {}
```