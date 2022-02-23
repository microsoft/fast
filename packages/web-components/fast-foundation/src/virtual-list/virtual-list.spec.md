# Virtual List

## Overview

The `virtual-list` component enables authors to display an array of data objects as a horizontal or vertical list.  Authors can specify the templates to use to generate items as well as the template used to render the item contents allowing a high degree of customization and optimization possibilities

Additionally, the component is able to render only the elements in or near a 'viewport' element that the author can specify.  This virtualization capability enables the component to display large collections of data effectively.  


### Use Cases

- A developer wants to display an array of data with templates.
- A developer want to display a very large number of items while maintaining a fast and responsive ui.

### How it works

Whenever prompted to update its layout, either by having the `update()` function called or by one of the events specified by the current `auto-update-mode` setting, the component will request position updates for the viewport element and its internal item container from the intersection service.

When the positioning information is updated on the next frame the component determines which portion of the item container overlaps with the viewport and calculates which items would fall into that range.  Those items are then used to populate the observable `visibleItems` property which is bound to a repeat directive which renders the visible items using the provided `itemTemplate`.  

The component also populates a `visibleItemSpans` observable property with the positioning information for each object in the `visibleItems` array using the SpanMap interface.    

The item templates can then bind to the appropriate `SpanMap` using its index and use that to position itself correctly in the layout.

```
const itemTemplate: ViewTemplate<any> = html`
    <fast-virtual-list-item
        :itemData="${x => x}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        style="
            height:  ${(x, c) => `${c.parent.visibleItemSpans[c.index]?.span}px`};
            transform: ${(x, c) =>
                `translateY(${c.parent.visibleItemSpans[c.index]?.start}px)`};
        "
    >
    </fast-virtual-list-item>
```

Authors can provide a custom 'itemTemplate` to specify what type of "items" are created and how they are positioned - although translate transforms are typically used other approaches, like a grid, could work. 

If no itemTemplate is specifed the list will be populated by `fast-virtual-list-item` elements.  Authors will still need to specify a template to display the data provided in the items array.  This is done using the `listItemContext` property of the virtual list that should be populated with a `VirtualListItemContext` object to set the template:

```
const myContentsTemplate = html`
    <fast-card>
        <div style="margin: 5px 20px 0 20px; color: white">
            ${x => x.itemData.title}
        </div>

        <div
            style="
                height: 160px;
                width:160px;
                margin:10px 20px 10px 20px;
                position: absolute;
                background-image: url('${x => x.itemData.url}');
            "
        ></div>
    </fast-card>
`;

myVirtualList.listItemContext = {
    listItemContentsTemplate: myContentsTemplate,
};
```

### Non-goals

- The first version of the component uses native scroll bars which have upper limits in terms of how tall/wide the scrollable region can be before scrolling fails.  It's a big number and may vary from browser to browser.  TODO: add numbers.

### API

_Component name:_

- `fast-virtual-list`

_Attributes:_

- `virtualize` - Boolean flag that indicates whether the component should 'virtualize' out of view items.  Default is true.  When false all items are always rendered.

- `viewport` - The string ID of the HTMLElement to be used as the 'viewport'. Used to determine which elements should render when virtualizing.

- `item-span` - The size in pixels of each item along the choosen axis (ie. vertical or horizontal).  Default is 50.

- `viewport-buffer` - Defines an area in pixels on either end of the viewport where items outside the viewport will still be rendered.

- `orientation` - Whether the list is oriented vertically or horizontally. Default is vertical.

- `recycle` - Boolean flag that indicates whether the component should reuse html element instances to show new items. Default is true.

- `auto-update-mode` - Auto update mode defines what prompts the component to check the dimensions of elements in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.  Default is 'manual'.  Possible settings are:

    - manual: checks only when update() is called.
    - viewport-resize: checks on viewport resize.
    - auto: checks on viewport resize as well as any bubbled scroll/resize events 


_Properties:_

-  `items` -  The array of objects to be displayed.

- `spanmap` - When the array elements are of varying spans authors can pass an array of `SpanMap` objects that corresponds to the position and span of each element in the `items` array.  

-  `viewportElement` -  The HTML element being used as the viewport.

-  `itemTemplate` -  The ViewTemplate used to generate list items in the repeat directive.

-  `listItemContext` -  Used to pass a custom context object to the child list items.  The default object type to pass here is a `VirtualListItemContext`.  Authors that specify custom child types could pass their own custom context objects here as well.

_Slots:_

-   `default`


_functions:_

- `getItemSpanMap = (itemIndex: number): SpanMap | null` - Returns the spanmap object that corresponds to the provided item index.

- `public update(): void` - Requests a layout update.  

#### Virtual List Item  API

_Component name:_

- `fast-virtual-list-item`

_Properties:_

- `itemData` - The data associated with this list item.  Properties can be bound to in the template as `${x => x.itemData.myProperty}`.

- `itemIndex` - The index of the item in the items array. Properties can be bound to in the template as `${x => x.index}`.

-  `listItemContext` - The `listItemContext` assigned to the parent `virtual-list`. It has the following properties:

    - `listItemContentsTemplate` - The `ViewTemplate` to use to use as the template for the `list-context-item`.

    Note that authors can extend the `VirtualListItemContext` type that `virtual-list-item` expects to add their own properties that would then be accessible in the `listItemContentsTemplate` they have provided with a `${x => x.listItemContext.myCustomProp}` binding.



#### The SpanMap interface

Used for virtual lists with varying height elements.  Authors can provide a "map" which corresponds to the spans of the child items.  Authors who use this approach will need to have a quick way of calculating this data. This will not be as fast as a uniform span list, but can still enable the ability to virtualize large data sets if generating the map is fast enough.  

The component also uses the SpanMap interface to expose the position of visible elements as part of the `visibleItemSpans` observable property which child items use to position themselves in the list.

- `start`: The start position of the item in pixels.  
- `span`: The span of the element in pixels.
- `end`: The end position of the element in pixels.


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
