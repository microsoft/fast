---
id: fast-carousel
title: fast-carousel
sidebar_label: fast-carousel
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/carousel/README.md
---
A web component implementation of a [carousel](https://w3c.github.io/aria-practices/#carousel).

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Carousel, CarouselTemplate as template } from "@microsoft/fast-foundation";
import { CarouselStyles as styles } from "./carousel.styles";

@customElement({
    name: "fast-carousel",
    template,
    styles,
})
export class FASTCarousel extends carousel {}
```

## Usage

```html
<fast-carousel id="simpleCarousel" aria-label="Simple modal carousel" modal="true">
    <h2>carousel with text and button.</h2>
    <fast-button>Button A</fast-button>
    <fast-button autofocus>Should autofocus</fast-button>
</fast-carousel>
```