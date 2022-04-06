---
id: flipper
title: fast-flipper
sidebar_label: flipper
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/flipper/README.md
---

The flipper component is most often used to page through blocks of content or collections of ui elements. As flippers are often a supplemental form of navigation, the flippers are hidden by default to avoid duplicate keyboard interaction. Passing an attribute of `aria-hidden="false"` will expose the flippers to assistive technology.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastFlipper
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastFlipper()
    );
```

### Customizing Icons

```ts
import {
    provideFASTDesignSystem,
    fastFlipper
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastFlipper({
            next: `...your next icon...`,
            previous: `...your previous icon...`,
        })
    );
```

## Usage

### Previous

```html live
<fast-flipper direction="previous"></fast-flipper>
```

### Next

```html live
<fast-flipper direction="next"></fast-flipper>
```

## Create your own design

```ts
import {
    Flipper,
    FlipperOptions,
    flipperTemplate as template,
} from "@microsoft/fast-foundation";
import { flipperStyles as styles } from "./my-flipper.styles";

export const myFlipper = Flipper.compose<FlipperOptions>({
    baseName: "flipper",
    template,
    styles,
    next: `...default next icon...`,
    previous: `...default previous icon...`,
});
```

## API



### class: `Flipper`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name            | Privacy | Type                                       | Default | Description | Inherited From    |
| --------------- | ------- | ------------------------------------------ | ------- | ----------- | ----------------- |
| `disabled`      | public  | `boolean`                                  |         |             |                   |
| `hiddenFromAT`  | public  | `boolean`                                  |         |             |                   |
| `direction`     | public  | `FlipperDirection or "next" or "previous"` |         |             |                   |
| `$presentation` | public  | `ComponentPresentation or null`            |         |             | FoundationElement |
| `template`      | public  | `ElementViewTemplate or void or null`      |         |             | FoundationElement |
| `styles`        | public  | `ElementStyles or void or null`            |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters                 | Return | Inherited From    |
| ----------------- | --------- | ----------- | -------------------------- | ------ | ----------------- |
| `keyupHandler`    | public    |             | `e: Event & KeyboardEvent` |        |                   |
| `templateChanged` | protected |             |                            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |                            | `void` | FoundationElement |

#### Attributes

| Name          | Field        | Inherited From |
| ------------- | ------------ | -------------- |
|               | disabled     |                |
| `aria-hidden` | hiddenFromAT |                |
| `direction`   | direction    |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-flipper)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/flipper/flipper.spec.md)