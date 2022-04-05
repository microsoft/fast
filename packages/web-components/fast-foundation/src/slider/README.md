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

## `src/slider/slider-utilities.ts`:

### Functions

| Name                    | Description                                                                | Parameters                                                                         | Return   |
| ----------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| `convertPixelToPercent` | Converts a pixel coordinate on the track to a percent of the track's range | `pixelPos: number, minPosition: number, maxPosition: number, direction: Direction` | `number` |

<hr/>

### Exports

| Kind | Name                    | Declaration           | Module                         | Package |
| ---- | ----------------------- | --------------------- | ------------------------------ | ------- |
| `js` | `convertPixelToPercent` | convertPixelToPercent | src/slider/slider-utilities.ts |         |

## `src/slider/slider.ts`:

### class: `Slider`

#### Superclass

| Name                   | Module                                | Package |
| ---------------------- | ------------------------------------- | ------- |
| `FormAssociatedSlider` | /src/slider/slider.form-associated.js |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                 | Privacy   | Type                                  | Default | Description                                                                                                                                                                                       | Inherited From       |
| -------------------- | --------- | ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `readOnly`           | public    | `boolean`                             |         | When true, the control will be immutable by user interaction. See {@link https\://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly \| readonly HTML attribute} for more information. |                      |
| `valueAsNumber`      | public    | `number`                              |         | The value property, typed as a number.                                                                                                                                                            |                      |
| `valueTextFormatter` | public    | `(value: string) => string \| null`   |         | Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.                                                                                |                      |
| `min`                | public    | `number`                              | `0`     | The minimum allowed value.                                                                                                                                                                        |                      |
| `max`                | public    | `number`                              | `10`    | The maximum allowed value.                                                                                                                                                                        |                      |
| `step`               | public    | `number`                              | `1`     | Value to increment or decrement via arrow keys, mouse click or drag.                                                                                                                              |                      |
| `orientation`        | public    | `Orientation`                         |         | The orientation of the slider.                                                                                                                                                                    |                      |
| `mode`               | public    | `SliderMode`                          |         | The selection mode.                                                                                                                                                                               |                      |
| `keypressHandler`    | protected |                                       |         |                                                                                                                                                                                                   |                      |
| `proxy`              |           |                                       |         |                                                                                                                                                                                                   | FormAssociatedSlider |
| `$presentation`      | public    | `ComponentPresentation \| null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                                           | FoundationElement    |
| `template`           | public    | `ElementViewTemplate \| void \| null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                        | FoundationElement    |
| `styles`             | public    | `ElementStyles \| void \| null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.               | FoundationElement    |

#### Methods

| Name                             | Privacy   | Description                                 | Parameters             | Return | Inherited From    |
| -------------------------------- | --------- | ------------------------------------------- | ---------------------- | ------ | ----------------- |
| `increment`                      | public    | Increment the value by the step             |                        | `void` |                   |
| `decrement`                      | public    | Decrement the value by the step             |                        | `void` |                   |
| `setThumbPositionForOrientation` | public    | Places the thumb based on the current value | `direction: Direction` | `void` |                   |
| `templateChanged`                | protected |                                             |                        | `void` | FoundationElement |
| `stylesChanged`                  | protected |                                             |                        | `void` | FoundationElement |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `readonly`    | readOnly    |                |
|               | min         |                |
|               | max         |                |
|               | step        |                |
| `orientation` | orientation |                |
| `mode`        | mode        |                |

<hr/>

### Exports

| Kind | Name     | Declaration | Module               | Package |
| ---- | -------- | ----------- | -------------------- | ------- |
| `js` | `Slider` | Slider      | src/slider/slider.ts |         |

## `src/slider-label/slider-label.ts`:

### class: `SliderLabel`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                           | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                  | Default | Description                                                                                                                                                                         | Inherited From    |
| --------------- | ------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `position`      | public  | `string`                              |         | The position of the label relative to the min and max value of the parent {@link @microsoft/fast-foundation#(Slider:class)}.                                                        |                   |
| `hideMark`      | public  | `boolean`                             | `false` | Hides the tick mark.                                                                                                                                                                |                   |
| `disabled`      | public  | `boolean`                             |         | The disabled state of the label. This is generally controlled by the parent {@link @microsoft/fast-foundation#(Slider:class)}.                                                      |                   |
| `$presentation` | public  | `ComponentPresentation \| null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`      | public  | `ElementViewTemplate \| void \| null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`        | public  | `ElementStyles \| void \| null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name        | Field    | Inherited From |
| ----------- | -------- | -------------- |
| `position`  | position |                |
| `hide-mark` | hideMark |                |
| `disabled`  | disabled |                |

<hr/>

### Exports

| Kind | Name          | Declaration | Module                           | Package |
| ---- | ------------- | ----------- | -------------------------------- | ------- |
| `js` | `SliderLabel` | SliderLabel | src/slider-label/slider-label.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-slider)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/slider/slider.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#slider)
* [Open UI Analysis](https://open-ui.org/components/slider.research)