# Tooltip

## Overview

A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out.

### Use Cases

Tooltips are often used to supplement UI elements and provide additional information. Tooltips will often provide accessible names or add additional context to other UI components (such as icon buttons). While tooltips are natively provided to elements via the title attribute, they are notoriously difficult to style. Additionally, they are only invoked on hover and not on focus.

### Non-goals

Tooltip widgets do not receive focus. A hover that contains focusable elements can be made using a non-modal dialog (flyout).

### Prior Art/Examples

-   [Lightning Design](https://www.lightningdesignsystem.com/components/tooltips/)
-   [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/tooltip)
-   [Evergreen](https://evergreen.segment.com/components/tooltip/)
-   [Carbon Design](https://www.carbondesignsystem.com/components/tooltip/code/)
-   [Ant Design](https://ant.design/components/tooltip/)
-   [Atlassian](https://atlaskit.atlassian.com/packages/core/tooltip)
-   [Bootstrap](https://getbootstrap.com/docs/4.3/components/tooltips/)

---

### API

_Component name:_

-   `fast-tooltip`

_Attributes:_

-   `anchor` - The html id of the HTMLElement which the tooltip is attached to.
-   `show` - boolean value to toggle the visibility of the tooltip (defaults to `undefined`). When `undefined`, the tooltip will only be visible when the anchor element is hovered or focused.
-   `placement` - The placement of the tooltip relative to the anchor element. Available values:

    | Value          | Placement                                                                                                                                                   |
    | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `top`          | The tooltip is positioned above the anchor element, with the center of the tooltip aligned to the center of the anchor element.                             |
    | `top-start`    | The tooltip is positioned above the anchor element, with the left edge of the tooltip aligned to the left edge of the anchor element.                       |
    | `top-end`      | The tooltip is positioned above the anchor element, with the right edge of the tooltip aligned to the right edge of the anchor element.                     |
    | `right`        | The tooltip is positioned to the right of the anchor element, with the vertical center of the tooltip aligned to the vertical center of the anchor element. |
    | `right-start`  | The tooltip is positioned to the right of the anchor element, with the top edge of the tooltip aligned to the top edge of the anchor element.               |
    | `right-end`    | The tooltip is positioned to the right of the anchor element, with the bottom edge of the tooltip aligned to the bottom edge of the anchor element.         |
    | `bottom`       | The tooltip is positioned below the anchor element, with the right edge of the tooltip aligned to the right edge of the anchor element.                     |
    | `bottom-start` | The tooltip is positioned below the anchor element, with the left edge of the tooltip aligned to the left edge of the anchor element.                       |
    | `bottom-end`   | The tooltip is positioned below the anchor element, with the horizontal center of the tooltip aligned to the horizontal center of the anchor element.       |
    | `left`         | The tooltip is positioned to the left of the anchor element, with the vertical center of the tooltip aligned to the vertical center of the anchor element.  |
    | `left-start`   | The tooltip is positioned to the left of the anchor element, with the top edge of the tooltip aligned to the top edge of the anchor element.                |
    | `left-end`     | The tooltip is positioned to the left of the anchor element, with the bottom edge of the tooltip aligned to the bottom edge of the anchor element.          |

_Properties:_

-   `anchorElement` - Holds a reference to the HTMLElement currently being used as the anchor. Can be set directly or be populated by setting the anchor attribute.
-   `visible` - Returns the current visibility of the tooltip.

_Slots:_

-   `default`

_Events_

-   `dismiss` - Event fired when a user presses escape

### Anatomy and Appearance

_Template:_

```html
<template role="tooltip">
    <slot></slot>
</template>
```

## Implementation

```html
<button id="foo" aria-describedby="tooltip">Foo</button>
<fast-tooltip anchor="foo" id="tooltip">
    This is a tooltip. It does not receive focus.
</fast-tooltip>
```

### Accessibility

The interaction model for the tooltip should map to the [W3C interaction model](https://w3c.github.io/aria-practices/#tooltip).

Two important things to note:

1. Focus stays on the triggering element while the tooltip is displayed.
2. If the tooltip is invoked when the trigger element receives focus, then it is dismissed when it no longer has focus (onBlur). If the tooltip is invoked with mouseIn, then it is dismissed with on mouseOut.
