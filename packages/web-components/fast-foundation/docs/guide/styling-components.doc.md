---
id: styling-components
title: Styling Components
sidebar_label: Styling Components
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/docs/guide/styling-components.doc.md
---

## Design System
In FAST, the *design system* is a collection of properties and values that inform the visual design language of the components. These properties are managed and provided through implementations of the *DesignSystemProvider*. See the [*DesignSystemProvider* documentation](https://github.com/microsoft/fast-dna/tree/master/packages/web-components/fast-foundation/src/design-system-provider) for more information.

For the purposes of this section, the *DesignSystemProvider* is a Custom Element that will create CSS Custom Properties that can be consumed by component stylesheets and provide mechanisms to synchronize, update, and consume those properties programmatically.

### Type Ramp
The FAST type ramp is exposed by the `FASTDesignSystemProvider` as CSS Custom Properties. It centers the ramp around a _base_ font size and line-height, ascending and descending from the _base_. The CSS Custom Properties that can be used are:

| Level   | Font Size Custom Property Name  | Line Height Custom Property Name  |
|---------|---------------------------------|-----------------------------------|
| Minus 2 | `--type-ramp-minus-2-font-size` | `--type-ramp-minus-2-line-height` |
| Minus 1 | `--type-ramp-minus-1-font-size` | `--type-ramp-minus-1-line-height` |
| Base    | `--type-ramp-base-font-size`    | `--type-ramp-base-line-height`    |
| Plus 1  | `--type-ramp-plus-1-font-size`  | `--type-ramp-plus-1-line-height`  |
| Plus 2  | `--type-ramp-plus-2-font-size`  | `--type-ramp-plus-2-line-height`  |
| Plus 3  | `--type-ramp-plus-3-font-size`  | `--type-ramp-plus-3-line-height`  |
| Plus 4  | `--type-ramp-plus-4-font-size`  | `--type-ramp-plus-4-line-height`  |
| Plus 5  | `--type-ramp-plus-5-font-size`  | `--type-ramp-plus-5-line-height`  |
| Plus 6  | `--type-ramp-plus-6-font-size`  | `--type-ramp-plus-6-line-height`  |

## Hiding Undefined Elements
Custom Elements that have not been [upgraded](https://developers.google.com/web/fundamentals/web-components/customelements#upgrades) and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a *flash of un-styled content* (FOUC) you should be sure to visually hide Custom Elements if they have not been *defined*:

```CSS
:not(:defined) {
    visibility: hidden;
}
```
Note, this will need to be applied by the consuming application and will not be applied by the components themselves.

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