---
id: slider-label
title: fast-slider-label
sidebar_label: slider-label
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/slider-label/README.md
---

The `fast-slider-label` component provides a default styled label to be placed inside a `fast-slider`. Users can choose to hide the mark as well as provide custom label content.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-slider-label>Fast</fast-slider-label>
</fast-design-system-provider>
```

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