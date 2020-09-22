---
id: fast-tooltip
title: fast-tooltip
sidebar_label: fast-tooltip
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tooltip/README.md

## Usage

```html live
<fast-design-system-provider use-defaults>
    <button id="mybutton">
       Hover me for more info
    </button>
    <fast-tooltip anchor="mybutton">
      helpful text
    </fast-slider>
</fast-design-system-provider>
```
---

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Tooltip, TooltipTemplate as template } from "@microsoft/fast-foundation";
import { TooltipStyles as styles } from "./tooltip.styles";

@customElement({
    name: "fast-tooltip",
    template,
    styles,
})
export class FASTTooltip extends Tooltip {}
```