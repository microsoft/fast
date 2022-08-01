---
id: horizontal-scroll
title: fast-horizontal-scroll
sidebar_label: horizontal-scroll
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/horizontal-scroll/README.md
description: fast-horizontal-scroll is a web component implementation of a content scroller.
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



### class: `FASTHorizontalScroll`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                       | Privacy | Type                   | Default         | Description                                                                               | Inherited From |
| -------------------------- | ------- | ---------------------- | --------------- | ----------------------------------------------------------------------------------------- | -------------- |
| `scrollContainer`          | public  | `HTMLDivElement`       |                 | Reference to DOM element that scrolls the content                                         |                |
| `content`                  | public  | `HTMLDivElement`       |                 | Reference to DOM element that holds the slotted content                                   |                |
| `previousFlipperContainer` | public  | `HTMLDivElement`       |                 | Reference to flipper to scroll to previous content                                        |                |
| `nextFlipperContainer`     | public  | `HTMLDivElement`       |                 | Reference to flipper to scroll to the next content                                        |                |
| `speed`                    | public  | `number`               | `600`           | Speed of scroll in pixels per second                                                      |                |
| `duration`                 | public  | `string`               |                 | The CSS time value for the scroll transition duration. Overrides the \`speed\` attribute. |                |
| `easing`                   | public  | `ScrollEasing`         | `"ease-in-out"` | Attribute used for easing, defaults to ease-in-out                                        |                |
| `flippersHiddenFromAT`     | public  | `boolean`              | `false`         | Attribute to hide flippers from assistive technology                                      |                |
| `scrollItems`              | public  | `HTMLElement[]`        |                 | The default slotted items placed in the scrolling container.                              |                |
| `view`                     | public  | `HorizontalScrollView` |                 | View: default or mobile                                                                   |                |

#### Methods

| Name                 | Privacy | Description                                                      | Parameters                                                           | Return | Inherited From |
| -------------------- | ------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- | ------ | -------------- |
| `scrollItemsChanged` | public  | Updates scroll stops and flippers when scroll items change       | `previous: HTMLElement[], next: HTMLElement[]`                       |        |                |
| `scrollInView`       | public  | Function that can scroll an item into view.                      | `item: HTMLElement or number, padding: number, rightPadding: number` | `void` |                |
| `keyupHandler`       | public  | Lets the user arrow left and right through the horizontal scroll | `e: Event & KeyboardEvent`                                           |        |                |
| `scrollToPrevious`   | public  | Scrolls items to the left                                        |                                                                      | `void` |                |
| `scrollToNext`       | public  | Scrolls items to the right                                       |                                                                      | `void` |                |
| `scrollToPosition`   | public  | Handles scrolling with easing                                    | `newPosition: number, position: number`                              | `void` |                |
| `resized`            | public  | Monitors resize event on the horizontal-scroll element           |                                                                      | `void` |                |
| `scrolled`           | public  | Monitors scrolled event on the content container                 |                                                                      | `void` |                |

#### Events

| Name          | Type | Description                                           | Inherited From |
| ------------- | ---- | ----------------------------------------------------- | -------------- |
| `scrollstart` |      | Fires a custom 'scrollstart' event when scrolling     |                |
| `scrollend`   |      | Fires a custom 'scrollend' event when scrolling stops |                |

#### Attributes

| Name                      | Field                | Inherited From |
| ------------------------- | -------------------- | -------------- |
|                           | speed                |                |
| `duration`                | duration             |                |
| `easing`                  | easing               |                |
| `flippers-hidden-from-at` | flippersHiddenFromAT |                |
| `view`                    | view                 |                |

#### CSS Parts

| Name                     | Description                               |
| ------------------------ | ----------------------------------------- |
| `scroll-area`            | Wraps the entire scrollable region        |
| `scroll-view`            | The visible scroll area                   |
| `content-container`      | The container for the content             |
| `scroll-prev`            | The previous flipper container            |
| `scroll-action-previous` | The element wrapping the previous flipper |
| `scroll-next`            | The next flipper container                |
| `scroll-action-next`     | The element wrapping the next flipper     |

#### Slots

| Name    | Description                                          |
| ------- | ---------------------------------------------------- |
| `start` | Content which can be provided before the scroll area |
| `end`   | Content which can be provided after the scroll area  |

<hr/>


