---
id: slider
title: fast-slider
sidebar_label: slider
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/slider/README.md
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

### `src/slider/slider-utilities.ts`:

#### Functions

| Name                    | Description                                                                | Parameters                                                                         | Return   |
| ----------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| `convertPixelToPercent` | Converts a pixel coordinate on the track to a percent of the track's range | `pixelPos: number, minPosition: number, maxPosition: number, direction: Direction` | `number` |

<hr/>

#### Exports

| Kind | Name                    | Declaration           | Module                         | Package |
| ---- | ----------------------- | --------------------- | ------------------------------ | ------- |
| `js` | `convertPixelToPercent` | convertPixelToPercent | src/slider/slider-utilities.ts |         |

### `src/slider/slider.template.ts`:

#### Functions

| Name             | Description                                                                       | Parameters            | Return |
| ---------------- | --------------------------------------------------------------------------------- | --------------------- | ------ |
| `sliderTemplate` | The template for the {@link @microsoft/fast-foundation#(Slider:class)} component. | `context, definition` |        |

<hr/>

#### Exports

| Kind | Name             | Declaration    | Module                        | Package |
| ---- | ---------------- | -------------- | ----------------------------- | ------- |
| `js` | `sliderTemplate` | sliderTemplate | src/slider/slider.template.ts |         |

### `src/slider/slider.ts`:

#### class: `Slider`

##### Superclass

| Name                   | Module                             | Package |
| ---------------------- | ---------------------------------- | ------- |
| `FormAssociatedSlider` | /src/slider/slider.form-associated |         |

##### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

##### Fields

| Name                        | Privacy   | Type                                         | Default  | Description                                                                                                                                                                                           | Inherited From       |
| --------------------------- | --------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly`                  | public    | `boolean`                                    |          | When true, the control will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information.     |                      |
| `valueAsNumber`             | public    | `number`                                     |          | The value property, typed as a number.                                                                                                                                                                |                      |
| `valueTextFormatter`        | public    | `(value: string) => string \| null`          |          | Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.                                                                                    |                      |
| `min`                       | public    | `number`                                     | `0`      | The minimum allowed value.                                                                                                                                                                            |                      |
| `max`                       | public    | `number`                                     | `10`     | The maximum allowed value.                                                                                                                                                                            |                      |
| `step`                      | public    | `number`                                     | `1`      | Value to increment or decrement via arrow keys, mouse click or drag.                                                                                                                                  |                      |
| `orientation`               | public    | `Orientation`                                |          | The orientation of the slider.                                                                                                                                                                        |                      |
| `mode`                      | public    | `SliderMode`                                 |          | The selection mode.                                                                                                                                                                                   |                      |
| `keypressHandler`           | protected |                                              |          |                                                                                                                                                                                                       |                      |
| `setupTrackConstraints`     | private   |                                              |          |                                                                                                                                                                                                       |                      |
| `setupListeners`            | private   |                                              |          |                                                                                                                                                                                                       |                      |
| `midpoint`                  | private   | `string`                                     |          |                                                                                                                                                                                                       |                      |
| `handleThumbMouseDown`      | private   |                                              |          | Handle mouse moves during a thumb drag operation&#xD;&#xA;If the event handler is null it removes the events                                                                                          |                      |
| `handleMouseMove`           | private   |                                              |          | Handle mouse moves during a thumb drag operation                                                                                                                                                      |                      |
| `calculateNewValue`         | private   |                                              |          |                                                                                                                                                                                                       |                      |
| `handleWindowMouseUp`       | private   |                                              |          | Handle a window mouse up during a drag operation                                                                                                                                                      |                      |
| `stopDragging`              | private   |                                              |          |                                                                                                                                                                                                       |                      |
| `handleMouseDown`           | private   |                                              |          |                                                                                                                                                                                                       |                      |
| `convertToConstrainedValue` | private   |                                              |          |                                                                                                                                                                                                       |                      |
| `proxy`                     |           |                                              |          |                                                                                                                                                                                                       | FormAssociatedSlider |
| `_presentation`             | private   | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                       | FoundationElement    |
| `$presentation`             | public    | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                      | FoundationElement    |
| `template`                  | public    | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.          | FoundationElement    |
| `styles`                    | public    | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition. | FoundationElement    |

##### Methods

| Name                             | Privacy   | Description                                                                                              | Parameters             | Return | Inherited From    |
| -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- | ---------------------- | ------ | ----------------- |
| `readOnlyChanged`                | private   |                                                                                                          |                        | `void` |                   |
| `minChanged`                     | private   |                                                                                                          |                        | `void` |                   |
| `maxChanged`                     | private   |                                                                                                          |                        | `void` |                   |
| `stepChanged`                    | private   |                                                                                                          |                        | `void` |                   |
| `orientationChanged`             | private   |                                                                                                          |                        | `void` |                   |
| `increment`                      | public    | Increment the value by the step                                                                          |                        | `void` |                   |
| `decrement`                      | public    | Decrement the value by the step                                                                          |                        | `void` |                   |
| `setThumbPositionForOrientation` | public    | Places the thumb based on the current value                                                              | `direction: Direction` | `void` |                   |
| `updateStepMultiplier`           | private   | Update the step multiplier used to ensure rounding errors from steps that&#xD;&#xA;are not whole numbers |                        | `void` |                   |
| `setupDefaultValue`              | private   |                                                                                                          |                        | `void` |                   |
| `templateChanged`                | protected |                                                                                                          |                        | `void` | FoundationElement |
| `stylesChanged`                  | protected |                                                                                                          |                        | `void` | FoundationElement |

##### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | min         |                |
|               | max         |                |
|               | step        |                |
| `orientation` | orientation |                |
| `mode`        | mode        |                |

<hr/>

#### Exports

| Kind | Name     | Declaration | Module               | Package |
| ---- | -------- | ----------- | -------------------- | ------- |
| `js` | `Slider` | Slider      | src/slider/slider.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-slider)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/slider/slider.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#slider)
* [Open UI Analysis](https://open-ui.org/components/slider.research)