# Tooltip

## Overview

A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out.

### Use Cases

Tooltips are often used to supplement UI elements and provide additional information. Tooltips will often provide accessible names or add additional context to other UI components (such as icon buttons). While tooltips are natively provided to elements via the title attribute, they are notoriously difficult to style. Additionally, they are only invoked on hover and not on focus.

### Non-goals
Tooltip widgets do not receive focus. A hover that contains focusable elements can be made using a non-modal dialog (flyout).

### Prior Art/Examples
- [Lightning Design](https://www.lightningdesignsystem.com/components/tooltips/)
- [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/tooltip)
- [Evergreen](https://evergreen.segment.com/components/tooltip/)
- [Carbon Design](https://www.carbondesignsystem.com/components/tooltip/code/)
- [Ant Design](https://ant.design/components/tooltip/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/tooltip)
- [Bootstrap](https://getbootstrap.com/docs/4.3/components/tooltips/)

---

### API

*Component name:*
- `fast-tooltip`

*Attributes:*
- `anchor` - The html id of the HTMLElement which the tooltip is attached to.
- `delay` - time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.
- `visible` - the visiblity of the tooltip
- `position` - enum; where the tooltip should appear relative to its target.
    - bottom
    - left
    - right
    - top

*Properties:*
- `anchorElement` - Holds a reference to the HTMLElement currently being used as the anchor. Can be set directly or be populated by setting the anchor attribute.

*Slots:*
- `default`

*Events*
- dismiss - event fired when a user presses escape

### Anatomy and Appearance

*Template:*
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

This component depends on Fast Element and should be positioned using [anchored region](./anchored-region/anchored-region.md).
