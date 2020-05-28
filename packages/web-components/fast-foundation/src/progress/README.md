---
id: fast-progress
title: fast-progress
sidebar_label: fast-progress
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/progress/README.md
---
Progress components are used to display the length of time a process will take or to visualize percentage value (referred to as a **determinate** state) and to represent an unspecified wait time (referred to as an **indeterminate** state). For progress components which have a linear visual appearance, use `fast-progress`. For progress implementations which are circular, use `fast-progress-ring`.

## Applying Custom Styles

### fast-progress

```ts
import { customElement } from "@microsoft/fast-element";
import { BaseProgress, ProgressTemplate as template } from "@microsoft/fast-foundation";
import { ProgressStyles as styles } from "./progress.styles";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
export class FASTProgress extends BaseProgress {}
```

### fast-progress-ring

```ts
import { customElement } from "@microsoft/fast-element";
import { BaseProgressRing, ProgressRingTemplate as template } from "@microsoft/fast-foundation";
import { ProgressStyles as styles } from "./progress-ring.styles";

@customElement({
    name: "fast-progress",
    template,
    styles,
})
export class FASTProgressRing extends BaseProgressRing {}
```

## Usage

### fast-progress

```html
    <fast-progress min="0" max="100" value="75"></fast-progress>
```

### fast-progress-ring

```html
    <fast-progress-ring paused="true" min="0" max="100" value="75"></fast-progress-ring>
```