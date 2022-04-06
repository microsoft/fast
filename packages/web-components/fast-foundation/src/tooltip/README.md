---
id: tooltip
title: fast-tooltip
sidebar_label: tooltip
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tooltip/README.md
---

The `fast-tooltip` component is used provide extra information about another element when it is hovered.

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



### class: `Tooltip`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name                     | Privacy | Type                                                                                                                                                                                                                                                                                                                             | Default | Description | Inherited From    |
| ------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- | ----------------- |
| `visible`                | public  | `boolean`                                                                                                                                                                                                                                                                                                                        |         |             |                   |
| `anchor`                 | public  | `string`                                                                                                                                                                                                                                                                                                                         |         |             |                   |
| `delay`                  | public  | `number`                                                                                                                                                                                                                                                                                                                         |         |             |                   |
| `position`               | public  | `or TooltipPosition         or "top"         or "right"         or "bottom"         or "left"         or "start"         or "end"         or "top-left"         or "top-right"         or "bottom-left"         or "bottom-right"         or "top-start"         or "top-end"         or "bottom-start"         or "bottom-end"` |         |             |                   |
| `autoUpdateMode`         | public  | `AutoUpdateMode`                                                                                                                                                                                                                                                                                                                 |         |             |                   |
| `horizontalViewportLock` | public  | `boolean`                                                                                                                                                                                                                                                                                                                        |         |             |                   |
| `verticalViewportLock`   | public  | `boolean`                                                                                                                                                                                                                                                                                                                        |         |             |                   |
| `anchorElement`          | public  | `HTMLElement or null`                                                                                                                                                                                                                                                                                                            |         |             |                   |
| `$presentation`          | public  | `ComponentPresentation or null`                                                                                                                                                                                                                                                                                                  |         |             | FoundationElement |
| `template`               | public  | `ElementViewTemplate or void or null`                                                                                                                                                                                                                                                                                            |         |             | FoundationElement |
| `styles`                 | public  | `ElementStyles or void or null`                                                                                                                                                                                                                                                                                                  |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

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

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-tooltip)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tooltip)
* [Open UI Analysis](https://open-ui.org/components/tooltip.research)