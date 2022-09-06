---
id: tooltip
title: fast-tooltip
sidebar_label: tooltip
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tooltip/README.md
description: fast-tooltop is a web component used to provide extra information about another element when it is hovered.
---

The `fast-tooltip` component is used to provide extra information about another element when it is hovered.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTooltip
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTooltip()
    );
```

## Usage

```html
<div>
    <fast-button id="anchor">Hover me</fast-button>
    <fast-tooltip anchor="anchor">Tooltip text</fast-tooltip>
</div>
```

## Create your own design

```ts
import { tooltipTemplate as template, Tooltip } from "@microsoft/fast-foundation";
import { tooltipStyles as styles } from "./my-tooltip.styles";

export const myTooltip = Tooltip.compose({
    baseName: "tooltip",
    template,
    styles,
});
```

## API



### Variables

| Name              | Description                           | Type                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TooltipPosition` | Enumerates possible tooltip positions | `{ top: "top", right: "right", bottom: "bottom", left: "left", center: "center", start: "start", end: "end", topLeft: "top-left", topCenter: "top-center", topRight: "top-right", bottomLeft: "bottom-left", bottomCenter: "bottom-center", bottomRight: "bottom-right", topStart: "top-start", topEnd: "top-end", bottomStart: "bottom-start", bottomEnd: "bottom-end", }` |

<hr/>



### class: `FASTTooltip`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                     | Privacy | Type                  | Default    | Description                                                                                                                                                                                                      | Inherited From |
| ------------------------ | ------- | --------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `visible`                | public  | `boolean`             |            | Whether the tooltip is visible or not. If undefined tooltip is shown when anchor element is hovered                                                                                                              |                |
| `anchor`                 | public  | `string`              | `""`       | The id of the element the tooltip is anchored to                                                                                                                                                                 |                |
| `delay`                  | public  | `number`              | `300`      | The delay in milliseconds before a tooltip is shown after a hover event                                                                                                                                          |                |
| `position`               | public  | `TooltipPosition`     |            | Controls the placement of the tooltip relative to the anchor. When the position is undefined the tooltip is placed above or below the anchor based on available space.                                           |                |
| `autoUpdateMode`         | public  | `AutoUpdateMode`      | `"anchor"` | Controls when the tooltip updates its position, default is 'anchor' which only updates when the anchor is resized.  'auto' will update on scroll/resize events. Corresponds to anchored-region auto-update-mode. |                |
| `horizontalViewportLock` | public  | `boolean`             |            | Controls if the tooltip will always remain fully in the viewport on the horizontal axis                                                                                                                          |                |
| `verticalViewportLock`   | public  | `boolean`             |            | Controls if the tooltip will always remain fully in the viewport on the vertical axis                                                                                                                            |                |
| `anchorElement`          | public  | `HTMLElement or null` | `null`     | the html element currently being used as anchor. Setting this directly overrides the anchor attribute.                                                                                                           |                |

#### Methods

| Name                     | Privacy   | Description | Parameters                      | Return | Inherited From |
| ------------------------ | --------- | ----------- | ------------------------------- | ------ | -------------- |
| `visibleChanged`         | protected |             |                                 | `void` |                |
| `anchorChanged`          | protected |             |                                 | `void` |                |
| `anchorElementChanged`   | protected |             | `oldValue: HTMLElement or null` | `void` |                |
| `viewportElementChanged` | protected |             |                                 | `void` |                |

#### Events

| Name      | Type | Description                                                                          | Inherited From |
| --------- | ---- | ------------------------------------------------------------------------------------ | -------------- |
| `dismiss` |      | Fires a custom 'dismiss' event when the tooltip is visible and escape key is pressed |                |

#### Attributes

| Name                       | Field                  | Inherited From |
| -------------------------- | ---------------------- | -------------- |
|                            | visible                |                |
| `anchor`                   | anchor                 |                |
| `delay`                    | delay                  |                |
| `position`                 | position               |                |
| `auto-update-mode`         | autoUpdateMode         |                |
| `horizontal-viewport-lock` | horizontalViewportLock |                |
| `vertical-viewport-lock`   | verticalViewportLock   |                |

#### CSS Parts

| Name      | Description         |
| --------- | ------------------- |
| `control` | The tooltip element |

#### Slots

| Name | Description                              |
| ---- | ---------------------------------------- |
|      | The default slot for the tooltip content |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-tooltip)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tooltip)
* [Open UI Analysis](https://open-ui.org/components/tooltip.research)