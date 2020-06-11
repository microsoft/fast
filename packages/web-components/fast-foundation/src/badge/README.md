---
id: fast-badge
title: fast-badge
sidebar_label: fast-badge
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/badge/README.md
---

The `fast-badge` component is used to highlight an item and attract attention or flag status.

## Applying Custom Styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Badge, BadgeTemplate as template } from "@microsoft/fast-foundation";
import { BadgeStyles as styles } from "./badge.styles";

@customElement({
    name: "fast-badge",
    template,
    styles,
})
export class FASTBadge extends Badge {}
```

## Usage
The `fill` and `color` attributes of the *badge* create CSS custom properties which can be used to style the control.

__Example custom property map__
```css
fast-badge {
    --badge-fill-primary: #00FF00;
    --badge-fill-danger: #FF0000;
    --badge-color-light: #FFFFFF;
    --badge-color-dark: #000000;
}
```


```html live
<fast-design-system-provider use-defaults>
    <fast-badge appearance="accent">Danger</fast-badge>
</fast-design-system-provider>
```

:::note
In addition to the color map support detailed above, the `fast-badge` from the Microsoft component implementation (`@microsoft/fast-components-msft`) includes an attribute to set default appearances which ensure WCAG 2.1 AA contrast requirements.
:::