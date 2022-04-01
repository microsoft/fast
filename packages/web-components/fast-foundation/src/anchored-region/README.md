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

## `src/anchored-region/anchored-region-config.ts`:

### Variables

| Name                   | Description                                                                                                                                                                   | Type                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `FlyoutPosTop`         | A region that always places itself above the anchor, has&#xD;&#xA;a width to match the anchor, and is sized vertically by content                                             | `AnchoredRegionConfig` |
| `FlyoutPosBottom`      | A region that always places itself below the anchor, has&#xD;&#xA;a width to match the anchor, and is sized vertically by content                                             | `AnchoredRegionConfig` |
| `FlyoutPosTallest`     | A region that places itself above or below the anchor&#xD;&#xA;based on available space, has a width to match the anchor,&#xD;&#xA;and is sized vertically by content         | `AnchoredRegionConfig` |
| `FlyoutPosTopFill`     | A region that always places itself above the anchor, has&#xD;&#xA;a width to match the anchor, and is sized vertically by available space                                     | `AnchoredRegionConfig` |
| `FlyoutPosBottomFill`  | A region that always places itself below the anchor, has&#xD;&#xA;a width to match the anchor, and is sized vertically by available space                                     | `AnchoredRegionConfig` |
| `FlyoutPosTallestFill` | A region that places itself above or below the anchor&#xD;&#xA;based on available space, has a width to match the anchor,&#xD;&#xA;and is sized vertically by available space | `AnchoredRegionConfig` |

<hr/>

### Exports

| Kind | Name                   | Declaration          | Module                                        | Package |
| ---- | ---------------------- | -------------------- | --------------------------------------------- | ------- |
| `js` | `FlyoutPosTop`         | FlyoutPosTop         | src/anchored-region/anchored-region-config.ts |         |
| `js` | `FlyoutPosBottom`      | FlyoutPosBottom      | src/anchored-region/anchored-region-config.ts |         |
| `js` | `FlyoutPosTallest`     | FlyoutPosTallest     | src/anchored-region/anchored-region-config.ts |         |
| `js` | `FlyoutPosTopFill`     | FlyoutPosTopFill     | src/anchored-region/anchored-region-config.ts |         |
| `js` | `FlyoutPosBottomFill`  | FlyoutPosBottomFill  | src/anchored-region/anchored-region-config.ts |         |
| `js` | `FlyoutPosTallestFill` | FlyoutPosTallestFill | src/anchored-region/anchored-region-config.ts |         |

## `src/anchored-region/anchored-region.ts`:

### class: `AnchoredRegion`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Fields

