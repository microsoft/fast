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

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-slider)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/slider/slider.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#slider)
* [Open UI Analysis](https://open-ui.org/components/slider.research)