---
id: fast-slider-label
title: fast-slider-label
sidebar_label: fast-slider-label
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/slider-label/README.md
---

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { SliderLabel, SliderLabelTemplate as template } from "@microsoft/fast-foundation";
import { SliderLabelStyles as styles } from "./slider-label.styles";

@customElement({
    name: "fast-slider-label",
    template,
    styles,
})
export class FASTSliderLabel extends SliderLabel {}
```