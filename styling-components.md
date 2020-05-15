# Component styling

## Hiding elements that have not been upgraded
Custom Elements that have not been [upgraded](https://developers.google.com/web/fundamentals/web-components/customelements#upgrades) and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a *flash of un-styled content* (FOUC) you should be sure to visually hide Custom Elements if they have not been *defined*:

```css
:not(:defined) {
    visibility: hidden;
}
```
Note, this will need to be applied by the consuming application and will not be applied by the components themselves.

## Design System
In FAST, the *design system* is a collection of properties and values that inform the visual design language of the components. These properties are managed and broadcast through implementations of the *DesignSystemProvider*. See the [*DesignSystemProvider* documentation](https://github.com/microsoft/fast-dna/tree/master/packages/web-components/fast-foundation/src/design-system-provider) for more information.

For the purposes of this section, the *DesignSystemProvider* will create CSS Custom Properties that can be consumed by component stylesheets and provide mechanisms to synchronize, update, and consume those properties programmatically.

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