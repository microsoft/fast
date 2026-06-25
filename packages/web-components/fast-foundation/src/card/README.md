---
id: card
title: fast-card
sidebar_label: card
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/card/README.md
description: fast-card is a web component visual container without semantics that takes children.
---

The `fast-card` component is a visual container without semantics that takes children. Cards are snapshots of content that are typically used in a group to present collections of related information.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastCard
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastCard()
    );
```

## Usage

```html live
<fast-card>
    <h3>Card title</h3>
    <p>At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a tortor. Felis orci tellus netus risus et ultricies augue aliquet.</p>
    <fast-button>Learn more</fast-button>
</fast-card>
```

## Create your own design

```ts
import {
    Card,
    cardTemplate as template,
} from "@microsoft/fast-foundation";
import { cardStyles as styles } from "./my-card.styles";

export const myCard = Card.compose({
    baseName: "card",
    template,
    styles,
});
```

## API



### class: `FASTCard`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Slots

| Name | Description                           |
| ---- | ------------------------------------- |
|      | The default slot for the card content |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-card)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/card/card.spec.md)
* [Open UI Analysis](https://open-ui.org/components/card.research)