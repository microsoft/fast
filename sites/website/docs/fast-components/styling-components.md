

For the purposes of this section, just know the *DesignSystemProvider* is a Custom Element that will create CSS Custom Properties that can be consumed by component stylesheets and provide mechanisms to synchronize, update, and consume those properties programmatically.

### Type Ramp
The FAST type ramp is exposed by the `FASTDesignSystemProvider` as CSS Custom Properties. It organizes the ramp around a _base_ font size and line-height, ascending and descending from the _base_. The CSS Custom Properties that can be used are:

| Level              | Font Size                       | Line Height                      |
|--------------------|---------------------------------|----------------------------------|
| Minus 2 (smallest) | `--type-ramp-minus-2-font-size` | `--type-ramp-minus-2-line-height`|
| Minus 1            | `--type-ramp-minus-1-font-size` | `--type-ramp-minus-1-line-height`|
| Base (body)        | `--type-ramp-base-font-size`    | `--type-ramp-base-line-height`   |
| Plus 1             | `--type-ramp-plus-1-font-size`  | `--type-ramp-plus-1-line-height` |
| Plus 2             | `--type-ramp-plus-2-font-size`  | `--type-ramp-plus-2-line-height` |
| Plus 3             | `--type-ramp-plus-3-font-size`  | `--type-ramp-plus-3-line-height` |
| Plus 4             | `--type-ramp-plus-4-font-size`  | `--type-ramp-plus-4-line-height` |
| Plus 5             | `--type-ramp-plus-5-font-size`  | `--type-ramp-plus-5-line-height` |
| Plus 6 (largest)   | `--type-ramp-plus-6-font-size`  | `--type-ramp-plus-6-line-height` |

### Design System Properties
The following properties are provided by the `FASTDesignSystemProvider` and should be used as appropriate.

| Name                                   | Type | Description   |
|----------------------------------------|--------------------  |----------------------------------------------------------------------------|
| `--background-color`                   | `string` (hex color) | Defines the background color of the node. This is used by color recipes and should represent the color UI is rendering on for a given node tree. |
| `--density`                            | `number`             | A multiplier to control the density of UI elements.                        |
| `--design-unit`                        | `number`             | The core sizing unit that all sizes are derived from.                      |
| `--base-height-multiplier`             | `number`             | The number of design units used for component height at the base density.   |
| `--base-horizontal-spacing-multiplier` | `number`             | The number of design units used for horizontal spacing at the base density. |
| `--corner-radius`                      | `number`             | The corner radius of controls.                                             |
| `--outline-width`                      | `number`             | The width of the outline of outline controls.                              |
| `--focus-outline-width`                | `number`             | The width of the focus indicator.                                             |
| `--disabled-opacity`                   | `number`             | Opacity of disabled controls.                                              |

## Conditional Stylesheets
### Forced-colors Stylesheets
FAST has a commitment to facilitating accessible web experiences and [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) support is a core tenant of that commitment. `@microsoft/fast-components` exports the `forcedColorsStylesheetBehavior` utility to provide a simple mechanism to apply forced-color stylesheets without bloating the component stylesheet in non-forced-color environments:

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

### MatchMedia Stylesheets
`forcedColorsStylesheetBehavior` builds is an implementation of the `matchMediaStylesheetBehaviorFactory`, which can be used to create custom implementations of stylesheets that will be conditionally attached based on a [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList).

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