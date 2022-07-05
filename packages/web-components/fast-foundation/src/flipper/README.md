---
id: flipper
title: fast-flipper
sidebar_label: flipper
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/flipper/README.md
description: fast-flipper is a web component used to page through blocks of content or collections of ui elements.
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



### Variables

| Name               | Description                        | Type                                      |
| ------------------ | ---------------------------------- | ----------------------------------------- |
| `FlipperDirection` | The direction options for flipper. | `{ next: "next", previous: "previous", }` |

<hr/>



### class: `FASTFlipper`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name           | Privacy | Type               | Default | Description                                                                                                                                                             | Inherited From |
| -------------- | ------- | ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `disabled`     | public  | `boolean`          |         | The disabled state of the flipper.                                                                                                                                      |                |
| `hiddenFromAT` | public  | `boolean`          | `true`  | Indicates the flipper should be hidden from assistive technology. Because flippers are often supplementary navigation, they are often hidden from assistive technology. |                |
| `direction`    | public  | `FlipperDirection` |         | The direction that the flipper implies navigating.                                                                                                                      |                |

#### Methods

| Name           | Privacy | Description                                                                                                                    | Parameters                 | Return | Inherited From |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ------ | -------------- |
| `keyupHandler` | public  | Simulate a click event when the flipper has focus and the user hits enter or space keys Blur focus if the user hits escape key | `e: Event & KeyboardEvent` |        |                |

#### Events

| Name    | Type | Description                                                                                                                    | Inherited From |
| ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `click` |      | Fires a custom 'click' event when Enter or Space is invoked via keyboard and the flipper is exposed to assistive technologies. |                |

#### Attributes

| Name          | Field        | Inherited From |
| ------------- | ------------ | -------------- |
|               | disabled     |                |
| `aria-hidden` | hiddenFromAT |                |
| `direction`   | direction    |                |

#### CSS Parts

| Name       | Description                        |
| ---------- | ---------------------------------- |
| `next`     | Wraps the next flipper content     |
| `previous` | Wraps the previous flipper content |

#### Slots

| Name       | Description                  |
| ---------- | ---------------------------- |
| `next`     | The next flipper content     |
| `previous` | The previous flipper content |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-flipper)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/flipper/flipper.spec.md)