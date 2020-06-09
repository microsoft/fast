---
id: fast-card
title: fast-card
sidebar_label: fast-card
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/card/README.md
---

The `fast-card` component is a visual container without semantics that takes children. Cards are snapshots of content that are typically used in a group to present collections of related information.

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

## Usage

```html live
<style>
    fast-card {
        --card-height: 300px;
        --card-width: 350px;
    }
</style>
<fast-design-system-provider use-defaults>
    <fast-card>
        <img src="https://placehold.it/300x150" alt="Placeholder image with watermark" />
        <h3>Card title</h3>
        <p>At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a tortor. Felis orci tellus netus risus et ultricies augue aliquet.</p>
        <fast-button>Learn more</fast-button>
    </fast-card>
</fast-design-system-provider>
```