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

## API



### class: `HorizontalScroll`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name                       | Privacy | Type                                  | Default | Description | Inherited From    |
| -------------------------- | ------- | ------------------------------------- | ------- | ----------- | ----------------- |
| `scrollContainer`          | public  | `HTMLDivElement`                      |         |             |                   |
| `content`                  | public  | `HTMLDivElement`                      |         |             |                   |
| `previousFlipperContainer` | public  | `HTMLDivElement`                      |         |             |                   |
| `nextFlipperContainer`     | public  | `HTMLDivElement`                      |         |             |                   |
| `speed`                    | public  | `number`                              |         |             |                   |
| `duration`                 | public  | `string`                              |         |             |                   |
| `easing`                   | public  | `ScrollEasing`                        |         |             |                   |
| `flippersHiddenFromAT`     | public  | `boolean`                             |         |             |                   |
| `scrollItems`              | public  | `HTMLElement[]`                       |         |             |                   |
| `view`                     | public  | `HorizontalScrollView`                |         |             |                   |
| `$presentation`            | public  | `ComponentPresentation or null`       |         |             | FoundationElement |
| `template`                 | public  | `ElementViewTemplate or void or null` |         |             | FoundationElement |
| `styles`                   | public  | `ElementStyles or void or null`       |         |             | FoundationElement |

#### Methods

| Name                 | Privacy   | Description | Parameters                                     | Return | Inherited From    |
| -------------------- | --------- | ----------- | ---------------------------------------------- | ------ | ----------------- |
| `scrollItemsChanged` | public    |             | `previous: HTMLElement[], next: HTMLElement[]` |        |                   |
| `keyupHandler`       | public    |             | `e: Event & KeyboardEvent`                     |        |                   |
| `scrollToPrevious`   | public    |             |                                                | `void` |                   |
| `scrollToNext`       | public    |             |                                                | `void` |                   |
| `scrollToPosition`   | public    |             | `newPosition: number, position: number`        | `void` |                   |
| `resized`            | public    |             |                                                | `void` |                   |
| `scrolled`           | public    |             |                                                | `void` |                   |
| `templateChanged`    | protected |             |                                                | `void` | FoundationElement |
| `stylesChanged`      | protected |             |                                                | `void` | FoundationElement |

#### Attributes

| Name                      | Field                | Inherited From |
| ------------------------- | -------------------- | -------------- |
|                           | speed                |                |
| `duration`                | duration             |                |
| `easing`                  | easing               |                |
| `flippers-hidden-from-at` | flippersHiddenFromAT |                |
| `view`                    | view                 |                |

<hr/>


