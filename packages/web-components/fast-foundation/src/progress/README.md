---
id: fast-progress
title: fast-progress
sidebar_label: fast-progress
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/progress/README.md
---

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