---
id: tooltip
title: fast-tooltip
sidebar_label: tooltip
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tooltip/README.md
---

The `fast-tooltip` component is used provide extra information about another element when it is hovered.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTooltip
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTooltip()
    );
```

## Usage

```html
<div>
    <fast-button id="anchor">Hover me</fast-button>
    <fast-tooltip anchor="anchor">Tooltip text</fast-tooltip>
</div>
```

## Create your own design

```ts
import { tooltipTemplate as template, Tooltip } from "@microsoft/fast-foundation";
import { tooltipStyles as styles } from "./my-tooltip.styles";

export const myTooltip = Tooltip.compose({
    baseName: "tooltip",
    template,
    styles,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-tooltip)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tooltip)
* [Open UI Analysis](https://open-ui.org/components/tooltip.research)