---
id: fast-badge
title: fast-badge
sidebar_label: fast-badge
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/badge/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Badge, BadgeTemplate as template } from "@microsoft/fast-foundation";
import { BadgeStyles as styles } from "./badge.styles";

@customElement({
    name: "fast-badge",
    template,
    styles,
})
export class FASTBadge extends Badge {}
```