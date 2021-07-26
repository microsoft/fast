---
id: badge
title: fast-badge
sidebar_label: badge
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/badge/README.md
---

The `fast-badge` component is used to highlight an item and attract attention or flag status.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastBadge
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastBadge()
    );
```

## Usage

The `fill` and `color` attributes of the *badge* create CSS custom properties which can be used to style the control.

```css
fast-badge {
    --badge-fill-primary: #00FF00;
    --badge-fill-danger: #FF0000;
    --badge-color-light: #FFFFFF;
    --badge-color-dark: #000000;
}
```

```html live
<fast-badge fill="danger" color="dark">Danger</fast-badge>
```

:::note
In addition to the color map support detailed above, the `fast-badge` from the Microsoft component implementation (`@fluentui/web-components`) includes an attribute to set default appearances which ensure WCAG 2.1 AA contrast requirements.
:::

## Create your own design

```ts
import { Badge, badgeTemplate as template } from "@microsoft/fast-foundation";
import { badgeStyles as styles } from "./my-badge.styles";

export const myBadge = Badge.compose({
    baseName: "badge",
    template,
    styles,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-badge)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/badge/badge.spec.md)
* [Open UI Analysis](https://open-ui.org/components/badge.research)