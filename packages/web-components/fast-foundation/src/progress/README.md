# usage

## fast-progress
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

## fast-progress-ring
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