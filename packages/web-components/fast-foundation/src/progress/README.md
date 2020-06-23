---
id: progress
title: fast-progress
sidebar_label: progress
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/progress/README.md
---

Progress components are used to indicate the length of time a process will take. This may either be as a determinate state in which the progress is a percentage of the total time needed to complete the task or as an indeterminate state where the wait time is unspecified. For progress components which have a linear visual appearance, use `fast-progress`. For progress implementations which are circular, use `fast-progress-ring`.

## Usage

### fast-progress

```html live
<fast-design-system-provider use-defaults>
    <fast-progress min="0" max="100" value="75"></fast-progress>
</fast-design-system-provider>
```

### fast-progress-ring

```html live
<fast-design-system-provider use-defaults>
    <fast-progress-ring min="0" max="100" value="75"></fast-progress-ring>
</fast-design-system-provider>
```

## Applying custom styles

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