| Name                  | Privacy | Type                  | Default                     | Description | Inherited From |
| --------------------- | ------- | --------------------- | --------------------------- | ----------- | -------------- |
| `intersectionService` | private | `IntersectionService` | `new IntersectionService()` |             |                |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                            | Privacy | Type                                         | Default          | Description                                                                                                                                                                                                                             | Inherited From    |
| ------------------------------- | ------- | -------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `anchor`                        | public  | `string`                                     | `""`             | The HTML ID of the anchor element this region is positioned relative to                                                                                                                                                                 |                   |
| `viewport`                      | public  | `string`                                     | `""`             | The HTML ID of the viewport element this region is positioned relative to                                                                                                                                                               |                   |
| `horizontalPositioningMode`     | public  | `AxisPositioningMode`                        | `"uncontrolled"` | Sets what logic the component uses to determine horizontal placement. 'locktodefault' forces the default position 'dynamic' decides placement based on available space 'uncontrolled' does not control placement on the horizontal axis |                   |
| `horizontalDefaultPosition`     | public  | `HorizontalPosition`                         | `"unset"`        | The default horizontal position of the region relative to the anchor element                                                                                                                                                            |                   |
| `horizontalViewportLock`        | public  | `boolean`                                    | `false`          | Whether the region remains in the viewport (ie. detaches from the anchor) on the horizontal axis                                                                                                                                        |                   |
| `horizontalInset`               | public  | `boolean`                                    | `false`          | Whether the region overlaps the anchor on the horizontal axis                                                                                                                                                                           |                   |
| `horizontalThreshold`           | public  | `number`                                     |                  | How narrow the space allocated to the default position has to be before the widest area is selected for layout                                                                                                                          |                   |
| `horizontalScaling`             | public  | `AxisScalingMode`                            | `"content"`      | Defines how the width of the region is calculated                                                                                                                                                                                       |                   |
| `verticalPositioningMode`       | public  | `AxisPositioningMode`                        | `"uncontrolled"` | Sets what logic the component uses to determine vertical placement. 'locktodefault' forces the default position 'dynamic' decides placement based on available space 'uncontrolled' does not control placement on the vertical axis     |                   |
| `verticalDefaultPosition`       | public  | `VerticalPosition`                           | `"unset"`        | The default vertical position of the region relative to the anchor element                                                                                                                                                              |                   |
| `verticalViewportLock`          | public  | `boolean`                                    | `false`          | Whether the region remains in the viewport (ie. detaches from the anchor) on the vertical axis                                                                                                                                          |                   |
| `verticalInset`                 | public  | `boolean`                                    | `false`          | Whether the region overlaps the anchor on the vertical axis                                                                                                                                                                             |                   |
| `verticalThreshold`             | public  | `number`                                     |                  | How short the space allocated to the default position has to be before the tallest area is selected for layout                                                                                                                          |                   |
| `verticalScaling`               | public  | `AxisScalingMode`                            | `"content"`      | Defines how the height of the region is calculated                                                                                                                                                                                      |                   |
| `fixedPlacement`                | public  | `boolean`                                    | `false`          | Whether the region is positioned using css "position: fixed". Otherwise the region uses "position: absolute". Fixed placement allows the region to break out of parent containers,                                                      |                   |
| `autoUpdateMode`                | public  | `AutoUpdateMode`                             | `"anchor"`       | Defines what triggers the anchored region to revaluate positioning                                                                                                                                                                      |                   |
| `anchorElement`                 | public  | `HTMLElement \| null`                        | `null`           | The HTML element being used as the anchor                                                                                                                                                                                               |                   |
| `viewportElement`               | public  | `HTMLElement \| null`                        | `null`           | The HTML element being used as the viewport                                                                                                                                                                                             |                   |
| `verticalPosition`              | public  | `AnchoredRegionPositionLabel \| undefined`   |                  | indicates the current horizontal position of the region                                                                                                                                                                                 |                   |
| `horizontalPosition`            | public  | `AnchoredRegionPositionLabel \| undefined`   |                  | indicates the current vertical position of the region                                                                                                                                                                                   |                   |
| `translateX`                    | private | `number`                                     |                  | values to be applied to the component's transform on render                                                                                                                                                                             |                   |
| `translateY`                    | private | `number`                                     |                  |                                                                                                                                                                                                                                         |                   |
| `regionWidth`                   | private | `string`                                     |                  | the span to be applied to the region on each axis                                                                                                                                                                                       |                   |
| `regionHeight`                  | private | `string`                                     |                  |                                                                                                                                                                                                                                         |                   |
| `resizeDetector`                | private | `ResizeObserverClassDefinition \| null`      | `null`           |                                                                                                                                                                                                                                         |                   |
| `viewportRect`                  | private | `ClientRect \| DOMRect \| undefined`         |                  |                                                                                                                                                                                                                                         |                   |
| `anchorRect`                    | private | `ClientRect \| DOMRect \| undefined`         |                  |                                                                                                                                                                                                                                         |                   |
| `regionRect`                    | private | `ClientRect \| DOMRect \| undefined`         |                  |                                                                                                                                                                                                                                         |                   |
| `baseHorizontalOffset`          | private | `number`                                     | `0`              | base offsets between the positioner's base position and the anchor's                                                                                                                                                                    |                   |
| `baseVerticalOffset`            | private | `number`                                     | `0`              |                                                                                                                                                                                                                                         |                   |
| `pendingPositioningUpdate`      | private | `boolean`                                    | `false`          |                                                                                                                                                                                                                                         |                   |
| `pendingReset`                  | private | `boolean`                                    | `false`          |                                                                                                                                                                                                                                         |                   |
| `currentDirection`              | private | `Direction`                                  |                  |                                                                                                                                                                                                                                         |                   |
| `regionVisible`                 | private | `boolean`                                    | `false`          |                                                                                                                                                                                                                                         |                   |
| `forceUpdate`                   | private | `boolean`                                    | `false`          |                                                                                                                                                                                                                                         |                   |
| `updateThreshold`               | private | `number`                                     | `0.5`            |                                                                                                                                                                                                                                         |                   |
| `update`                        | public  |                                              |                  | update position                                                                                                                                                                                                                         |                   |
| `startObservers`                | private |                                              |                  | starts observers                                                                                                                                                                                                                        |                   |
| `requestPositionUpdates`        | private |                                              |                  | get position updates                                                                                                                                                                                                                    |                   |
| `stopObservers`                 | private |                                              |                  | stops observers                                                                                                                                                                                                                         |                   |
| `getViewport`                   | private |                                              |                  | Gets the viewport element by id, or defaults to document root                                                                                                                                                                           |                   |
| `getAnchor`                     | private |                                              |                  | Gets the anchor element by id                                                                                                                                                                                                           |                   |
| `handleIntersection`            | private |                                              |                  | Handle intersections                                                                                                                                                                                                                    |                   |
| `applyIntersectionEntries`      | private |                                              |                  | iterate through intersection entries and apply data                                                                                                                                                                                     |                   |
| `updateRegionOffset`            | private |                                              |                  | Update the offset values                                                                                                                                                                                                                |                   |
| `isRectDifferent`               | private |                                              |                  | compare rects to see if there is enough change to justify a DOM update                                                                                                                                                                  |                   |
| `handleResize`                  | private |                                              |                  | Handle resize events                                                                                                                                                                                                                    |                   |
| `reset`                         | private |                                              |                  | resets the component                                                                                                                                                                                                                    |                   |
| `updateLayout`                  | private |                                              |                  | Recalculate layout related state values                                                                                                                                                                                                 |                   |
| `updateRegionStyle`             | private |                                              |                  | Updates the style string applied to the region element as well as the css classes attached to the root element                                                                                                                          |                   |
| `updatePositionClasses`         | private |                                              |                  | Updates the css classes that reflect the current position of the element                                                                                                                                                                |                   |
| `setHorizontalPosition`         | private |                                              |                  | Get horizontal positioning state based on desired position                                                                                                                                                                              |                   |
| `setVerticalPosition`           | private |                                              |                  | Set vertical positioning state based on desired position                                                                                                                                                                                |                   |
| `getPositioningOptions`         | private |                                              |                  | Get available positions based on positioning mode                                                                                                                                                                                       |                   |
| `getAvailableSpace`             | private |                                              |                  | Get the space available for a particular relative position                                                                                                                                                                              |                   |
| `getNextRegionDimension`        | private |                                              |                  | Get region dimensions                                                                                                                                                                                                                   |                   |
| `startAutoUpdateEventListeners` | private |                                              |                  | starts event listeners that can trigger auto updating                                                                                                                                                                                   |                   |
| `stopAutoUpdateEventListeners`  | private |                                              |                  | stops event listeners that can trigger auto updating                                                                                                                                                                                    |                   |
| `_presentation`                 | private | `ComponentPresentation \| null \| undefined` | `void 0`         |                                                                                                                                                                                                                                         | FoundationElement |
| `$presentation`                 | public  | `ComponentPresentation \| null`              |                  | A property which resolves the ComponentPresentation instance for the current component.                                                                                                                                                 | FoundationElement |
| `template`                      | public  | `ElementViewTemplate \| void \| null`        |                  | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                                                              | FoundationElement |
| `styles`                        | public  | `ElementStyles \| void \| null`              |                  | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.                                                     | FoundationElement |

