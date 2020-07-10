---
id: match-media-stylesheets
title: MatchMedia Stylesheets
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-components/docs/design/match-media-stylesheets.md
---

FAST exposes a mechanism to attach stylesheets conditionally based on a [MatchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) query.

### MatchMedia stylesheets

`MatchMediaStylesheetBehavior` can be used to attach a stylesheet when a [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) matches and detach it when the query un-matches.

__Example: Constructing the `MatchMediaStyleSheetBehavior`__
```ts
import { MatchMediaStyleSheetBehavior } from "@microsoft/fast-foundation";

const mobileStylesheetBehavior = new MatchMediaStyleSheetBehavior(
    Window.matchMedia('(max-width: 600px)'),
    css`
        body {
            color: red;
        }
    `
));

const styles = css`
    /* ... */
`.withBehaviors(
    mobileStylesheetBehavior    
)
```

`MatchMediaStyleSheetBehavior` can also be used to curry the [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList). This can be useful for defining commonly-used `MatchMediaStyleSheetBehavior`:

__Example: Re-using a commonly used query__
```ts
import { MatchMediaStyleSheetBehavior } from "@microsoft/fast-foundation";

const mobileStylesheetBehavior = MatchMediaStyleSheetBehavior.with(
    Window.matchMedia('(max-width: 600px)')
);
const styles = css`
    /* ... */
`.withBehaviors(
    mobileStylesheetBehavior(css`
        body {
            color: red;
        }
    `)
)
```

### Forced-colors stylesheets

FAST has a commitment to facilitating accessible web experiences and [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) support is a core tenant of that commitment. `@microsoft/fast-components` exports the `forcedColorsStylesheetBehavior` utility to provide a simple mechanism to apply forced-color stylesheets without bloating the component stylesheet in non-forced-color environments. This Behavior is built using [MatchMedia Stylesheets](#matchmedia-stylesheets).

__Example: Forced-colors stylesheets__
```ts
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