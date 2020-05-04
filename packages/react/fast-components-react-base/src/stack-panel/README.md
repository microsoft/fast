## Stack Panel

NOTE: this component is in initial development and should not yet be considered stable.

The *stack panel* component is a container that enables virtualization of child elements arranged in a horizontal or vertical linear 'stack'. 

### Usage

Virtualization:  When virtualization is enabled the component does not render child items that are not in the visible area of the stackpanel's scrolling region or within the defined buffer zone (ie one or more items outside the viewport).

Note that virtualized elements can't get focus so typically authors will want at least one out of view item instanciated otherwise it will not be possible to tab outside of the viewport.

Authors should be aware that this component writes to the width/left or top/height css style attributes of children on render depending on the orientation of the stack panel.

Keys: authors should strongly consider providing keys (https://reactjs.org/docs/lists-and-keys.html) to child elements to maintain stable identies for child items. 

### Props

 enableVirtualization:  Whether child elements are virtualized or not. Defaults to true.

 neverVirtualizeIndexes: Authors can provide an array of indexes which flag child indexes that should not be virtualized.  For example providing "[0, 10]" to this prop would mean that child items at indexes 0 and 10 would be rendered.

 defaultItemSpan:  The default span of the child items in pixels, this can be overriden on an item by item basis using the "itemSpanOverrides" prop. Default is 100. 

 itemSpanOverrides: An object where the keys correspond to child indexes and the values to the span to be used to calculate layout for the child at that index.

preloadBufferLength: How many out of view child items to render on either side of the viewport. Default is 1.

orientation: Whether the child elements stack vertically or horizontally.  Default is vertical.

onScrollChange:  Callback for when the component scrolls.

initiallyVisibleItemIndex:  When provided the component will initially render with the child at that index scrolled into view.  After the component is initialzed if this is changed to a non-null value the component will 
scroll that item into view.

scrollLayoutUpdateDelay: Enables authors to delay updateing layout (ie. instanciating items) while there is a continuous scroll operation in progress.  The value corresponds to the time interval between dom generated scroll events that must pass before the component updates item layout.  Default is 0 (off).



