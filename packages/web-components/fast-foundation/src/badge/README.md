---
id: badge
title: fast-badge
sidebar_label: badge
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/badge/README.md
description: fast-badge is a web component used to highlight an item and attract attention or flag status.
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

```html live
<fast-badge>New</fast-badge>
```

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

## API



### class: `FASTBadge`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### CSS Parts

| Name      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `content` | The element representing the badge, which wraps the default slot |

#### Slots

| Name    | Description                                           |
| ------- | ----------------------------------------------------- |
| `start` | Content which can be provided before the default slot |
| `end`   | Content which can be provided after the default slot  |
|         | The default slot for the badge                        |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-badge)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/badge/badge.spec.md)
* [Open UI Analysis](https://open-ui.org/components/badge.research)