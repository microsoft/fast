---
id: fast-slider
title: fast-slider
sidebar_label: fast-slider
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/slider/README.md
---

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