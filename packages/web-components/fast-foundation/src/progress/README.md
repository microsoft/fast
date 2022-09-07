---
id: progress
title: fast-progress
sidebar_label: progress
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/progress/README.md
description: fast-progress is a web component used to display the length of time a process will take or to visualize percentage value.
---

*Progress* and *progress ring* are used to display the length of time a process will take or to visualize percentage value (referred to as a **determinate** state) and to represent an unspecified wait time (referred to as an **indeterminate** state). *Progress* components are typically visually represented by a circular or linear animation. When the `value` attribute is passed the state is **determinate**, otherwise it is **indeterminate**. 

For progress components which have a linear visual appearance, use `fast-progress`. For progress implementations which are circular, use `fast-progress-ring`.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastProgress,
    fastProgressRing
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastProgress(),
        fastProgressRing()
    );
```

### Customizing Indicators

```ts
import {
    provideFASTDesignSystem,
    fastProgress,
    fastProgressRing
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastProgress({
            indeterminateIndicator1: `...your indeterminate indicator...`,
            indeterminateIndicator2: `...your indeterminate indicator...`
        }),
        fastProgressRing({
            indeterminateIndicator: `...your indeterminate indicator...`
        })
    );
```

## Usage

### fast-progress

```html live
<fast-progress min="0" max="100" value="75"></fast-progress>
```

### fast-progress-ring

```html live
<fast-progress-ring min="0" max="100" value="75"></fast-progress-ring>
```

## Create your own design

### Progress

```ts
import {
    BaseProgress as Progress,
    ProgressOptions,
    progressTemplate as template,
} from "@microsoft/fast-foundation";
import { progressStyles as styles } from "./my-progress.styles";

export const myProgress = Progress.compose<ProgressOptions>({
    baseName: "progress",
    template,
    styles,
    indeterminateIndicator1: `...default indeterminate indicator...`,
    indeterminateIndicator2: `...default indeterminate indicator...`,
});
```

### ProgressRing

```ts
import {
    BaseProgress as ProgressRing,
    ProgressRingOptions,
    progressRingTemplate as template,
} from "@microsoft/fast-foundation";
import { progressRingStyles as styles } from "./my-progress-ring.styles";

export const myProgressRing = ProgressRing.compose<ProgressRingOptions>({
    baseName: "progress-ring",
    template,
    styles,
    indeterminateIndicator: `...default indeterminate indicator...`,
});
```

## API



### class: `FASTBaseProgress`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name     | Privacy | Type             | Default | Description                      | Inherited From |
| -------- | ------- | ---------------- | ------- | -------------------------------- | -------------- |
| `value`  | public  | `number or null` |         | The value of the progress        |                |
| `min`    | public  | `number`         |         | The minimum value                |                |
| `max`    | public  | `number`         |         | The maximum value                |                |
| `paused` | public  | `boolean`        |         | Indicates the progress is paused |                |

#### Methods

| Name           | Privacy   | Description | Parameters | Return | Inherited From |
| -------------- | --------- | ----------- | ---------- | ------ | -------------- |
| `valueChanged` | protected |             |            | `void` |                |
| `minChanged`   | protected |             |            | `void` |                |
| `maxChanged`   | protected |             |            | `void` |                |

#### Attributes

| Name | Field  | Inherited From |
| ---- | ------ | -------------- |
|      | value  |                |
|      | min    |                |
|      | max    |                |
|      | paused |                |

<hr/>



### class: `FASTProgress`

#### Superclass

| Name               | Module                         | Package |
| ------------------ | ------------------------------ | ------- |
| `FASTBaseProgress` | /src/progress/base-progress.js |         |

#### Fields

| Name     | Privacy | Type             | Default | Description                      | Inherited From   |
| -------- | ------- | ---------------- | ------- | -------------------------------- | ---------------- |
| `value`  | public  | `number or null` |         | The value of the progress        | FASTBaseProgress |
| `min`    | public  | `number`         |         | The minimum value                | FASTBaseProgress |
| `max`    | public  | `number`         |         | The maximum value                | FASTBaseProgress |
| `paused` | public  | `boolean`        |         | Indicates the progress is paused | FASTBaseProgress |

#### Methods

| Name           | Privacy   | Description | Parameters | Return | Inherited From   |
| -------------- | --------- | ----------- | ---------- | ------ | ---------------- |
| `valueChanged` | protected |             |            | `void` | FASTBaseProgress |
| `minChanged`   | protected |             |            | `void` | FASTBaseProgress |
| `maxChanged`   | protected |             |            | `void` | FASTBaseProgress |

#### Attributes

| Name | Field | Inherited From   |
| ---- | ----- | ---------------- |
|      | value | FASTBaseProgress |

#### CSS Parts

| Name            | Description                 |
| --------------- | --------------------------- |
| `determinate`   | The determinate indicator   |
| `indeterminate` | The indeterminate indicator |

#### Slots

| Name            | Description                              |
| --------------- | ---------------------------------------- |
| `determinate`   | The slot for the determinate indicator   |
| `indeterminate` | The slot for the indeterminate indicator |

<hr/>


## Additional resources

* [Component explorer examples for `progress`](https://explore.fast.design/components/fast-progress)
* [Component explorer examples for `progress-ring`](https://explore.fast.design/components/fast-progress-ring)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/progress/progress.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#progressbar)