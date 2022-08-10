---
id: slider
title: fast-slider
sidebar_label: slider
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/slider/README.md
description: fast-slider is an implementation of a range slider as a form-connected web component.
---

An implementation of a [range slider](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/range) as a form-connected web-component. Note that if the slider is in vertical orientation by default the component will get a height using the css var `--fast-slider-height`, by default that equates to `(10px * var(--thumb-size))` or 160px. Inline styles will override that height.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastSlider,
    fastSliderLabel
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSlider(),
        fastSliderLabel()
    );
```

### Customizing the Thumb

```ts
import {
    provideFASTDesignSystem,
    fastSlider,
    fastSliderLabel
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSlider({
            thumb: `...your thumb...`
        }),
        fastSliderLabel()
    );
```

## Usage

```html live
<fast-slider min="0" max="100" step="10" value="70">
    <fast-slider-label
        position="0"
    >
        0
    </fast-slider-label>
    <fast-slider-label
        position="10"
    >
        10
    </fast-slider-label>
    <fast-slider-label
        position="90"
    >
        90
    </fast-slider-label>
    <fast-slider-label
        position="100"
    >
        100
    </fast-slider-label>
</fast-slider>
```

## Create your own design

### Slider

```ts
import {
    Slider,
    SliderOptions,
    sliderTemplate as template,
} from "@microsoft/fast-foundation";
import { sliderStyles as styles } from "./my-slider.styles";

export const mySlider = Slider.compose<SliderOptions>({
    baseName: "slider",
    template,
    styles,
    thumb: `...default thumb...`,
});
```

### SliderLabel

```ts
import {
    SliderLabel,
    sliderLabelTemplate as template,
} from "@microsoft/fast-foundation";
import { sliderLabelStyles as styles } from "./my-slider-label.styles";

export const mySliderLabel = SliderLabel.compose({
    baseName: "slider-label",
    template,
    styles,
});
```

## API



### Functions

| Name                    | Description                                                                | Parameters                                                                         | Return   |
| ----------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| `convertPixelToPercent` | Converts a pixel coordinate on the track to a percent of the track's range | `pixelPos: number, minPosition: number, maxPosition: number, direction: Direction` | `number` |

<hr/>



### class: `FormAssociatedSlider`

#### Superclass

| Name      | Module                               | Package |
| --------- | ------------------------------------ | ------- |
| `_Slider` | src/slider/slider.form-associated.ts |         |

#### Mixins

| Name             | Module                                  | Package |
| ---------------- | --------------------------------------- | ------- |
| `FormAssociated` | /src/form-associated/form-associated.js |         |

#### Fields

| Name    | Privacy | Type | Default | Description | Inherited From |
| ------- | ------- | ---- | ------- | ----------- | -------------- |
| `proxy` |         |      |         |             |                |

<hr/>



### class: `FASTSlider`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedSlider` | /src/slider/slider.form-associated.js |         |

#### Fields

| Name                 | Privacy   | Type                                | Default | Description                                                                                                                                                                                 | Inherited From       |
| -------------------- | --------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly`           | public    | `boolean`                           |         | When true, the control will be immutable by user interaction. See [readonly HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) for more information. |                      |
| `valueAsNumber`      | public    | `number`                            |         | The value property, typed as a number.                                                                                                                                                      |                      |
| `valueTextFormatter` | public    | `(value: string) => string or null` |         | Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.                                                                          |                      |
| `min`                | public    | `number`                            | `0`     | The minimum allowed value.                                                                                                                                                                  |                      |
| `max`                | public    | `number`                            | `10`    | The maximum allowed value.                                                                                                                                                                  |                      |
| `step`               | public    | `number`                            | `1`     | Value to increment or decrement via arrow keys, mouse click or drag.                                                                                                                        |                      |
| `orientation`        | public    | `Orientation`                       |         | The orientation of the slider.                                                                                                                                                              |                      |
| `mode`               | public    | `SliderMode`                        |         | The selection mode.                                                                                                                                                                         |                      |
| `keypressHandler`    | protected |                                     |         |                                                                                                                                                                                             |                      |
| `proxy`              |           |                                     |         |                                                                                                                                                                                             | FormAssociatedSlider |

#### Methods

| Name                             | Privacy   | Description                                 | Parameters             | Return | Inherited From |
| -------------------------------- | --------- | ------------------------------------------- | ---------------------- | ------ | -------------- |
| `readOnlyChanged`                | protected |                                             |                        | `void` |                |
| `increment`                      | public    | Increment the value by the step             |                        | `void` |                |
| `decrement`                      | public    | Decrement the value by the step             |                        | `void` |                |
| `setThumbPositionForOrientation` | public    | Places the thumb based on the current value | `direction: Direction` | `void` |                |

#### Events

| Name     | Type | Description                                                 | Inherited From |
| -------- | ---- | ----------------------------------------------------------- | -------------- |
| `change` |      | Fires a custom 'change' event when the slider value changes |                |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | min         |                |
|               | max         |                |
|               | step        |                |
| `orientation` | orientation |                |
| `mode`        | mode        |                |

#### CSS Parts

| Name                 | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `positioning-region` | The region used to position the elements of the slider          |
| `track-container`    | The region containing the track elements                        |
| `track-start`        | The element wrapping the track start slot                       |
| `thumb-container`    | The thumb container element which is programatically positioned |

#### Slots

| Name          | Description                      |
| ------------- | -------------------------------- |
| `track`       | The track of the slider          |
| `track-start` | The track-start visual indicator |
| `thumb`       | The slider thumb                 |
|               | The default slot for labels      |

<hr/>

### Variables

| Name         | Description                                                             | Type                               |
| ------------ | ----------------------------------------------------------------------- | ---------------------------------- |
| `SliderMode` | The selection modes of a @microsoft/fast-foundation#(FASTSlider:class). | `{ singleValue: "single-value", }` |

<hr/>



### class: `FASTSliderLabel`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name       | Privacy | Type      | Default | Description                                                                                                                | Inherited From |
| ---------- | ------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `position` | public  | `string`  |         | The position of the label relative to the min and max value of the parent @microsoft/fast-foundation#(FASTSlider:class).   |                |
| `hideMark` | public  | `boolean` | `false` | Hides the tick mark.                                                                                                       |                |
| `disabled` | public  | `boolean` |         | The disabled state of the label. This is generally controlled by the parent @microsoft/fast-foundation#(FASTSlider:class). |                |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From |
| ----------------- | --------- | ----------- | ---------- | ------ | -------------- |
| `positionChanged` | protected |             |            | `void` |                |

#### Attributes

| Name        | Field    | Inherited From |
| ----------- | -------- | -------------- |
| `position`  | position |                |
| `hide-mark` | hideMark |                |
| `disabled`  | disabled |                |

#### CSS Parts

| Name   | Description                                  |
| ------ | -------------------------------------------- |
| `root` | The element wrapping the label mark and text |

#### Slots

| Name | Description                            |
| ---- | -------------------------------------- |
|      | The default slot for the label content |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-slider)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/slider/slider.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#slider)
* [Open UI Analysis](https://open-ui.org/components/slider.research)