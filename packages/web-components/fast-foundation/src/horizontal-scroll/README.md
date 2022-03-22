---
id: horizontal-scroll
title: fast-horizontal-scroll
sidebar_label: horizontal-scroll
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/horizontal-scroll/README.md
---

An implementation of a content scroller as a web-component.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastHorizontalScroll,
    fastFlipper
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastHorizontalScroll(),
        fastFlipper()
    );
```

### Customizing Flippers

```ts
import { html } from "@microsoft/fast-element";
import {
    provideFASTDesignSystem,
    fastHorizontalScroll
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastHorizontalScroll({
            nextFlipper: html<HorizontalScroll>`
                <fast-flipper
                    @click="${x => x.scrollToNext()}"
                    aria-hidden="${x => x.flippersHiddenFromAT}"
                ></fast-flipper>
            `,
            previousFlipper: html<HorizontalScroll>`
                <fast-flipper
                    @click="${x => x.scrollToPrevious()}"
                    direction="previous"
                    aria-hidden="${x => x.flippersHiddenFromAT}"
                ></fast-flipper>
            `
        })
    );
```

## Usage

```html
<fast-horizontal-scroll>
    <fast-card>
        Card number 1
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 2
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 3
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 4
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 5
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 6
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 7
        <fast-button>A button</fast-button>
    </fast-card>
    <fast-card>
        Card number 8
        <fast-button>A button</fast-button>
    </fast-card>
</fast-horizontal-scroll>
```

## Create your own design

```ts
import { html } from "@microsoft/fast-element";
import {
    HorizontalScroll,
    HorizontalScrollOptions,
    horizontalScrollTemplate as template,
} from "@microsoft/fast-foundation";
import { horizontalScrollStyles as styles } from "./my-horizontal-scroll.styles";

export const myHorizontalScroll = HorizontalScroll.compose<HorizontalScrollOptions>({
    baseName: "horizontal-scroll",
    template,
    styles,
    nextFlipper: html`
        <fast-flipper
            @click="${x => x.scrollToNext()}"
            aria-hidden="${x => x.flippersHiddenFromAT}"
        ></fast-flipper>
    `,
    previousFlipper: html`
        <fast-flipper
            @click="${x => x.scrollToPrevious()}"
            direction="previous"
            aria-hidden="${x => x.flippersHiddenFromAT}"
        ></fast-flipper>
    `,
});
```