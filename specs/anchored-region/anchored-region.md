# Anchored region

## Overview

An *anchored region* is a container component which enables authors to create layouts where the contents of the anchored region can be positioned relative to another "anchor" element.  Additionally, the *anchored region* can react to the available space between the anchor and a parent ["viewport"](https://developer.mozilla.org/en-US/docs/Glossary/viewport) element such that the region is placed on the side of the anchor with the most available space, or even resize itself based on that space.

### Background

This component is inspired by the ["Viewport positioner"](https://github.com/microsoft/fast-dna/tree/master/packages/fast-components-react-base/src/viewport-positioner)  component in the React component set.  It is used as a building block in other components to enable responsive flyouts, or positionable/scaling menus in the [select](https://github.com/microsoft/fast-dna/tree/master/packages/fast-components-react-base/src/select) component. 

A primary goal of the component was to enable authors to create responsive layouts without resorting to expensive [getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) calls. It instead depends on the more performant [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) and [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) interfaces.

For a more in-depth understanding of how this component works under the covers please refer to the [intersection observer api](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). 

### Use Cases

It is envisioned that this component would be used as a building block for other components in this library (select, flyout, tooltip, etc) as well as being available for standalone use in responsive layouts.

### Features

- **Relative positioning:** Users can use it to position an element relative to another another element directly, like enabling a menu to open above or below a trigger button.

- **Responsive positioning:** Users can use it to position an element relative to another element based on available space, for example a menu could open upwards if the trigger button is near the bottom of the page, and downwards if it is nearer the top.

- **Responsive scaling:** Users can use it to create a layout region that dynamically sizes depending on space between the anchor and the viewport elements.

Note that the "always in view" functionality that existed in Viewport Positioner has been removed as this can be replicated through other means (such as a scaling region with grids, for example).

### Risks and Challenges

This component depends on getting accurate positioning data from the DOM outside of the component and it is possible for authors to break the relationship in advanced scenarios.

Positioning may only be guaranteed if there are no other scrolling containers between the viewport and the anchor/anchored-region.  Authors should avoid nested scrolling containers.

Also, some css settings can interfere with the data returned by intersection observer and break the positioning functionality.  For example an element with position="fixed" in the DOM hierarchy would be a no-no:
```
<div id="viewport">
    <div style="{{position:fixed}}">
        <button id="anchor">
            Button is an anchor
        </button>
        <fast-anchored-region
            viewport="viewport"
            anchor="anchor"
            verticalPositioningMode="locktodefault"
            verticalDefaultPosition="top"
        >
            This won't work because of the fixed element
        </fast-anchored-region>
    <div>
</div>
```

### Prior Art/Examples
- [FAST-DNA React Viewport positioner component](https://github.com/microsoft/fast-dna/tree/master/packages/fast-components-react-base/src/viewport-positioner)

---

## Design

### Relative placement: 'Inset' vs 'Adjacent';
By default the anchored region is positioned adjacent to the element it is anchored to, but if the "horizontal-inset" or "vertical-inset" attributes are set then the region will be 'inset' and overlap the anchor on that axis.  Various combinations of these attributes can enable some commonly desired layouts.  In the following images the menu would be conidered to be the *anchored region* and the "Select an option" button the anchor.

Adjacent vertically and inset horizontally can be used for a typical drop down menu:

![](./images/inset-adjacent.png)

Inset vertically and adjacent horizontally positions the region to the side of the anchor button:

![](./images/adjacent-inset.png)

Inset on both axis positions the region so that it overlaps the anchor:

![](./images/inset-inset.png)

Adjacent on both axis positions the region diagonally to the anchor:

![](./images/adjacent-adjacent.png)



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

The dimensions of the anchored region will match the dimensions of the content unless scaling is enabled on a particular axis (verticalscalingenabled & horizontalscalingenabled) in which case it will fill all available space between the anchor and viewport.

The component allows users to set a "Positioning Mode" on each axis which defines how the component will behave:
- 'uncontrolled':  The anchored region will appear as it normally would in document flow.
- 'locktodefault': The anchored region will always be placed in the specified default position regardless of available space.  For example a menu that always opens upwards.
- 'dynamic': The anchored region is placed relative to the anchor element based on how much space is available between it and the viewport.  For example a menu that opens opens upwards when it is near the bottom of the page, and downwards when near the top.
- 'onetime': As the 'dynamic' option, but position is not changed after initial placement.

### API

*Component name:*
- `fast-anchored-region`

*Attributes:*
- anchor - The html id of the HTMLElement used as the anchor around which the positioning region is placed.  This must be set for the component's positioning logic to be active.

- viewport - Used to identify the HTMLElement used as the viewport the component uses to determine available layout space around the anchor element. Possible values are the id of the desired viewport element, '#document' or '#parent'.  The default value is '#parent'.

- horizontal-positioning-mode - Can be 'uncontrolled', 'locktodefault', 'dynamic' or 'onetime'.  Default is 'uncontrolled'.
- horizontal-default-position - Can be 'start', 'end', 'left', 'right' or 'unset'.  Default is 'unset'
- horizontal-inset - Boolean that indicates whether the region should overlap the anchor on the horizontal axis. Default is false which places the region adjacent to the anchor element.
- horizontal-threshold - Numeric value that defines how small in pixels the region must be to the edge of the viewport to switch to the opposite side of the anchor. The component favors the default position until this value is crossed.  When there is not enough space on either side or the value is unset the side with the most space is chosen.
- horizontal-scaling-enabled - The region is sized from code to match available space, in other scenarios the region gets sized via content size.

- vertical-positioning-mode - Can be 'uncontrolled', 'locktodefault', 'dynamic' or 'onetime'.  Default is 'uncontrolled'.
- vertical-default-position - Can be 'top', 'bottom' or 'unset'. Default is unset.
- vertical-inset - Boolean that indicates whether the region should overlap the anchor on the vertical axis. Default is false which places the region adjacent to the anchor element.
- vertical-threshold - Numeric value that defines how small the region must be to the edge of the viewport to switch to the opposite side of the anchor. The component favors the default position until this value is crossed.  When there is not enough space on either side or the value is unset the side with the most space is chosen.
- vertical-scaling-enabled - The region is sized from code to match available space, in other scenarios the region gets sized via content size.

- horizontal-position - read only, the current horizontal position of the component. Possible values are 'left', 'right' or 'unset'.
- vertical-position - read only, the current vertical position of the component. Possible values are 'top', 'bottom' or 'unset'.

*Slots:*
- default slot for content

*Events:*
- positionchange - event is thrown whenever the placement of the region relative to the anchor changes (top/bottom and left/right). 


### Anatomy and Appearance
**Structure:**
```
<div class="root">
    <slot></slot>
</div>
```

**Appearance:**

Parts:
- root - the root of the anchored-region

---

## Implementation

### States
Layout update checks in the component happen when:
- the viewport scrolls
- intersection observer reports a collision with the viewport
- resize observer reports a resize event on the anchor, the viewport or the component itself.

These layout checks analyse the DOM geometry based on callbacks and repositions the anchored region appropriately: top/bottom/unset for the vertical axis and left/right/unset for the horizontal axis. 

The component will have an initialization state to determine placement where the instanciation of content will be delayed by one frame to give the component a chance to get placed correctly.  This is to avoid content triggering the browser's scroll into view behavior prematurely if a contained element gains focus immediately.

### Accessibility
None required.  Basically a positioned div that authors can decorate for accessibility if required.

### Globalization
Authors may want to change default position from left to right or vice versa based on rtl settings, but that can't be predicted by the component itself.

### Performance
Layout logic could called frequently during scrolling and resize operations so efficient code is a priority here. At a minimum layout recalculations should be limited to once per frame.

### Dependencies
[IntersectionObserver api](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) is unsupported on IE, and [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is unsupported on IE, Safari and Firefox.  Both are required by the component.

Question - do we support a fallback mode that relies on getBoundingClientRect() if the observers are not present? 

### Test Plan
TBD

## Next Steps
- add support for passing references for anchor and viewport as HTMLElements through javascript.

