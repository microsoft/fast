---
id: anchored-region
title: fast-anchored-region
sidebar_label: anchored-region
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/anchored-region/README.md
description: fast-anchored-region is a container web component in which the contents of the anchored region can be positioned relative to another "anchor" element.
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

| Name                   | Description                                                                                                                                                 | Type                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `FlyoutPosTop`         | A region that always places itself above the anchor, has a width to match the anchor, and is sized vertically by content                                    | `AnchoredRegionConfig` |
| `FlyoutPosBottom`      | A region that always places itself below the anchor, has a width to match the anchor, and is sized vertically by content                                    | `AnchoredRegionConfig` |
| `FlyoutPosTallest`     | A region that places itself above or below the anchor based on available space, has a width to match the anchor, and is sized vertically by content         | `AnchoredRegionConfig` |
| `FlyoutPosTopFill`     | A region that always places itself above the anchor, has a width to match the anchor, and is sized vertically by available space                            | `AnchoredRegionConfig` |
| `FlyoutPosBottomFill`  | A region that always places itself below the anchor, has a width to match the anchor, and is sized vertically by available space                            | `AnchoredRegionConfig` |
| `FlyoutPosTallestFill` | A region that places itself above or below the anchor based on available space, has a width to match the anchor, and is sized vertically by available space | `AnchoredRegionConfig` |

<hr/>



### Variables

| Name                          | Description                                                                                                                                                                                                                                                                                                                                                          | Type                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `AxisPositioningMode`         | Values to define the base behavior of an anchored region on a particular axis                                                                                                                                                                                                                                                                                        | `{ uncontrolled: "uncontrolled", locktodefault: "locktodefault", dynamic: "dynamic", }`             |
| `AxisScalingMode`             | Values to define the scaling behavior of an anchored region on a particular axis                                                                                                                                                                                                                                                                                     | `{ anchor: "anchor", content: "content", fill: "fill", }`                                           |
| `HorizontalPosition`          | Values for the horizontal positioning options for an anchored region                                                                                                                                                                                                                                                                                                 | `{ start: "start", end: "end", left: "left", right: "right", center: "center", unset: "unset", }`   |
| `VerticalPosition`            | Values for the vertical positioning options for an anchored region                                                                                                                                                                                                                                                                                                   | `{ top: "top", bottom: "bottom", center: "center", unset: "unset", }`                               |
| `AutoUpdateMode`              | Defines if the component updates its position automatically. Calling update() always provokes an update. anchor - the component only updates its position when the anchor resizes (default) auto - the component updates its position when: - update() is called - the anchor resizes - the window resizes - the viewport resizes - any scroll event in the document | `{ anchor: "anchor", auto: "auto", }`                                                               |
| `AnchoredRegionPositionLabel` | Values to describe the possible positions of the region relative to its anchor. Depending on the axis start = left/top, end = right/bottom                                                                                                                                                                                                                           | `{ start: "start", insetStart: "insetStart", insetEnd: "insetEnd", end: "end", center: "center", }` |

<hr/>



