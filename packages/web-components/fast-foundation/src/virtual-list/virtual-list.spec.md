# Virtual List

## Overview

The `virtual-list` component enables authors to display an array of data objects as a horizontal or vertical list.  Authors will specify a `viewTemplate` that each object will be bound to for rendering.  

Additionally, the component is able to render only the elements in or near a 'viewport' element that the author can specify.  This virtualization capability enables the component to display large collections of data effectively.  


### Use Cases

- A developer wants to display an array of data with templates.
- A developer want to display a very large number of items while maintaining a fast and responsive ui.

### How it works

Whenever prompted to update its layout, either by having the `update()` function called or by one of the events specified by the current `auto-update-mode` setting, the component will request position updates for the viewport element and its internal item container from the intersection service.

When the positioning information is updated on the next frame the component determines which portion of the item container overlaps with the viewport and calculates which items would fall into that range.  Those items are then used to populate the observable `visibleItems` property which is bound to a repeat directive which renders the visible items using the provided `itemTemplate`.  

The component also populates a `visibleItemSpans` observable property with the positioning information for each object in the `visibleItems` array using the SpanMap interface.    

```
export interface SpanMap {
    start: number;
    end: number;
    span: number;
}
```

The item templates can then bind to the appropriate `SpanMap` using its index and use that to position itself correctly in the layout.

```
const defaultItemTemplate: ViewTemplate<any> = html`
    <div
        style="
            overflow-wrap: anywhere;
            overflow: hidden;
            position: absolute;
            height:  ${(x, c) =>
            c.parent.orientation === Orientation.vertical
                ? `${c.parent.visibleItemSpans[c.index]?.span}px`
                : `100%`};
            width:  ${(x, c) =>
            c.parent.orientation === Orientation.vertical
                ? `100%`
                : `${c.parent.visibleItemSpans[c.index]?.span}px`};
            transform: ${(x, c) =>
            c.parent.orientation === Orientation.horizontal
                ? `translateX(${c.parent.visibleItemSpans[c.index]?.start}px)`
                : `translateY(${c.parent.visibleItemSpans[c.index]?.start}px)`};
        "
    >
        ${x => JSON.stringify(x)}
    </div>
```

### Non-goals

- The first version of the component uses native scroll bars which have upper limits in terms of how tall/wide the scrollable region can be before scrolling fails.  It's a big number and may vary from browser to browser.  TODO: add numbers.

- Variable span elements will not be supported in the first iteration, but should be added later to support virtualizing tree-view component, for example.

### API

_Component name:_

- `fast-virtual-list`

_Attributes:_

- `virtualize` - Boolean flag that indicates whether the component should 'virtualize' out of view items.  Default is true.  When false all items are always rendered.

- `viewport` - The string ID of the HTMLElement to be used as the 'viewport'. Used to determine which elements should render when virtualizing.

- `item-span` - The size in pixels of each item along the choosen axis (ie. vertical or horizontal).  Default is 50.

- `viewport-buffer` - Defines an area in pixels on either end of the viewport where items outside the viewport will still be rendered.

- `orientation` - Whether the list is oriented vertically or horizontally. Default is vertical.

- `auto-update-mode` - Auto update mode defines what prompts the component to check the dimensions of elements in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.  Default is 'manual'.  Note that an 

    - manual: checks only when update() is called.
    - viewport-resize: checks on viewport resize.
    - auto: checks on viewport resize as well as any bubbled scroll/resize events 


_Properties:_

-  `items` -  The array of objects to be displayed.

-  `viewportElement` -  The HTML element being used as the viewport.

-  `itemTemplate` -  The ViewTemplate used to render items.

_Slots:_

-   `default`

_Events_

-   `rendered-range-change` - Event fired when the range of items being rendered changes.


### Anatomy and Appearance

_Template:_

```
<template>
    <div
        class="container"
        part="container"
    >
    <slot></slot>
    </div>
</template>
```

## Implementation

```
<fast-virtual-list
    orientation="horizontal"
    item-span="200"
    viewport-buffer="800"
    auto-update-mode="auto"
></fast-virtual-list>

```

Note that the viewTemplate and items properties must be set via JS:
        myVirtualList.itemTemplate = myItemTemplate;
        myVirtualList.items = [{name: "John", age: 30}, {name: "Jane", age: 29} ];

### Accessibility

Dependant on implementations (ie. authors would need to provide accessible item templates, assign appropriate roles, etc... based on how they are using the component).  

### Dependencies

This component depends on Fast Element.
