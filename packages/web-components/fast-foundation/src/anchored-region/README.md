---
id: anchored-region
title: fast-anchored-region
sidebar_label: anchored-region
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/anchored-region/README.md
---

An *anchored region* is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative to another "anchor" element.  Additionally, the *anchored region* can react to the available space between the anchor and a parent ["viewport"](https://developer.mozilla.org/en-US/docs/Glossary/viewport) element such that the region is placed on the side of the anchor with the most available space, or even resize itself based on that space.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastAnchoredRegion
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastAnchoredRegion()
    );
```

## Usage

A region that always renders above the anchor element.

```html live
<div id="viewport">
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="locktodefault"
        vertical-default-position="top">
      This shows up above the button
    </fast-anchored-region>
</div>
```

## Create your own design

```ts
import {
    AnchoredRegion,
    anchoredRegionTemplate as template,
} from "@microsoft/fast-foundation";
import { anchoredRegionStyles as styles } from "./my-anchored-region.styles";

export const myAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template,
    styles,
});
```

## API



### Variables

| Name                   | Description | Type                   |
| ---------------------- | ----------- | ---------------------- |
| `FlyoutPosTop`         |             | `AnchoredRegionConfig` |
| `FlyoutPosBottom`      |             | `AnchoredRegionConfig` |
| `FlyoutPosTallest`     |             | `AnchoredRegionConfig` |
| `FlyoutPosTopFill`     |             | `AnchoredRegionConfig` |
| `FlyoutPosBottomFill`  |             | `AnchoredRegionConfig` |
| `FlyoutPosTallestFill` |             | `AnchoredRegionConfig` |

<hr/>



### class: `AnchoredRegion`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name                        | Privacy | Type                                       | Default | Description | Inherited From    |
| --------------------------- | ------- | ------------------------------------------ | ------- | ----------- | ----------------- |
| `anchor`                    | public  | `string`                                   |         |             |                   |
| `viewport`                  | public  | `string`                                   |         |             |                   |
| `horizontalPositioningMode` | public  | `AxisPositioningMode`                      |         |             |                   |
| `horizontalDefaultPosition` | public  | `HorizontalPosition`                       |         |             |                   |
| `horizontalViewportLock`    | public  | `boolean`                                  |         |             |                   |
| `horizontalInset`           | public  | `boolean`                                  |         |             |                   |
| `horizontalThreshold`       | public  | `number`                                   |         |             |                   |
| `horizontalScaling`         | public  | `AxisScalingMode`                          |         |             |                   |
| `verticalPositioningMode`   | public  | `AxisPositioningMode`                      |         |             |                   |
| `verticalDefaultPosition`   | public  | `VerticalPosition`                         |         |             |                   |
| `verticalViewportLock`      | public  | `boolean`                                  |         |             |                   |
| `verticalInset`             | public  | `boolean`                                  |         |             |                   |
| `verticalThreshold`         | public  | `number`                                   |         |             |                   |
| `verticalScaling`           | public  | `AxisScalingMode`                          |         |             |                   |
| `fixedPlacement`            | public  | `boolean`                                  |         |             |                   |
| `autoUpdateMode`            | public  | `AutoUpdateMode`                           |         |             |                   |
| `anchorElement`             | public  | `HTMLElement or null`                      |         |             |                   |
| `viewportElement`           | public  | `HTMLElement or null`                      |         |             |                   |
| `verticalPosition`          | public  | `AnchoredRegionPositionLabel or undefined` |         |             |                   |
| `horizontalPosition`        | public  | `AnchoredRegionPositionLabel or undefined` |         |             |                   |
| `update`                    | public  |                                            |         |             |                   |
| `$presentation`             | public  | `ComponentPresentation or null`            |         |             | FoundationElement |
| `template`                  | public  | `ElementViewTemplate or void or null`      |         |             | FoundationElement |
| `styles`                    | public  | `ElementStyles or void or null`            |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name                          | Field                     | Inherited From |
| ----------------------------- | ------------------------- | -------------- |
| `anchor`                      | anchor                    |                |
| `viewport`                    | viewport                  |                |
| `horizontal-positioning-mode` | horizontalPositioningMode |                |
| `horizontal-default-position` | horizontalDefaultPosition |                |
| `horizontal-viewport-lock`    | horizontalViewportLock    |                |
| `horizontal-inset`            | horizontalInset           |                |
| `horizontal-threshold`        | horizontalThreshold       |                |
| `horizontal-scaling`          | horizontalScaling         |                |
| `vertical-positioning-mode`   | verticalPositioningMode   |                |
| `vertical-default-position`   | verticalDefaultPosition   |                |
| `vertical-viewport-lock`      | verticalViewportLock      |                |
| `vertical-inset`              | verticalInset             |                |
| `vertical-threshold`          | verticalThreshold         |                |
| `vertical-scaling`            | verticalScaling           |                |
| `fixed-placement`             | fixedPlacement            |                |
| `auto-update-mode`            | autoUpdateMode            |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-anchored-region)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/anchored-region/anchored-region.spec.md)