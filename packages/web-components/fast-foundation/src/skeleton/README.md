---
id: skeleton
title: fast-skeleton
sidebar_label: skeleton
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/skeleton/README.md
description: fast-skeleton is a web component implemention of a skeleton.
---

The `skeleton` component is used as a visual placeholder for an element while it is in a loading state and usually presents itself as a simplified wireframe-like version of the UI it is representing.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastSkeleton
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastSkeleton()
    );
```

## Usage

### Basic Usage

```html
<fast-skeleton
    style="
        border-radius: 4px;
        width: 50px;
        height: 50px;
    "
    shape="circle"
></fast-skeleton>
```

### Pattern

A URL for an image asset may be passed to the `pattern` attribute. In this mode, the `fast-skeleton` component is used as a container for a transparent SVG that may express a more complex placeholder

```html
<fast-skeleton
    style="
        border-radius: 4px;
        width: 500px;
        height: 250px;
    "
    shape="rect"
    pattern="https://static.fast.design/assets/skeleton-test-pattern.svg"
></fast-skeleton>
```

### Shimmer

The `shimmer` boolean attribute will activate the component's shimmer effect.

```html
<fast-skeleton
    style="
        border-radius: 4px;
        width: 500px;
        height: 250px;
    "
    shape="rect"
    pattern="https://static.fast.design/assets/skeleton-test-pattern.svg"
    shimmer
></fast-skeleton>
```

### Custom SVG

An inline SVG can also be inserted into the slot of the `fast-skeleton`.

```html
<fast-skeleton
    style="
        border-radius: 4px;
        width: 500px;
        height: 250px;
    "
    shape="rect"
    shimmer
>
    <svg
        style="position: absolute; left: 0; top: 0;"
        id="pattern"
        width="100%"
        height="100%"
    >
        <defs>
            <mask id="mask" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
                <rect x="0" y="0" width="100%" height="45%" rx="4" />
                <rect x="25" y="55%" width="90%" height="15px" rx="4" />
                <rect x="25" y="65%" width="70%" height="15px" rx="4" />
                <rect x="25" y="80%" width="90px" height="30px" rx="4" />
            </mask>
        </defs>
        <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            mask="url(#mask)"
            fill="#ffffff"
        />
    </svg>
</fast-skeleton>
```

### Further Customizations

The following CSS variables can be used to customize the appearance.

| CSS Variable                  | Expected value  |
|-------------------------------|-----------------|
|`--skeleton-fill`              | Color           |
|`--skeleton-animation-fill`    | Color           |
|`--skeleton-animation-gradient`| Linear gradient |
|`--skeleton-animation-timing`  | Easing function |

## Create your own design

```ts
import { Skeleton, skeletonTemplate as template } from "@microsoft/fast-foundation";
import { skeletonStyles as styles } from "./my-skeleton.styles";

export const mySkeleton = Skeleton.compose({
    baseName: "skeleton",
    template,
    styles,
});
```

## API



### class: `Skeleton`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name            | Privacy | Type                                  | Default | Description                                                                                                                                                                         | Inherited From    |
| --------------- | ------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `fill`          | public  | `string`                              |         | Indicates the Skeleton should have a filled style.                                                                                                                                  |                   |
| `shape`         | public  | `SkeletonShape`                       |         | Indicates what the shape of the Skeleton should be.                                                                                                                                 |                   |
| `pattern`       | public  | `string`                              |         | Indicates that the component can accept a pattern URL.                                                                                                                              |                   |
| `shimmer`       | public  | `boolean`                             |         | Indicates that the component has an activated shimmer effect                                                                                                                        |                   |
| `$presentation` | public  | `ComponentPresentation or null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`      | public  | `ElementViewTemplate or void or null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`        | public  | `ElementStyles or void or null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `fill`    | fill    |                |
| `shape`   | shape   |                |
| `pattern` | pattern |                |
|           | shimmer |                |

#### Slots

| Name | Description      |
| ---- | ---------------- |
|      | The default slot |

<hr/>

### Variables

| Name            | Description                              | Type                                  |
| --------------- | ---------------------------------------- | ------------------------------------- |
| `SkeletonShape` | A structure representing skeleton shapes | `{ rect: "rect", circle: "circle", }` |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-skeleton)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/skeleton/skeleton.spec.md)
* [Open UI Analysis](https://open-ui.org/components/skeleton.research)