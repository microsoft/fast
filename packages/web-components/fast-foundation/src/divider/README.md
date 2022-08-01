---
id: divider
title: fast-divider
sidebar_label: divider
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/divider/README.md
description: fast-divider is a web component implementation of a horizontal rule.
---

A web component implementation of a [horizontal rule](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr).

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastDivider
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastDivider()
    );
```

## Usage

```html live
<fast-divider></fast-divider>
```

##  Create your own design

```ts
import { Divider, dividerTemplate as template } from "@microsoft/fast-foundation";
import { dividerStyles as styles } from "./my-divider.styles";

export const myDivider = Divider.compose({
    baseName: "divider",
    template,
    styles,
});
```

## API



### Variables

| Name          | Description   | Type                                                        |
| ------------- | ------------- | ----------------------------------------------------------- |
| `DividerRole` | Divider roles | `{ separator: "separator", presentation: "presentation", }` |

<hr/>



### class: `FASTDivider`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name          | Privacy | Type          | Default | Description                     | Inherited From |
| ------------- | ------- | ------------- | ------- | ------------------------------- | -------------- |
| `role`        | public  | `DividerRole` |         | The role of the element.        |                |
| `orientation` | public  | `Orientation` |         | The orientation of the divider. |                |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `role`        | role        |                |
| `orientation` | orientation |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-divider)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/divider/divider.spec.md)