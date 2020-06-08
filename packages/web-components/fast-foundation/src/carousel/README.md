---
id: fast-carousel
title: fast-carousel
sidebar_label: fast-carousel
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/carousel/README.md
---
A web component implementation of a [carousel](https://w3c.github.io/aria-practices/#carousel).
Note: To implement the *Tabbed* pattern Carousel `<fast-tab>` and `<fast-tab-panel>` must be used for the pattern to work properly.

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
<h3>Tabbed</h3>
<fast-carousel>
    <fast-tab></fast-tab>
    <fast-tab></fast-tab>
    <fast-tab></fast-tab>
    <fast-tab-panel>
        <span class="outer-span">
            <span class="inner-span">
                <slot></slot>
            </span>
            <img src="https://placehold.it/1300x600/" alt="Place Holder Image"/>
        </span>
    </fast-tab-panel>
    <fast-tab-panel>
        <img src="https://placehold.it/1300x600/3E3E3E/171717" alt="Place Holder Image"/>
    </fast-tab-panel>
    <fast-tab-panel>
        <img src="https://placehold.it/1300x600/" alt="Place Holder Image"/>
    </fast-tab-panel>
</fast-carousel>

<h3>Basic</h3>
<fast-carousel pattern="basic" autoplay-interval="3000">
    <span class="outer-span">
        <span class="inner-span">
            <slot></slot>
        </span>
        <img src="https://placehold.it/1300x600/" alt="Place Holder Image"/>
    </span>
    <img src="https://placehold.it/1300x600/3E3E3E/171717" alt="Place Holder Image"/>
    <img src="https://placehold.it/1300x600/" alt="Place Holder Image"/>
</fast-carousel>
```