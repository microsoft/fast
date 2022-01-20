# Virtual List

## Overview

The `virtual-list` component enables authors to display an array of data objects as a horizontal or vertical list.  Authors will specify a `viewTemplate` that each object will be bound to for rendering.  

Additionally, the component is able to render only the elements in or near a 'viewport' element that the author can specify.  This virtualization capability enables the component to display large collections of data effectively.  


### Use Cases

- A developer wants to display an array of data with templates.
- A developer want to display a very large number of items while maintaining a fast and responsive ui.

### Features


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

- `auto-update-mode` - Auto update mode defines what prompts the component to check the dimensions of elements in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.  Default is 'manual'.



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