### class: `FASTAnchoredRegion`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                        | Privacy | Type                                       | Default          | Description                                                                                                                                                                                                                             | Inherited From |
| --------------------------- | ------- | ------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `anchor`                    | public  | `string`                                   | `""`             | The HTML ID of the anchor element this region is positioned relative to                                                                                                                                                                 |                |
| `viewport`                  | public  | `string`                                   | `""`             | The HTML ID of the viewport element this region is positioned relative to                                                                                                                                                               |                |
| `horizontalPositioningMode` | public  | `AxisPositioningMode`                      | `"uncontrolled"` | Sets what logic the component uses to determine horizontal placement. 'locktodefault' forces the default position 'dynamic' decides placement based on available space 'uncontrolled' does not control placement on the horizontal axis |                |
| `horizontalDefaultPosition` | public  | `HorizontalPosition`                       | `"unset"`        | The default horizontal position of the region relative to the anchor element                                                                                                                                                            |                |
| `horizontalViewportLock`    | public  | `boolean`                                  | `false`          | Whether the region remains in the viewport (ie. detaches from the anchor) on the horizontal axis                                                                                                                                        |                |
| `horizontalInset`           | public  | `boolean`                                  | `false`          | Whether the region overlaps the anchor on the horizontal axis                                                                                                                                                                           |                |
| `horizontalThreshold`       | public  | `number`                                   |                  | How narrow the space allocated to the default position has to be before the widest area is selected for layout                                                                                                                          |                |
| `horizontalScaling`         | public  | `AxisScalingMode`                          | `"content"`      | Defines how the width of the region is calculated                                                                                                                                                                                       |                |
| `verticalPositioningMode`   | public  | `AxisPositioningMode`                      | `"uncontrolled"` | Sets what logic the component uses to determine vertical placement. 'locktodefault' forces the default position 'dynamic' decides placement based on available space 'uncontrolled' does not control placement on the vertical axis     |                |
| `verticalDefaultPosition`   | public  | `VerticalPosition`                         | `"unset"`        | The default vertical position of the region relative to the anchor element                                                                                                                                                              |                |
| `verticalViewportLock`      | public  | `boolean`                                  | `false`          | Whether the region remains in the viewport (ie. detaches from the anchor) on the vertical axis                                                                                                                                          |                |
| `verticalInset`             | public  | `boolean`                                  | `false`          | Whether the region overlaps the anchor on the vertical axis                                                                                                                                                                             |                |
| `verticalThreshold`         | public  | `number`                                   |                  | How short the space allocated to the default position has to be before the tallest area is selected for layout                                                                                                                          |                |
| `verticalScaling`           | public  | `AxisScalingMode`                          | `"content"`      | Defines how the height of the region is calculated                                                                                                                                                                                      |                |
| `fixedPlacement`            | public  | `boolean`                                  | `false`          | Whether the region is positioned using css "position: fixed". Otherwise the region uses "position: absolute". Fixed placement allows the region to break out of parent containers,                                                      |                |
| `autoUpdateMode`            | public  | `AutoUpdateMode`                           | `"anchor"`       | Defines what triggers the anchored region to revaluate positioning                                                                                                                                                                      |                |
| `anchorElement`             | public  | `HTMLElement or null`                      | `null`           | The HTML element being used as the anchor                                                                                                                                                                                               |                |
| `viewportElement`           | public  | `HTMLElement or null`                      | `null`           | The HTML element being used as the viewport                                                                                                                                                                                             |                |
| `verticalPosition`          | public  | `AnchoredRegionPositionLabel or undefined` |                  | indicates the current horizontal position of the region                                                                                                                                                                                 |                |
| `horizontalPosition`        | public  | `AnchoredRegionPositionLabel or undefined` |                  | indicates the current vertical position of the region                                                                                                                                                                                   |                |
| `update`                    | public  |                                            |                  | update position                                                                                                                                                                                                                         |                |

#### Methods

| Name                               | Privacy   | Description | Parameters                                          | Return | Inherited From |
| ---------------------------------- | --------- | ----------- | --------------------------------------------------- | ------ | -------------- |
| `anchorChanged`                    | protected |             |                                                     | `void` |                |
| `viewportChanged`                  | protected |             |                                                     | `void` |                |
| `horizontalPositioningModeChanged` | protected |             |                                                     | `void` |                |
| `horizontalDefaultPositionChanged` | protected |             |                                                     | `void` |                |
| `horizontalViewportLockChanged`    | protected |             |                                                     | `void` |                |
| `horizontalInsetChanged`           | protected |             |                                                     | `void` |                |
| `horizontalThresholdChanged`       | protected |             |                                                     | `void` |                |
| `horizontalScalingChanged`         | protected |             |                                                     | `void` |                |
| `verticalPositioningModeChanged`   | protected |             |                                                     | `void` |                |
| `verticalDefaultPositionChanged`   | protected |             |                                                     | `void` |                |
| `verticalViewportLockChanged`      | protected |             |                                                     | `void` |                |
| `verticalInsetChanged`             | protected |             |                                                     | `void` |                |
| `verticalThresholdChanged`         | protected |             |                                                     | `void` |                |
| `verticalScalingChanged`           | protected |             |                                                     | `void` |                |
| `fixedPlacementChanged`            | protected |             |                                                     | `void` |                |
| `autoUpdateModeChanged`            | protected |             | `prevMode: AutoUpdateMode, newMode: AutoUpdateMode` | `void` |                |
| `anchorElementChanged`             | protected |             |                                                     | `void` |                |
| `viewportElementChanged`           | protected |             |                                                     | `void` |                |

#### Events

| Name             | Type | Description                                                         | Inherited From |
| ---------------- | ---- | ------------------------------------------------------------------- | -------------- |
| `loaded`         |      | Fires a custom 'loaded' event when the region is loaded and visible |                |
| `positionchange` |      | Fires a custom 'positionchange' event when the position has changed |                |

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

#### Slots

| Name | Description                      |
| ---- | -------------------------------- |
|      | The default slot for the content |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-anchored-region)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/anchored-region/anchored-region.spec.md)