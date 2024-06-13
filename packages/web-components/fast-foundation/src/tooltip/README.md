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

| Name               | Description                             | Type                                                                                                                                                                                                                                                              |
| ------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TooltipPlacement` | Enumerates possible tooltip placements. | `{ bottom: "bottom", bottomEnd: "bottom-end", bottomStart: "bottom-start", left: "left", leftEnd: "left-end", leftStart: "left-start", right: "right", rightEnd: "right-end", rightStart: "right-start", top: "top", topEnd: "top-end", topStart: "top-start", }` |

<hr/>



### class: `FASTTooltip`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name        | Privacy | Type                   | Default | Description                                                  | Inherited From |
| ----------- | ------- | ---------------------- | ------- | ------------------------------------------------------------ | -------------- |
| `anchor`    | public  | `string`               |         | The id of the element the tooltip is anchored to.            |                |
| `cleanup`   | public  | `() => void`           |         | Cleanup function for the tooltip positioner.                 |                |
| `id`        | public  | `string`               |         | The tooltip ID attribute.                                    |                |
| `placement` | public  | `TooltipPlacement`     |         | The placement of the tooltip relative to the anchor element. |                |
| `show`      | public  | `boolean or undefined` |         | The visibility state of the tooltip.                         |                |
| `visible`   | public  | `boolean or undefined` |         | Returns the current visibility of the tooltip.               |                |

#### Methods

| Name             | Privacy | Description                | Parameters                                               | Return | Inherited From |
| ---------------- | ------- | -------------------------- | -------------------------------------------------------- | ------ | -------------- |
| `idChanged`      | public  |                            | `prev: string, next: string`                             | `void` |                |
| `showChanged`    | public  |                            | `prev: boolean or undefined, next: boolean or undefined` | `void` |                |
| `setPositioning` | public  | Sets the tooltip position. |                                                          | `void` |                |

#### Events

| Name      | Type | Description                                                                          | Inherited From |
| --------- | ---- | ------------------------------------------------------------------------------------ | -------------- |
| `dismiss` |      | Fires a custom 'dismiss' event when the tooltip is visible and escape key is pressed |                |

#### Attributes

| Name        | Field     | Inherited From |
| ----------- | --------- | -------------- |
| `anchor`    | anchor    |                |
| `id`        | id        |                |
| `placement` | placement |                |
| `show`      | show      |                |

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