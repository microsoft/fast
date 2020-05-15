# Component styling

## Design System
## CSS Custom Properties

## Type Ramp
## Media Queries
### CSS @media
[CSS @media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media) are incredibly useful for conditionally applying CSS rules based on the rendering environment. Media queries can be used directly and predictably when defining CSS using the [`css`](https://github.com/microsoft/fast-dna/blob/master/packages/web-components/fast-element/docs/guide/building-components.md#defining-css) tagged template literal exposed by `@microsoft/fast-element`.

__Example: Using a standard media query__
```js
import { css } from "@microsoft/fast-element";

const styles = css`
    @media only screen and (max-width: 600px) {
        body {
            color: red;
        }
    }
`
```

### MatchMedia Stylesheets
`@microsoft/fast-foundation` exposes a separate mechanism to conditionally attach CSS based on the [`Window.matchMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API.

__Example: Using the `matchMediaStylesheetBehaviorFactory__
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

The above example and the [@media](#css-@media) example are functionally equivalent but there is an important distinction; the `matchMediaStylesheetBehavior` sheet is not *applied* to the element until the media query matches. This can be important in use-cases where media queries apply significant amounts of CSS, such as [#forced-colors-style-sheets](Forced-colors Stylesheets).

### Forced-colors Stylesheets
FAST has a commitment to facilitating accessible web experiences and [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) support is a core tenant of that commitment. `@microsoft/fast-components` exports the `forcedColorsStylesheetBehavior` utility to provide a simple mechanism to apply forced-color stylesheets without bloating the component stylesheet in non-forced-color environments:

__Example: Forced-colors stylesheets
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

## Hiding elements that have not been upgraded
Custom Elements that have not been upgraded and don't have styles attached are still rendered by the browser - but they likely do not look how they are supposed to. To avoid a Flash of un-styled Content (FOUC) you should be sure to visually hide Custom Elements if they have not been *defined*:

```css
:not(:defined) {
    visibility: hidden;
}
```
Note, this will need to be applied by the consuming application and will not be applied by the components themselves.