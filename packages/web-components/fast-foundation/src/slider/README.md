# Usage
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