#### Methods

| Name                               | Privacy   | Description                                                   | Parameters                                          | Return | Inherited From    |
| ---------------------------------- | --------- | ------------------------------------------------------------- | --------------------------------------------------- | ------ | ----------------- |
| `anchorChanged`                    | private   |                                                               |                                                     | `void` |                   |
| `viewportChanged`                  | private   |                                                               |                                                     | `void` |                   |
| `horizontalPositioningModeChanged` | private   |                                                               |                                                     | `void` |                   |
| `horizontalDefaultPositionChanged` | private   |                                                               |                                                     | `void` |                   |
| `horizontalViewportLockChanged`    | private   |                                                               |                                                     | `void` |                   |
| `horizontalInsetChanged`           | private   |                                                               |                                                     | `void` |                   |
| `horizontalThresholdChanged`       | private   |                                                               |                                                     | `void` |                   |
| `horizontalScalingChanged`         | private   |                                                               |                                                     | `void` |                   |
| `verticalPositioningModeChanged`   | private   |                                                               |                                                     | `void` |                   |
| `verticalDefaultPositionChanged`   | private   |                                                               |                                                     | `void` |                   |
| `verticalViewportLockChanged`      | private   |                                                               |                                                     | `void` |                   |
| `verticalInsetChanged`             | private   |                                                               |                                                     | `void` |                   |
| `verticalThresholdChanged`         | private   |                                                               |                                                     | `void` |                   |
| `verticalScalingChanged`           | private   |                                                               |                                                     | `void` |                   |
| `fixedPlacementChanged`            | private   |                                                               |                                                     | `void` |                   |
| `autoUpdateModeChanged`            | private   |                                                               | `prevMode: AutoUpdateMode, newMode: AutoUpdateMode` | `void` |                   |
| `anchorElementChanged`             | private   |                                                               |                                                     | `void` |                   |
| `viewportElementChanged`           | private   |                                                               |                                                     | `void` |                   |
| `disconnectResizeDetector`         | private   | destroys the instance's resize observer                       |                                                     | `void` |                   |
| `initializeResizeDetector`         | private   | initializes the instance's resize observer                    |                                                     | `void` |                   |
| `updateForAttributeChange`         | private   | react to attribute changes that don't require a reset         |                                                     | `void` |                   |
| `initialize`                       | private   | fully initializes the component                               |                                                     | `void` |                   |
| `requestReset`                     | private   | Request a reset if there are currently no open requests       |                                                     | `void` |                   |
| `setInitialState`                  | private   | sets the starting configuration for component internal values |                                                     | `void` |                   |
| `templateChanged`                  | protected |                                                               |                                                     | `void` | FoundationElement |
| `stylesChanged`                    | protected |                                                               |                                                     | `void` | FoundationElement |

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

### Exports

| Kind | Name             | Declaration    | Module                                 | Package |
| ---- | ---------------- | -------------- | -------------------------------------- | ------- |
| `js` | `AnchoredRegion` | AnchoredRegion | src/anchored-region/anchored-region.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-anchored-region)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/anchored-region/anchored-region.spec.md)