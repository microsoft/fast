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



### class: `Badge`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name            | Privacy | Type                                  | Default | Description                                                                                                                                                                         | Inherited From    |
| --------------- | ------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `circular`      | public  | `boolean`                             |         | Indicates the element should be circular                                                                                                                                            |                   |
| `$presentation` | public  | `ComponentPresentation or null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`      | public  | `ElementViewTemplate or void or null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`        | public  | `ElementStyles or void or null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name | Field    | Inherited From |
| ---- | -------- | -------------- |
|      | circular |                |

#### CSS Parts

| Name      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `control` | The element representing the badge, which wraps the default slot |

#### Slots

| Name | Description                    |
| ---- | ------------------------------ |
|      | The default slot for the badge |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-badge)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/badge/badge.spec.md)
* [Open UI Analysis](https://open-ui.org/components/badge.research)