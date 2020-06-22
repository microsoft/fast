---
id: slider
title: fast-slider
sidebar_label: slider
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/slider/README.md
---

An implementation of a [range slider](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/range) as a form-connected web-component.

## Usage

```html live
<fast-design-system-provider use-defaults>
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
</fast-design-system-provider>
```

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Slider, SliderTemplate as template } from "@microsoft/fast-foundation";
import { SliderStyles as styles } from "./slider.styles";

@customElement({
    name: "fast-slider",
    template,
    styles,
})
export class FASTSlider extends Slider {}
```