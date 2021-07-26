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
-   `delay` - time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.
-   `visible` - boolean value to toggle the visibility of the tooltip (defaults to undefined).
-   `position` - where the tooltip should appear relative to its target. 'start' and 'end' are like 'left' and 'right' but are inverted when the direction is 'rtl' When the position is undefined the tooltip is placed above or below the anchor based on available space.
    -   top
    -   bottom
    -   left
    -   right
    -   start
    -   end

- auto-update-mode - Corresponds to anchored region's auto update mode and governs when the tooltip checks its position.  Default is "auto".

_Properties:_

-   `anchorElement` - Holds a reference to the HTMLElement currently being used as the anchor. Can be set directly or be populated by setting the anchor attribute.

_Slots:_

-   `default`

_Events_

-   `dismiss` - Event fired when a user presses escape

_functions_

-   `createTooltipTemplate(string: prefix)` - Generates a `ViewTemplate` for the tooltip based on the provided prefix (ie. "fast", "fluent", etc...). This is required because tooltip uses an `anchored-region` internally and the create function generates a template using the appropriate `anchored-region` tag (ie. "fast-anchored-region" vs. "fluent-anchored-region", for example). Note that the appropriate `anchored-region` component must also be declared.

### Anatomy and Appearance

_Template:_

```
<template
    role="tooltip"
>
    <slot></slot>
</template>
```

## Implementation

```
<button id="foo" aria-describedby="tooltip">Foo</button>
<fast-tooltip anchor="foo" id="tooltip">This is a tooltip. It does not recieve focus.</fast-tooltip>
```

### Accessibility

The interaction model for the tooltip should map to the [W3C interaction model](https://w3c.github.io/aria-practices/#tooltip).

Two important things to note:

1. Focus stays on the triggering element while the tooltip is displayed.
2. If the tooltip is invoked when the trigger element receives focus, then it is dismissed when it no longer has focus (onBlur). If the tooltip is invoked with mouseIn, then it is dismissed with on mouseOut.

### Dependencies

This component depends on Fast Element and should be positioned using [anchored region](../anchored-region/anchored-region.spec.md).
