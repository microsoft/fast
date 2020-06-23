---
id: match-media-stylesheets
title: MatchMedia Stylesheets
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-components/docs/design/match-media-stylesheets.md
---

FAST exposes a mechanism to attach stylesheets conditionally based on a [MatchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) query.

### MatchMedia stylesheets

`matchMediaStylesheetBehaviorFactory` can be used to construct a Behavior that will conditionally attach stylesheets based on the `matches` property of a [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList).

__Example: Using the `matchMediaStylesheetBehaviorFactory`__
```js
import { matchMediaStylesheetBehaviorFactory } from "@microsoft/fast-foundation";
const query = Window.matchMedia('(max-width: 600px)');
const maxWidthStylesheetBehavior = matchMediaStylesheetBehaviorFactory(query)
const styles = css`
    /* ... */
`.withBehaviors(
    maxWidthStylesheetBehavior(css`
        body {
            color: red;
        }
    `)
)
```

### Forced-colors stylesheets

FAST has a commitment to facilitating accessible web experiences and [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) support is a core tenant of that commitment. `@microsoft/fast-components` exports the `forcedColorsStylesheetBehavior` utility to provide a simple mechanism to apply forced-color stylesheets without bloating the component stylesheet in non-forced-color environments. This Behavior is built using [MatchMedia Stylesheets](#matchmedia-stylesheets).

__Example: Forced-colors stylesheets__
```js
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
const styles = css`
    /* ... */
`.withBehaviors(
    forcedColorsStylesheetBehavior(css`
        :host {
            background: ${SystemColors.Canvas};
            color: ${SystemColors.CanvasText};
        }
        /* ... */
    `)
)
```


