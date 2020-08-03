# Anchored region

## Overview

An *anchored region* is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative to another "anchor" element.  Additionally, the *anchored region* can react to the available space between the anchor and a parent ["viewport"](https://developer.mozilla.org/en-US/docs/Glossary/viewport) element such that the region is placed on the side of the anchor with the most available space, or even resize itself based on that space.

### Use Cases

It is envisioned that this component would be used as a building block for other components in this library who need to position elements relative to another HTMLElement(select, flyout, tooltip, etc) as well as being available for standalone use in responsive layouts.

### Features

- **Relative positioning:** Users can use it to position an element relative to another another element, like enabling a menu to open above or below a trigger button. Additonally, the same anchored region can change which element it is anchored to dynamically, for example a single tooltip instance in a page could be positioned next to any other element on the page by switching the anchor property of the anchored region that contains it.

- **Responsive positioning:** Users can use it to position an element relative to another element based on available space, for example a menu could open upwards if the trigger button is near the bottom of the page, and downwards if it is nearer the top.

- **Responsive scaling:** Users can use it to create a layout region that dynamically sizes depending on space between the anchor and the viewport elements.


For a more in-depth understanding of how this component works under the covers please refer to the [intersection observer api](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). 

### Risks and Challenges
- see discussion of `getBoundingClientRect` usage in the "Performance" section below.

---

## Design

### Relative placement: 'Inset' vs 'Adjacent';
By default the anchored region is positioned adjacent to the element it is anchored to, but if the "horizontal-inset" or "vertical-inset" attributes are set then the region will be 'inset' and overlap the anchor on that axis.  Various combinations of these attributes can enable some commonly desired layouts.  In the following images the menu would be conidered to be the *anchored region* and the "Select an option" button the anchor.

| State | Image |
| ----- | ----- |
| Adjacent vertically and inset horizontally can be used for a typical drop down menu: | ![](./images/inset-adjacent.png) |
| Inset vertically and adjacent horizontally positions the region to the side of the anchor button: | ![](./images/adjacent-inset.png) |
| Inset on both axis positions the region so that it overlaps the anchor: | ![](./images/inset-inset.png) |
| Adjacent on both axis positions the region diagonally to the anchor: | ![](./images/adjacent-adjacent.png)|



### Markup Examples
(note: examples are for the vertical axis, equivalent is true for horizontal)

A region that always renders above the anchor element.
```
<div id="viewport">
    ...stuff...
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="locktodefault"
        vertical-default-position="top"
    >
      This shows up above the button
    </fast-anchored-region>
    ...stuff...
</div>

```

A region that renders above or below the anchor depending on available space.
```
<div id="viewport">
    ...stuff...
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="dynamic"
    >
      This shows up above or below the anchor depending on available space
    </fast-anchored-region>
    ...stuff...
</div>

```

A region that renders above or below the anchor depending on available space but only on initial layout.
```
<div id="viewport">
    ...stuff...
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="onetime"
    >
      This shows up above or below the anchor depending on available space
    </fast-anchored-region>
    ...stuff...
</div>

```

A region that overlaps the anchor and renders above or below it depending on available space.

```
<div id="viewport">
    ...stuff...
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="dynamic"
        vertical-inset="true"
    >
      This overlaps the anchor and extends above or below it depending on available space.
    </fast-anchored-region>
    ...stuff...
</div>

```

A region renders above or below the anchor based on available space and is sized to match the available.

```
<div id="viewport">
    ...stuff...
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="dynamic"
        vertical-scaling-enabled="true"
    >
       This region renders above or below the anchor based on available space and sizes itself to match.
    </fast-anchored-region>
    ...stuff...
</div>

```

A region that renders below the anchor until that space is less than 100px.
```
<div id="viewport">
    ...stuff...
    <button id="anchor">
        Button is an anchor
    </button>
    <fast-anchored-region
        anchor="anchor"
        vertical-positioning-mode="dynamic"
        vertical-default-position="below"
        vertical-threshold="100"
    >
      This shows renders below the anchor as long as there is at least 100px available there.
    </fast-anchored-region>
    ...stuff...
</div>
```

The anchored region can be configured to scale to either the size of the content in its slot, to the size of the element it is anchored to, or the available space between the anchor and the edge of the viewport element by setting the vertical/horizontal scaling attribute:
- "anchor" - size to match anchor
- "fill" - size to match space between the anchor and the viewport edge
- "content" - the default, matches the size of the content in the region's slot. 

The dimensions of the anchored region will match the dimensions of the content unless scaling is enabled on a particular axis (verticalscalingenabled & horizontalscalingenabled) in which case it will fill all available space between the anchor and viewport.

The component allows users to set a "Positioning Mode" on each axis which defines how the component will behave:
- 'uncontrolled':  The anchored region will appear as it normally would in document flow.
- 'locktodefault': The anchored region will always be placed in the specified default position regardless of available space.  For example a menu that always opens upwards.
- 'dynamic': The anchored region is placed relative to the anchor element based on how much space is available between it and the viewport.  For example a menu that opens opens upwards when it is near the bottom of the page, and downwards when near the top.

### API

NOTE: this component api will not be exposed outside of the fast-components package until we are satisfied that we have the correct implementation for this functionality.  

*Component name:*
- `fast-anchored-region`

*Attributes:*
- anchor - The html id of the HTMLElement used as the anchor around which the positioning region is placed.  This must be set for the component's positioning logic to be active.

- viewport - The ID of the HTMLElement to be used as the viewport used to determine available layout space around the anchor element.  If unset the parent element of the anchored region is used.

- horizontal-positioning-mode - Can be 'uncontrolled', 'locktodefault' or 'dynamic'.  Default is 'uncontrolled'.
- horizontal-default-position - Can be 'start', 'end', 'left', 'right' or 'unset'.  Default is 'unset'
- horizontal-inset - Boolean that indicates whether the region should overlap the anchor on the horizontal axis. Default is false which places the region adjacent to the anchor element.
- horizontal-threshold - Numeric value that defines how small in pixels the region must be to the edge of the viewport to switch to the opposite side of the anchor. The component favors the default position until this value is crossed.  When there is not enough space on either side or the value is unset the side with the most space is chosen.
- horizontal-scaling - Can be "anchor", "fill" or "content". Default is "content" 

- vertical-positioning-mode - Can be 'uncontrolled', 'locktodefault' or 'dynamic'.  Default is 'uncontrolled'.
- vertical-default-position - Can be 'top', 'bottom' or 'unset'. Default is unset.
- vertical-inset - Boolean that indicates whether the region should overlap the anchor on the vertical axis. Default is false which places the region adjacent to the anchor element.
- vertical-threshold - Numeric value that defines how small the region must be to the edge of the viewport to switch to the opposite side of the anchor. The component favors the default position until this value is crossed.  When there is not enough space on either side or the value is unset the side with the most space is chosen.
- vertical-scaling - Can be 'anchor', 'fill' or 'content'. Default is 'content' 
- use-gbcr - Whether the component uses calls to `getBoundingClientRect` to calculate positioning. Can be 'default', 'always' or 'never'.  Default behavior attempts to use gbcr if the initial attempt to use [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) fails to return usable data. 

*Properties:*
- anchorElement - Holds a reference to the HTMLElement currently being used as the anchor.  Can be set directly or be populated by setting the anchor attribute.

- viewportElement - Holds a reference to the HTMLElement currently being used as the viewport.  Can be set directly or be populated by setting the anchor attribute.

*Slots:*
- default slot for content

*functions:*
- default slot for content

*Events:*
- updateAnchorOffset = (
    horizontalOffsetDelta: number,
    verticalOffsetDelta: number
) 

Enables developers to update the offset between the anchor and the region as it changes,  for example to promt layout recalculations as a result of scrolling so a scaling region tracks the viewport boundary.  



### Anatomy and Appearance
**Structure:**

The anchored region is essentially a container around the slotted items.

```
    <template>
        ${when(
            x => x.initialLayoutComplete,
            html<AnchoredRegion>`
                <slot></slot>
            `
        )}
    </template>
```

## Implementation

### States
Layout update checks in the component happen when:
- intersection observer reports a collision with the viewport
- resize observer reports a resize event on the anchor, the viewport, the component's `offsetParent` or the component itself.

These layout checks analyse the DOM geometry based on callbacks and repositions the anchored region appropriately: top/bottom/unset for the vertical axis and left/right/unset for the horizontal axis. 

The component will have an initialization state to determine placement where the instanciation of content will be delayed by one frame to give the component a chance to get placed correctly.  This is to avoid content triggering the browser's scroll into view behavior prematurely if a contained element gains focus immediately.

### Accessibility
None required.  Basically a positioned div that authors can decorate for accessibility if required.

### Globalization
Authors may want to change default position from left to right or vice versa based on rtl settings, but that can't be predicted by the component itself.

### Performance
The component needs information about the geometry of the surrounding DOM in order to function and it acquires this through either [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) events or calls to `getBoundingClientRect`.  

By default the component relies on observer events, but in some cases that data may not be usable such as when there is an intervening element in the DOM hierarchy between the viewport and the anchor or the region itself.  When the component detects this condition it is able to fall back to expensive calls to `getBoundingClientRect`.

Developers can use the "use-gbcr" attribute to limit this behavior to either always use calls to `getBoundingClientRect` to skip the cost of even trying to use the observer to begin with, or 'never' to block gbcr completely (presumably changing other aspects of their layout to allow the observer to function).

### Dependencies
[IntersectionObserver api](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) is unsupported on IE, and [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is unsupported on IE, Safari and Firefox.  Both are required by the component.  Authors who wish to use this component on these platforms will need to use polyfills.


### Test Plan
TBD

## Next Steps
- investigate perf improvements

